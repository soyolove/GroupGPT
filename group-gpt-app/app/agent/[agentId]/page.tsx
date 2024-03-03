'use server'

import { Button } from "@/components/ui/button"

import ShowAllUseHistory from './showAllUseHistory'

import { db } from "@/drizzle/db"
import { agent } from "@/drizzle/schema"
import { eq } from "drizzle-orm"

export default async function Page({params}:{params:{agentId:string}}) {
    // console.log(params.agentId)
    const findAgent = await db.query.agent.findFirst(
        {where:eq(agent.id, params.agentId), 
        with:{
            useHistory:true
        }})

    if (!findAgent) {
        return <div>Agent not found</div>
    }
    
    return(
        <div>
            <div>Agent: {params.agentId}</div>
            <div>
                -----------
            </div>
            <ShowAllUseHistory useHistory={findAgent.useHistory}/>            
        </div>
        
    )
}