'use client'
import {useEffect} from 'react'
import {Avatar,AvatarImage,AvatarFallback} from '@/components/ui/avatar'
import { addGroupMessage } from '@/lib/actions'
import { Agent } from '@/drizzle/type-output'

interface Message{

    // id:string;
    name:string;
    role:'user' | 'agent';
    content:string;
  }

interface UserMessageProps{
    userMessage:Message
    groupId:string
    user:Agent
}
  
export default function UserMessage({userMessage,groupId,user}:UserMessageProps){

    

    useEffect(()=>{
        // console.log(1)
        const addMessage = async(groupId:string,agentId:string,message:string) =>{
            await addGroupMessage(groupId,agentId,message)
        }
        addMessage(groupId,user.id,userMessage.content)

    },[])
    return(
        <div>
            <div className="flex flex-row items-center">
            
            <Avatar className='w-5 h-5 mr-2'>
                <AvatarImage  src={user.avatar}/>
                <AvatarFallback>{user.name}</AvatarFallback>
            </Avatar>
            <div className="text-sm">{user.name}
            </div>
            </div>
            <div>{userMessage.content}</div>
      </div>
    )

}