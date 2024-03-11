import {
  OpenAIStream, 
  AIStream, 
  StreamingTextResponse,  
  type AIStreamParser,
  type AIStreamCallbacksAndOptions,
  type AIStreamParserOptions ,
  createStreamDataTransformer

} from 'ai';

// Set the runtime to edge for best performance
export const runtime = 'edge';



function parseCustomStream(): AIStreamParser {
 

  return (data,options) => {

    const parsedJson = JSON.parse(data)

    const delta = parsedJson.content;

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


  const { messages } = await req.json();
 
  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await fetch(
    'http://127.0.0.1:8000/chat',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages:'Hi'
      }),
    },
  )
 
  // Convert the response into a friendly text-stream
  const stream = CustomStream(response,{
    onStart:async()=>{
      console.log('start')
    },
    onToken:async(token)=>{
      // console.log(token)

    },

    onFinal:async(completion)=>{
      console.log('finished')
    },


  
  });

  // Respond with the stream
  return new StreamingTextResponse(stream);
}




// import OpenAI from 'openai';


// import { HttpsProxyAgent } from "https-proxy-agent";
// import http from "http";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
//   httpAgent: new HttpsProxyAgent("http://127.0.0.1:7890"),
// });



// export async function POST(req: Request) {
//   const { messages } = await req.json();
 
//   // Ask OpenAI for a streaming chat completion given the prompt
//   const response = await openai.chat.completions.create({
//     model: 'gpt-3.5-turbo',
//     stream: true,
//     messages,
//   });
 
//   // Convert the response into a friendly text-stream
//   const stream = OpenAIStream(response);
//   // Respond with the stream
//   return new StreamingTextResponse(stream);
// }