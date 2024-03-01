import OpenAIClient from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { z } from "zod";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { minichar, useHistory } from "@/drizzle/schema";

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

export async function POST(req: Request, { params }: { params: {minicharId:string} }) {
  // console.log('receive AI request')
  const minicharId = params.minicharId;

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
  const messages = validatedFields.data;

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

  // Convert the response into a friendly text-stream
  let startTimestamp: number;
  let timeCost: number;
  let tokenCost = 0;

  const stream = OpenAIStream(response, {
    onStart: async () => {
      // 计时开始
      startTimestamp = Date.now();
    },
    onFinal: async (completion) => {
      timeCost = Date.now() - startTimestamp;
      // console.log(timeCost)
      // console.log(tokenCost)
    },
    onToken: async (token) => {
      // console.log(token)

      // 最简单的方法计算token消耗
      tokenCost = tokenCost + 1;
    },
  });

  // Respond with the stream
  return new StreamingTextResponse(stream);
}
