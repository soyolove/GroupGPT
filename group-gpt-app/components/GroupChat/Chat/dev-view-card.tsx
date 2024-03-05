import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Agent } from "@/drizzle/type-output";
import { GroupMessage } from "@/lib/modules";

interface AgentChatProps {
  agentMember: Agent[];
  initialMessages?: GroupMessage[];
  ongoingMessages: GroupMessage[];
  speakingOrder: Agent[];
}

export default function DevViewChart({
  agentMember,
  initialMessages,
  ongoingMessages,
  speakingOrder,
}: AgentChatProps) {
  return (
    <div>
      <Card className="fixed right-0 top-1/2 transform -translate-y-1/2">
        
        <CardContent className="gap-2">

        <h1 className="font-bold">**Just for development**</h1>
          <h1 className="font-bold">Agent Member</h1>
          {agentMember?.map((agent) => (
            <div key={agent.id}>
              <div>{agent.name}</div>
            </div>
          ))}

          <h1 className="font-bold">Speaking Order</h1>
          {speakingOrder?.map((agent) => (
            <div key={agent.id}>
              <div>{agent.name}</div>
            </div>
          ))}

          <h1 className="font-bold">In Speaking Agent</h1>

          {ongoingMessages.map((message) =>
            message.agent ? (
              <div key={message.id}>{message.agent.name}</div>
            ) : (
              <div key={message.id}>User</div>
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
}
