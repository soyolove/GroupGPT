import OpenAIClient from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { z } from "zod";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { agent, minichar, useHistory } from "@/drizzle/schema";
import { NextApiResponse} from 'next'

import { HttpsProxyAgent } from "https-proxy-agent";
import http from "http";
import { AgentSchema } from "@/drizzle/type-output";

const openai = new OpenAIClient({
  apiKey: process.env.OPENAI_API_KEY,
  httpAgent: new HttpsProxyAgent("http://127.0.0.1:7890"),
});

// Set the runtime to edge for best performance
// export const runtime = 'edge';

// const openai = new OpenAIClient({
//   apiKey: process.env.OPENAI_API_KEY,

// });

const MessageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string(),
  name: z.string().optional(),
});

const GroupMessage = z.object({
  id: z.string().optional(),
  role: z.enum(["user", "agent"]),
  name: z.string(),
  content: z.string(),
});

const ChatSchema = z.object({
  messages: z.array(MessageSchema),
  groupMessages: z.array(GroupMessage),
  agentInfo:AgentSchema
});

const GroupChatSchema = ChatSchema.omit({ messages: true });

interface ChatMessage{
  role: 'assistant' | 'user' | 'system',
  content: string
}

export async function POST(req: Request, res: NextApiResponse) {
  // console.log('receive AI request')
  // const minicharId = params.minicharId;
  const urlList = req.url.split('/')
  const minicharId = urlList[urlList.length-2]

  const { groupMessages: originalGroupMessages,agentInfo:originalAgentInfo } = await req.json(); 

  const validatedFields = GroupChatSchema.safeParse({
    // messages:originalMessages,
    groupMessages: originalGroupMessages,
    agentInfo:originalAgentInfo
  });

  if (!validatedFields.success) {
    return Response.json({
      message: "Invalid messages",
    });
  }

  const { groupMessages,agentInfo } = validatedFields.data;


  const minicharAgent = await db.query.minichar.findFirst({
    where: eq(minichar.id, minicharId),
  });

  if (!minicharAgent) {
    return Response.json({ messages: "the minichar v2 is not found" });
  }

  // console.log(`Get Chat Request of ${minicharAgent.agentName}`);

  if (groupMessages.length == 0) {
    console.log('no message yet. add admin message.')
    groupMessages.push({
      role: "user",
      name: "admin",
      content: "No message yet. You can speak first. Don't include @{name} in your message",
    })
  }

  if (groupMessages.length == 1 && groupMessages[0].name==minicharAgent.agentName){ 
    console.log('just one message and its sent by this agent. add admin message.')
    groupMessages.unshift({
      role: "user",
      name: "admin",
      content: "The first message is yours. Continue Speaking.",
    })

  }
  
  // 问题遗留：目前的架构里，agent无法判断消息是否由自己发出，这是前端和后端展示逻辑分离的副作用

  // console.log(`----detect ${minicharAgent.agentName} input message----`)
  const promptMessagesList : ChatMessage[] = ((groupMessages)=>{
    let promptMessages: ChatMessage[] = []
    let messageBlock = ''
    for (let i = 0; i < groupMessages.length; i++) {
      const message = groupMessages[i]
      if (message.name != agentInfo.name){
        // console.log(`${message.name} is not this agent. add it to block.`)

        messageBlock = messageBlock + `@${message.name} : ${message.content} \n`
      }else{

        // console.log(`spoke by ${minicharAgent.agentName}. refresh the block. block is ${messageBlock}`)
        if (messageBlock !=``){
          promptMessages.push({role:'user',content:messageBlock})
        }
        promptMessages.push({role:'assistant',content:message.content})
        messageBlock = ''
      }

    }
    if (messageBlock !=``){
      promptMessages.push({role:'user',content:messageBlock})
    }

    return promptMessages

  })(groupMessages) 

  // console.log(`<Original Group Messages>`)
  // console.log(groupMessages)

  // console.log(`<Detect Group Messages>`)
  // console.log(promptMessagesList)
  // console.log(`----finished detection of ${minicharAgent.agentName} input message ----`)






  const systemPrompt = `
You are ${minicharAgent.agentName}. Allways act/response/speak as ${minicharAgent.agentName}. 
You are in a group chat, you can see the chat history and response. Others' message will on the format:
@{name} : {message_content}
@{name} : {message_content}
@{name} : {message_content}

When you speak, start your content directly. Don't include "@{name}" in your message. 

Here is your detailed information:
---
Your preferred language is ${minicharAgent.preferLanguage}.
But for all, try to speak the same language as the User.
---
The lore of ${minicharAgent.agentName}(you) is: 
${minicharAgent.agentLore}
---
The target of ${minicharAgent.agentName}(you) is:
${minicharAgent.agentTarget}
---
The rules of ${minicharAgent.agentName}(you) is:
${minicharAgent.agentRule}
---
Some speeching examples of ${minicharAgent.agentName}(you) are here. 
${minicharAgent.agentSpeech}

`;

  let modelName;
  modelName = "gpt-3.5-turbo-0125";
  if (minicharAgent.model == "gpt-3.5") {
    modelName = "gpt-3.5-turbo-0125";
  } else if (minicharAgent.model == "gpt-4") {
    modelName = "gpt-4-0125-preview";
  }

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: modelName,
    stream: true,
    messages: [
      { role: "system", content: systemPrompt },
      ...promptMessagesList,
    ],
  });

  // const stream = OpenAIStream(response);

  // // Respond with the stream
  // return new StreamingTextResponse(stream);

    // 使用异步迭代器遍历 OpenAI 的响应
    async function* generateResponse() {
      for await (const chunk of response) {
        const token = chunk.choices[0].delta.content
        if (token === undefined) {
          break;
        }
        yield `data: ${JSON.stringify({ content: token,status:'ongoing' })}\n\n`;
      }
    }
  
    function iteratorToStream(iterator: any) {
      return new ReadableStream({
        async pull(controller) {
          const { value, done } = await iterator.next()
     
          if (done) {
            controller.close()
          } else {
            controller.enqueue(value)
          }
        },
      })
    }

    const stream = iteratorToStream(generateResponse())
 
    return new Response(stream)

  }



