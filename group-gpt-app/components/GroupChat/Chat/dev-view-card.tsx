
import {Card,CardContent} from '@/components/ui/card'
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Agent } from "@/drizzle/type-output";
import { GroupMessage } from '@/lib/modules';



interface AgentChatProps {
    agentMember: Agent[];
    initialMessages?:GroupMessage[]
  }


export default function DevViewChart({agentMember,initialMessages}:AgentChatProps){
    return (
        <div>
            <Card className="fixed right-0 top-1/2 transform -translate-y-1/2">
                <CardContent className="grid gap-4">
                    <h1>Agent Member</h1>
                    {agentMember?.map((agent) => (
                    <div key={agent.id}>
                        <div>{agent.name}</div>
                    </div>
                    ))}

      </CardContent>
  </Card>
</div>
      );

}

