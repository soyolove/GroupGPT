import { getGroupById,getUser } from "@/lib/actions";
import GroupChatMain from "@/components/GroupChat/group-chat";
import { GroupMessage } from "@/lib/modules";

export default async function Page({params}:{params:{channelId:string}}) {

  const group = await getGroupById(params.channelId);
	const user = await getUser();
  
  if (!user){
		return <div>Create your User profile FIRST</div>
	}

  if (!group){
    return <div>Group not found</div>
  }

  const agents = group.members.map(member=>member.agent)
  const groupMessages = group.messageHistory.map((message)=>{
    return{
        id:message.id,
        name:message.agent.name,
        role: message.agent.isUser? 'user' : 'agent',
        agent:message.agent,
        initialContent:message.message,
        content:message.message

    } as GroupMessage
  })



  return <GroupChatMain user={user} groupId={params.channelId} agentMember={agents} initialMessages={groupMessages}/>;
}
