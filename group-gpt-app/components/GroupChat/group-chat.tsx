"use client";
import { useState } from "react";
import { Agent } from "@/drizzle/type-output";
import GroupChatMain from '@/components/GroupChat/Chat/group-chat-main'
import { GroupMessage } from "@/lib/modules";
import DevViewChart from '@/components/GroupChat/Chat/dev-view-card'


interface AgentChatProps {
  agentMember: Agent[];
  initialMessages?:GroupMessage[];
  groupId:string;

}
export default function GroupChat({ agentMember,initialMessages,groupId}: AgentChatProps) {
  



  const [maxSpeaking,setMaxSpeaking] = useState(1); // 最多同时发言的agent数量
  const [speakingGap,setSpeakingGap] = useState(5000)
  // const [initialMessage,setInitialMessage] = useState('Hello!')



  return (
    <div>
      <div >
        {agentMember && agentMember.length != 0 && (
          <GroupChatMain 
            groupId = {groupId}
            agentMember={agentMember} 
            maxSpeaking={maxSpeaking} 
            speakingGap={speakingGap}
            initialMessages={initialMessages}
            />
        )}
      </div>

      <DevViewChart agentMember={agentMember} initialMessages={initialMessages}/>



    </div>
  );
}
