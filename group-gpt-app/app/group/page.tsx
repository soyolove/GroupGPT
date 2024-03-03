import { getAllAgentWithUser, getAllAgentWithoutUser } from "@/lib/actions";
import { GroupCreate } from "@/components/GroupChat/Sidebar/group-create";


export default async function Page() {
  const allAgents = await getAllAgentWithoutUser();

  return <GroupCreate allAgents={allAgents} />;
}
