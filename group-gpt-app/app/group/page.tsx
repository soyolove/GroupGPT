import { getAllAgentWithUser, getAllAgentWithoutUser } from "@/lib/actions";
import { GroupCreate } from "@/components/GroupChat/Sidebar/group-create";
import { Button } from "@/components/ui/button";
import { PrivateCreate } from "@/components/GroupChat/Sidebar/private-create";
import { Card,CardDescription,CardHeader,CardTitle } from "@/components/ui/card";

export default async function Page() {
  const allAgents = await getAllAgentWithoutUser();

  return (

    <div >

      <div className="flex flex-col justify-center items-center">

      <div className="text-2xl font-bold mt-[10vh]">
        Choose the type of chat you want to create ↓
      </div>
      <div className = 'flex flex-row justify-center mt-[10vh]'>


      
      <div className='pr-10'>
      <GroupCreate allAgents={allAgents}>
        <Card className="w-[300px] h-[300px] border-collapse cursor-pointer hover:bg-opacity-50 hover:border hover:border-blue-500 hover:scale-105 hover:shadow-lg transition duration-300 ease-in-out">
          <CardHeader className="pt-10">
              <CardTitle>Create Group Chat</CardTitle>
              <CardDescription className="pt-5">
                <div className='mb-1'>
                  Select multiple agents then chat
                </div>
                <div className='mb-1'>
                  You can adjust detailed parameters of the group chat in the future.
                </div>
              </CardDescription>
            </CardHeader>
        </Card>

      </GroupCreate>
      </div>
      <div>
      <PrivateCreate allAgents={allAgents}>
      <Card className="w-[300px] h-[300px] border-collapse cursor-pointer hover:bg-opacity-50 hover:border hover:border-blue-500 hover:scale-105 hover:shadow-lg transition duration-300 ease-in-out">
          <CardHeader className="pt-10">
              <CardTitle>Create Private Chat</CardTitle>
              <CardDescription className="pt-5">
                <div className='mb-1'>
                  Select one agent then chat
                </div>
                <div className='mb-1'>
                  It&apos;s very similar to traditional chat-bot like ChatGPT/Poe. 
                </div>
                <div>
                  However, remember agent is smart. Something interesting may happen when the developer add some &apos;tricks&apos; in the agent.
                </div>
              </CardDescription>
            </CardHeader>
        </Card>

      </PrivateCreate>
      </div>
      </div>


    </div>
    </div>
   

  )
  
 
}
