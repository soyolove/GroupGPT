'use client'
import { Agent } from "@/drizzle/type-output"
import { useEffect, useState } from "react"
import { CreateUser } from "@/components/create-user"

interface UserProviderProps{
    user?:Agent

}
export function UserProvider({user}:UserProviderProps){
    const [userExist,setUserExist] = useState<boolean>(false)
    
    useEffect(()=>{
        if (!user){

            setUserExist(true)
        }
    },[])


    return(
        <div>
            <CreateUser open={userExist} setOpen={setUserExist}></CreateUser>
        </div>
        
    )
    

}