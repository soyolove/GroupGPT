'use client'

import { Agent } from "@/drizzle/type-output";
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input";

interface SelectAgentProps {
    allAgents:Agent[];
    setSelectedAgent: (state: Agent[] | null) => void;
    selectedAgent: Agent[] | null;
    maxSpeaking:number;
    speakingGap:number;
    setMaxSpeaking:(state:number)=>void;
    setSpeakingGap:(state:number)=>void;
    initialMessage:string;
    setInitialMessage:(state:string)=>void;


}

export default function SelectAgent({
  setSelectedAgent,
  allAgents,
  selectedAgent,
  maxSpeaking,
  setMaxSpeaking,
  speakingGap,
  setSpeakingGap,
  initialMessage,
  setInitialMessage
}: SelectAgentProps){


  
  const handleCheckedChange = (checked: boolean, agent: Agent) => {
    if (checked) {
        // 选中状态，添加agent到selectedAgent数组
        const newSelectedAgents = selectedAgent ? [...selectedAgent, agent] : [agent];
        setSelectedAgent(newSelectedAgents);
    } else {
        // 取消选中状态，从selectedAgent数组中移除agent
        const newSelectedAgents = selectedAgent?.filter(a => a.id !== agent.id) || null;
        setSelectedAgent(newSelectedAgents);
    }
};




    return(
        <div>
          <Label>
            Choose Agents
          </Label>
          {allAgents.map((agent) => (
            <div key={agent.id}>
              <Checkbox onCheckedChange={(checked)=>{
                if (typeof checked === 'boolean'){
                handleCheckedChange(checked,agent)
              }
              }}/>
              <label>{agent.name}</label>
              {/* <Checkbox asChild><Button>{agent.name}</Button></Checkbox> */}
            </div>
          ))}

          <div>
            <Label>Max Speaking</Label>
            <Input type="number" placeholder="Less than Number of Selected Agents"  value={maxSpeaking} onChange={(e)=>setMaxSpeaking(parseInt(e.target.value))}/>
            </div>
          <div>
            <Label>Speaking Gap</Label>
            <Input type="number" placeholder="ms | recommend > 5000 ms"  value={speakingGap} onChange={(e)=>setSpeakingGap(parseInt(e.target.value))}/>
            </div>  

            <div>
              <Label>Initial Message</Label>
              <Input type="text" placeholder="Initial Message" value={initialMessage} onChange={(e)=>setInitialMessage(e.target.value)}/>

            </div>

        </div>
    )
}