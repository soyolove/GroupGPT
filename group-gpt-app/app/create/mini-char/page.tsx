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
          <h1 className='text-2xl font-bold '>Implementation Layer (mini-char)</h1>
          <div className='text-base text-gray-500'>
              <div className='mb-1'>
              Implementation Layer is the core of the agent. In the abstract, &quot;agent&quot; is a pipeline which accepts information as input then give response as output. And Implementation Layer is the implementation of agent.
              </div>
              <div  className='mb-1'>
                In GroupGPT, we offer a lightweight implementation of agent called &apos;mini-character&apos;(mini-char) built in NextJS&quot;s backend. No need for any coding, just fill the form, then you can get a high-performance agent.
              </div>
              <div  className='mb-1'>
               Mini-char is provided to ensure the full-experience of user. When the GroupGPT project is running, mini-char frame will be available together.
              </div>
              <div  className='mb-1'>
                You can also choose to implement the agent by yourself. To do that, view our document and examples to know to make your own agent.
              </div>

          </div>
        </div>
          
          <div className="mb-4">
          <Label className='text-base font-semibold'>Agent Name</Label>
          <Input 
          type="text" 
          name="agentName" 
          placeholder="agent name"
          className='mt-1 mb-1'
          />
          <label className='text-sm text-gray-500'>The agent&apos;s name. Agent will recognize and response using the name. </label>
 
          </div>


          <div  className="mb-4">
          <Label className='text-base font-semibold'>AI Model</Label>
          <Select name="model" >
            <SelectTrigger className="w-[180px] mt-1 mb-1 ">
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup >
                <SelectLabel>Model</SelectLabel>
                <SelectItem value="gpt-3.5" className='cursor-pointer'>GPT-3.5</SelectItem>
                <SelectItem value="gpt-4" className='cursor-pointer'>GPT-4</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <label className='text-sm text-gray-500'>Model the agent use. Now GPT-3.5 and GPT-4 are available. In future, more models will be intergated.</label>
 
          </div>



          <div  className="mb-4">
          <Label className='text-base font-semibold'>Agent Lore</Label>
          <Input 
          type="text" 
          name="agentLore" 
          placeholder="agent lore"/>
          <label className='text-sm text-gray-500'>
            Lore of the agent, maybe a background story, a special experience, and skills of the agent, etc.. This is the most important part influencing agent act.
            </label>
 
          </div>

          <div  className="mb-4">
          <Label className='text-base font-semibold'>Preferred Language</Label>
          <Input
            type="text"
            name="agentLanguage"
            placeholder="preferred language"
          ></Input>
          <label className='text-sm text-gray-500'>
            The preferred language of agent. We recommend you write the language in language the agent preferred. One agent can have multiple preferred languages.
          </label>
 
          </div>

          <div  className="mb-4">
          <Label className='text-base font-semibold'>Agent Target</Label>
          <Input
            type="text"
            name="agentTarget"
            placeholder="agent target"
          ></Input>
          <label className='text-sm text-gray-500'>
            If the agent has some specific targets to do, set here. It will control the agent&apos;s aims and behaviors.  
          </label>
 
          </div>


          <div  className="mb-4">
          <Label className='text-base font-semibold'>Agent Rule</Label>
          <Input type="text" name="agentRule" placeholder="agent rules"></Input>
          <label className='text-sm text-gray-500'>
            If the agent has some specific rules to follow, set here. If will limit the agent seriously. Sometimes you can also use this to control the agent&apos;s action precisely.
          </label>
 
          </div>

          <div  className="mb-4">
          <Label className='text-base font-semibold'>Agent Speech Examples</Label>
          <Input type="text" name="agentSpeech" placeholder="speech"></Input>
          <label className='text-sm text-gray-500'>
            Give some examples of what the agent will speaking in chat. You can give multiple examples here. Usually a good example will help the agent understand how to speak.
          </label>
 
          </div>


          <SubmitButton>Create</SubmitButton>
        </div>
      </form>

      </div>

    </div>
  );
}
