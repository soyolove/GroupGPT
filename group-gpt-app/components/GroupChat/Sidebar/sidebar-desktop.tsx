import { Sidebar } from '@/components/GroupChat/Sidebar/sidebar'

import { GroupList } from '@/components/GroupChat/Sidebar/group-list'

export async function SidebarDesktop() {

  return (
    <Sidebar className="peer absolute inset-y-0 z-30 hidden -translate-x-full border-r bg-muted duration-300 ease-in-out data-[state=open]:translate-x-0 lg:flex lg:w-[250px] xl:w-[300px]">
      <GroupList />
    </Sidebar>
  )
}
