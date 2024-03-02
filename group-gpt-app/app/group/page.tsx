import { getAllAgentWithUser, getAllAgentWithoutUser } from "@/lib/actions";
import GroupChatMain from "@/components/GroupChat/group-chat";


export default async function Page() {
  const allAgents = await getAllAgentWithoutUser();

  return <GroupChatMain agentMember={allAgents} />;
}
