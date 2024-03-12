import {
  OpenAIStream, 
  AIStream, 
  StreamingTextResponse,  
  type AIStreamParser,
  type AIStreamCallbacksAndOptions,
  type AIStreamParserOptions ,
  createStreamDataTransformer

} from 'ai';
import {z} from 'zod'


// Set the runtime to edge for best performance
export const runtime = 'edge';




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
  agentAPI:z.string(),
});

const GroupChatSchema = ChatSchema.omit({ messages: true });



function parseCustomStream(): AIStreamParser {
 
  return (data,options) => {
    const parsedJson = JSON.parse(data) as {
      content:string | null;
      state:string | null;
    }

    const delta = parsedJson.content? parsedJson.content : '';
    return delta

  };
}

function CustomStream(
  res: Response,
  cb?: AIStreamCallbacksAndOptions,
): ReadableStream {
  return AIStream(res, parseCustomStream(), cb).pipeThrough(
    createStreamDataTransformer(cb == null ? void 0 : cb.experimental_streamData)
  );;
}


export async function POST(req: Request) {


  const { groupMessages: originalGroupMessages,agentAPI:originalAgentAPI } = await req.json(); 

  const validatedFields = GroupChatSchema.safeParse({
    groupMessages: originalGroupMessages,
    agentAPI:originalAgentAPI 
    
  });

  
  if (!validatedFields.success) {
    return Response.json({
      message: "Invalid messages",
    });
  }

  const { groupMessages,agentAPI } = validatedFields.data;

  console.log(agentAPI)


  const response = await fetch(
    agentAPI+'/groupchat',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        groupMessages:groupMessages
      }),
    },
  )
 
  let startTimestamp: number;
  let timeCost: number;
  let tokenCost = 0;
  // Convert the response into a friendly text-stream
  const stream = CustomStream(response,{
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

