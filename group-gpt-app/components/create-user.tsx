"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui//label";
import { Input } from "@/components/ui/input";
import { createUser } from "@/lib/actions";
import { UpdateEditAvatar } from "./update-edit-avatar";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useFormStatus } from 'react-dom'
import { useRouter } from "next/navigation";


interface CreateUserProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function CreateUser({ open, setOpen }: CreateUserProps) {
  const [avatar, setAvatar] = useState({ data: "" });
  const router = useRouter()

  return (
    <div>
      
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create User Profile</DialogTitle>
              <DialogDescription>
                You haven's create your user profile. Input your avatar and
                name, then agents will recognize you better.
              </DialogDescription>
            </DialogHeader>
            <form action={async(formdata:FormData)=>{
                    await createUser(formdata)
                    setOpen(false)
            }}>

            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">

                <div className="flex flex-col">

                
                <Label className="text-base font-semibold ">Avatar</Label>

                <UpdateEditAvatar setAvatar={setAvatar} >
                  <Avatar className="mt-1 mb-1 ml-3 w-20 h-20 cursor-pointer hover:bg-opacity-50 hover:border hover:border-blue-500 hover:scale-105 hover:shadow-lg transition duration-300 ease-in-out">
                    <AvatarImage src={avatar.data}></AvatarImage>
                    <AvatarFallback className="text-center font-semibold">
                      Upload
                    </AvatarFallback>
                  </Avatar>
                </UpdateEditAvatar>
                </div>

                
                <input
                  hidden={true}
                  name="userAvatar"
                  defaultValue={avatar.data}
                ></input>

                <Label className="text-base font-semibold ">Username</Label>
                <Input
                  id="username"
                  name="userName"
                  placeholder="Input your username"
                />
              </div>
            </div>

            <SubmitButton>Create</SubmitButton>
            </form>
{/*             
            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                
              </DialogClose>
            </DialogFooter> */}
          </DialogContent>
        </Dialog>
      
    </div>
  );
}



 


function SubmitButton({children}:{children:React.ReactNode}) {
  const { pending } = useFormStatus()
 
  return (
    <Button className="mt-2 w-20 " type="submit" disabled={pending}>
      {children}
    </Button>
  )
}