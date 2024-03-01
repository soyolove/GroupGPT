"use client";
import SelectAgent from "./selectAgent";
import Chat from "./groupChatMain";
import { useState } from "react";
import { Agent } from "@/drizzle/type-output";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"


interface AgentChatProps {
  agents: Agent[];
}
export default function GroupChat({ agents }: AgentChatProps) {
  const [selectedAgent, setSelectedAgent] = useState<Agent[] | null>(null);
  const [goChat, setGoChat] = useState<Boolean>(false);



  const [maxSpeaking,setMaxSpeaking] = useState(1); // 最多同时发言的agent数量
  const [speakingGap,setSpeakingGap] = useState(5000)
  const [initialMessage,setInitialMessage] = useState('Hello!')


  // const [teststate,setTeststate] = useState('')

  return (
    <div>
      <div>
        <Card className="fixed left-0 top-1/2 transform -translate-y-1/2">
            <CardContent className="grid gap-4">
                <SelectAgent
                setSelectedAgent={setSelectedAgent}
                allAgents={agents}
                selectedAgent={selectedAgent}
                maxSpeaking={maxSpeaking}
                setMaxSpeaking={setMaxSpeaking}
                speakingGap={speakingGap}
                setSpeakingGap={setSpeakingGap}
                initialMessage={initialMessage}
                setInitialMessage={setInitialMessage}

                />

                {selectedAgent?.length != 0 && (
                <div>
                    The selectedAgents are{" "}
                    {selectedAgent?.map((agent) => (
                    <div key={agent.id}>
                        <div>{agent.name}</div>
                    </div>
                    ))}
                </div>
                )}


                <Button 
                onClick={() => setGoChat(true)}
                disabled={!selectedAgent || selectedAgent?.length == 0 || selectedAgent?.length < maxSpeaking }
                >Start</Button>

                

            </CardContent>
        </Card>
      </div>




      <div >
        {goChat && selectedAgent && selectedAgent.length != 0 && (
          <Chat selectedAgent={selectedAgent} maxSpeaking={maxSpeaking} speakingGap={speakingGap} initialMessage={initialMessage}/>
        )}
      </div>
    </div>
  );
}
