import { SidebarDesktop } from "@/components/GroupChat/Sidebar/sidebar-desktop"
import { getUser } from "@/lib/actions"
import { UserProvider } from "./user-provider"

interface ChatLayoutProps {
  children: React.ReactNode
}

export default async function ChatLayout({ children }: ChatLayoutProps) {
  const user = await getUser()


  return (
    <div className="relative flex h-[calc(100vh_-_theme(spacing.16))] overflow-hidden">
     <UserProvider user={user}/>
     <SidebarDesktop />
      <div className="group w-full overflow-auto pl-0 animate-in duration-300 ease-in-out peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]">
        {children}
      </div>
    </div>
  )
}
