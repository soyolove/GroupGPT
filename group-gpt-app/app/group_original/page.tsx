import {getAllAgent} from "@/lib/actions"
import GroupChat from './groupChatFrame'

export default async function Page(){

    // const allAgents = await getAllAgentByAuth()
    const allAgents = await getAllAgent()

    if (Array.isArray(allAgents)){
        return(
                <GroupChat agents={allAgents}/>
            
        )
    
    } else {
        return(
            <div>
                Something wrong.
                {JSON.stringify(allAgents)}
            </div>
        )
    }





}
