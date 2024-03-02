
import { Agent } from "@/drizzle/type-output";
import { getAllAgentWithoutUser } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import Link  from "next/link";
import { Avatar,AvatarImage } from "@/components/ui/avatar";


export default async function Page(){
    const agents = await getAllAgentWithoutUser();

    return(
        <div>
            <h1>My Page</h1>
            <div>
                <h2>My Agents</h2>
                
                {Array.isArray(agents) ? <ShowAgents agents={agents} /> : <div>{JSON.stringify(agents)}</div>  }
            </div>
        </div>
    )

}

async function ShowAgents({agents}:{agents:Agent[]}){
    return(
        <ul>
            {agents.map(agent => {
                return <li key={agent.id}>
                    <Avatar>
                        <AvatarImage src={agent.avatar} />
                    </Avatar>
                    <div>{agent.name}</div>
                    <div>{agent.intro}</div>
                    <Link href={`/agent/${agent.id}`}><Button>View Details</Button></Link>
                    <div>---</div>
                    </li>
            })}
        </ul>
    )
}

