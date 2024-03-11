from fastapi import FastAPI,Request
from fastapi.responses import StreamingResponse
import asyncio
from openai import AsyncOpenAI
import httpx
from dotenv import load_dotenv
from pydantic import BaseModel
import json

load_dotenv()

client = AsyncOpenAI(http_client=httpx.AsyncClient(
    proxies='http://127.0.0.1:7890',
    ))

app = FastAPI()



class ChatProps(BaseModel):
    messages:str

class ResponseChunk(BaseModel):
    content:str
    appendix:str = 'some appendix'


@app.post('/chat')
async def chat(chatprops:ChatProps):

    prompt = chatprops.messages
    
    async def generate_response(prompt):
             
        openaiResponse = await client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {
            "role": "user",
            "content": prompt
            }
        ],
        temperature=1,
        max_tokens=256,
        top_p=1,
        # tools=tools,
        # tool_choice='auto',
        stream=True
        )
   
    
        async for chunk in openaiResponse:
            token = chunk.choices[0].delta.content
            if token == None:
                break
            print(token)
            
            responsechunk = ResponseChunk(content=token)
            
            yield f'data: {(responsechunk.model_dump_json())}\n\n'
        
    
    return StreamingResponse(generate_response(prompt))