"use client";

import { IconPlus } from "@/components/ui/icons";
import { Checkbox } from "@/components/ui/checkbox";
import { createGroupByAgents } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState,useTransition,useEffect } from "react";
import { Agent } from "@/drizzle/type-output";



interface GroupCreateProps {
  allAgents: Agent[];
  children: React.ReactNode;
}

export function PrivateCreate({ allAgents,children }: GroupCreateProps) {

  const [selectedAgent, setSelectedAgent] = useState<Agent[]>([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
	const [isCreatePending, startCreateTransition] = useTransition()

  const handleCheckedChange = (checked: boolean, agent: Agent) => {
    if (checked) {
      // 选中状态，添加agent到selectedAgent数组
      const newSelectedAgents = selectedAgent
        ? [...selectedAgent, agent]
        : [agent];
      setSelectedAgent(newSelectedAgents);
    } else {
      // 取消选中状态，从selectedAgent数组中移除agent
      const newSelectedAgents =
        selectedAgent?.filter((a) => a.id !== agent.id) || null;
      setSelectedAgent(newSelectedAgents);
    }
  };

	useEffect(()=>{
		setSelectedAgent([]);
	},[createDialogOpen])
	// 通过这种方法，实现每次关闭窗口清空选中agent
	// 不然会存在一种错误：选中1个，然后关闭，然后再打开，之前选中的就会被隐式添加进list里面
	// 其实应该从Agent数据逻辑上面扩展，会更直观些，但我懒了


  return (
    <div>
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogTrigger asChild>
          <div onClick={() => setCreateDialogOpen(true)}>
          {children}
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Choose Agent</DialogTitle>
            <DialogDescription>
              Choose One Agent you want to chat
            </DialogDescription>
          </DialogHeader>

          <div>
            {allAgents.map((agent) => (
              <div key={agent.id} className="flex items-center space-x-2 mb-2">
                <Checkbox
                  onCheckedChange={(checked: boolean) => {
                    handleCheckedChange(checked, agent);
                  }}
                />
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {agent.name}
                </label>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button
              type="submit"
							disabled={isCreatePending || selectedAgent.length >1 }
							// @ts-ignore
              onClick={() => {
								startCreateTransition(async()=>{
									await createGroupByAgents(selectedAgent);
									setCreateDialogOpen(false);
									

								})
                
              }}
            >
              Create GroupChat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
