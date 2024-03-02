import { SidebarItems } from '@/components/GroupChat/Sidebar/sidebar-items'
import { getAllGroup } from '@/lib/actions'
// import { ThemeToggle } from '@/components/theme-toggle'

interface SidebarListProps {
  children?: React.ReactNode
}


export async function SidebarList() {
  const groups = await getAllGroup()
  

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-auto">
        {groups?.length ? (
          <div className="space-y-2 px-2">
            <SidebarItems groups={groups} />
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-sm text-muted-foreground">No Groups</p>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between p-4">
        {/* <ThemeToggle /> */}
        {/* <ClearHistory clearChats={clearChats} isEnabled={chats?.length > 0} /> */}
      </div>
    </div>
  )
}
