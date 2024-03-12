import OpenAIClient from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { z } from "zod";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { minichar, useHistory } from "@/drizzle/schema";
import { NextApiResponse} from 'next'

import { HttpsProxyAgent } from "https-proxy-agent";
import http from "http";

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
});

const GroupChatSchema = ChatSchema.omit({ messages: true });

export async function POST(req: Request, res: NextApiResponse) {
  // console.log('receive AI request')
  // const minicharId = params.minicharId;
  const urlList = req.url.split('/')
  const minicharId = urlList[urlList.length-2]

  const { groupMessages: originalGroupMessages } = await req.json(); 

  const validatedFields = GroupChatSchema.safeParse({
    // messages:originalMessages,
    groupMessages: originalGroupMessages,
  });

  if (!validatedFields.success) {
    return Response.json({
      message: "Invalid messages",
    });
  }

  const { groupMessages } = validatedFields.data;

  const ChatHistory: string = groupMessages
    .map((message) => {
      return `${message.role}:${message.name}:${message.content}`;
    })
    .join("\n");
  const GroupPrompt = `
This is a group chat history. You are in the group.
'''
${ChatHistory}
'''
Now it's your turn to speak. Don't include any formats. Just response directly. And remember, it's a group channel, so your response should not be too long. 
Dom't repeat the dialogue. All messages showed in the history have been sent.
Your response is:`;

  const minicharAgent = await db.query.minichar.findFirst({
    where: eq(minichar.id, minicharId),
  });

  if (!minicharAgent) {
    return Response.json({ messages: "the minichar v2 is not found" });
  }

  console.log(`Get Chat Request of ${minicharAgent.agentName}`);

  const systemPrompt = `
You are ${minicharAgent.agentName}. Allways act/response/speak as ${minicharAgent.agentName}. 
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
Please speaking like these few-shots:
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
      { role: "user", content: GroupPrompt },
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



