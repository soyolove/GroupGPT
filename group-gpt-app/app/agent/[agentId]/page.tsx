'use server'

import { Button } from "@/components/ui/button"
import TestAPI from "./testAPI"
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
            <div>This is the Agent: {params.agentId}</div>
            <TestAPI />
            <div>
                -----------
            </div>
            <ShowAllUseHistory useHistory={findAgent.useHistory}/>            
        </div>
        
    )
}