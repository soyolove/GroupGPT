'use client'
import { ChatChannel,AllGroupsWithMemberAndMessage } from '@/drizzle/type-output'


import { AnimatePresence, motion } from 'framer-motion'

import {removeGroup,shareChat} from '@/lib/actions'

import { SidebarActions } from '@/components/GroupChat/Sidebar/sidebar-actions'
import { SidebarItem } from '@/components/GroupChat/Sidebar/sidebar-item'

interface SidebarItemsProps {
  groups?: AllGroupsWithMemberAndMessage
}

export function SidebarItems({ groups }: SidebarItemsProps) {
  if (!groups?.length) return null

  return (
    <AnimatePresence>
      {groups.map(
        (group, index) =>
        group && (
            <motion.div
              key={group?.id}
              exit={{
                opacity: 0,
                height: 0
              }}
            >
              <SidebarItem index={index} group={group}>
                <SidebarActions
                  group={group}
                  removeGroup={removeGroup}
                  shareChat={shareChat}
                />
              </SidebarItem>
            </motion.div>
          )
      )}
    </AnimatePresence>
  )
}
