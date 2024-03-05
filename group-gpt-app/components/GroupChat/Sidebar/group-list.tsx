import * as React from 'react'


import { SidebarList } from '@/components/GroupChat/Sidebar/sidebar-list'
import { GroupCreate } from './group-create'
import { getAllAgentWithoutUser } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import { IconPlus } from '@/components/ui/icons'

export async function GroupList() {
  const allAgents = await getAllAgentWithoutUser()

  return (
    <div className="flex flex-col h-full">
      <GroupCreate allAgents={allAgents}>
          <div className="px-2 my-4">
            <Button
              variant="outline"
              className="px-4 h-10 w-full justify-start bg-zinc-50 shadow-none transition-colors hover:bg-zinc-200/40 dark:bg-zinc-900 dark:hover:bg-zinc-300/10"
              
            >
              <IconPlus className="-translate-x-2 stroke-2" />
              New Group
            </Button>
          </div>
      </GroupCreate>

      <React.Suspense
        fallback={
          <div className="flex flex-col flex-1 px-4 space-y-4 overflow-auto">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="w-full h-6 rounded-md shrink-0 animate-pulse bg-zinc-200 dark:bg-zinc-800"
              />
            ))}
          </div>
        }
      >
        <SidebarList  />
      </React.Suspense>
    </div>
  )
}
