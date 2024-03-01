import { agent,minichar, useHistory ,chatChannel} from "./schema"; 
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { getAllGroup } from "@/lib/actions";
import { z } from 'zod';

export type Agent = typeof agent.$inferSelect

export type UseHistory = typeof useHistory.$inferSelect


export type ChatChannel = typeof chatChannel.$inferSelect

export const insertAgent = createInsertSchema(agent)

export const insertAgentWithMiniChar = createInsertSchema(agent).omit({api:true})


export const insertMinichar = createInsertSchema(minichar)

export type AllGroupsWithMemberAndMessage = Awaited<ReturnType<typeof getAllGroup>>;

export type GroupWithMemberAndMessage = AllGroupsWithMemberAndMessage[number];
