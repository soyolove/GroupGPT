import * as React from 'react'


import { SidebarList } from '@/components/GroupChat/Sidebar/sidebar-list'
import { GroupCreate } from './group-create'
import { getAllAgentWithoutUser } from '@/lib/actions'

export async function GroupList() {
  const allAgents = await getAllAgentWithoutUser()

  return (
    <div className="flex flex-col h-full">
      <GroupCreate allAgents={allAgents}/>

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
