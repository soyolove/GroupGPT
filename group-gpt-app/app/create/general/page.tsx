'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SubmitButton from "@/components/submittedButton";
import { createNewAgentWithMinichar } from "@/lib/actions";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UpdateEditAvatar } from "@/components/update-edit-avatar";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator"


export default function Page() {
  
  
  const [avatar,setAvatar] = useState({data:''})
  




  return (
    <div>

      <div className='pr-40 pl-10 pt-10 pb-10'>


       
      <form action={createNewAgentWithMinichar}>
        <div>
        
        <div className='mb-8 max-w-3xl'>
          <h1 className='text-2xl font-bold '>Access Layer</h1>
          <div className='text-base text-gray-500'>
              <div className='mb-1'>
                GroupGPT divides the project to two parts: Access Layer and Implementation Layer.
              </div>
              <div className='mb-1'>
                Generally, when a developer finish the agent-implementation, he/she wants to distribute and share the agent in a platform. GroupGPT allows the developer to access agent to this platform by API endpoints. 
              </div>
              <div className='mb-1'>
                So, Access Layer will only influence what the agent shows in the platform. You can set avatar, name and introduction. All these information will show on platform and won&apos;t influence any inplementation of the agent.
              </div>
          </div>
        </div>

        <div className='mb-4'>
        <Label className='text-base font-semibold mb-5'>Avatar</Label>
        <UpdateEditAvatar setAvatar={setAvatar}>

          <Avatar className="mt-1 mb-1 w-20 h-20 cursor-pointer hover:bg-opacity-50 hover:border hover:border-blue-500 hover:scale-105 hover:shadow-lg transition duration-300 ease-in-out">
            <AvatarImage src={avatar.data}></AvatarImage>
            <AvatarFallback className='text-center'>Upload</AvatarFallback>
          </Avatar>
        </UpdateEditAvatar>

        <input hidden={true} name='agentAvatar' defaultValue={avatar.data}></input>
        
        </div>
        
        
          <div className="mb-4">

          
          <Label className='text-base font-semibold mt-4'>Name</Label>
          <Input
            type="text"
            name="agentShowName"
            placeholder="Agent Show Name"
            className='mt-1 mb-1'
            
          ></Input>
          <label className='text-sm text-gray-500'>The name showed in this project. It won&apos;t influence anything in agent layer.</label>
          </div>

          <div className="mb-4">
          <Label className='text-base font-semibold'>Introduction</Label>
          <Input 
          type="text" 
          name="agentIntro" 
          placeholder="Intro" 
          className='mt-1 mb-1' />
          <label className='text-sm text-gray-500'>An introduction to your agent. It won&apos;t influence anything in agent layer.</label>
          
          </div>

          <Separator className='mt-10 mb-10'/>

          

          <div className='mb-8 max-w-3xl'>
          <h1 className='text-2xl font-bold '>Implementation Layer</h1>
          <div className='text-base text-gray-500'>
              <div className='mb-1'>
              Implementation Layer is the core of the agent. In the abstract, &quot;agent&quot; is a pipeline which accepts information as input then give response as output. And Implementation Layer is the implementation of agent.
              </div>
              <div className="mb-1">
                Now, agents are connected to GroupGPT by API endpoints. The endpoints can be from any sources, like localhost/docker/internet. As long as your agent can be interacted by API, and the format of the API is correct, you can connect your agent to GroupGPT.
              </div>
              <div className="mb-1">
                You can find some agent templates in the github repository, which may help you build your agent.

              </div>

          </div>
        </div>
          
          <div className="mb-4">
          <Label className='text-base font-semibold'>API</Label>
          <Input 
          type="text" 
          name="agentAPI" 
          placeholder="API endpoint"
          className='mt-1 mb-1'
          />
          <label className='text-sm text-gray-500'>
            <div>The agent implementation &apos;s API. The format should belike thest examples:</div>
            <div>"http://127.0.0.1:8000" (localhost with port)</div>
            <div>"http://react-agent:5462"(docker with port)</div>
            <div>"https://anyagentservice.ai/api/agent/xxx"(agent from internet)</div>
            </label>
 
          </div>


          <SubmitButton>Create</SubmitButton>
        </div>
      </form>

      </div>

    </div>
  );
}
