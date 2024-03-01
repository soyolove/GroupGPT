'use client'
import {useEffect} from 'react'
import {Avatar,AvatarImage,AvatarFallback} from '@/components/ui/avatar'


interface Message{

    // id:string;
    name:string;
    role:'user' | 'agent';
    content:string;
  }

interface UserMessageProps{
    userMessage:Message
}
  
export default function UserMessage({userMessage}:UserMessageProps){


    useEffect(()=>{
        console.log(1)
    },[])
    return(
        <div>
            <div className="flex flex-row items-center">
            
            <Avatar className='w-5 h-5 mr-2'>
                <AvatarImage  src="https://u2ewvsbhuhjy8vhw.public.blob.vercel-storage.com/566952b7b5cc5415e33122b20400ba0-5Bw62REotU3XER1NNgvkQGYqjlNm9A.jpg"/>
                <AvatarFallback>UserName</AvatarFallback>
            </Avatar>
            <div className="text-sm">You
            </div>
            </div>
            <div>{userMessage.content}</div>
      </div>
    )

}