import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  uuid,
  pgEnum,
  jsonb,
  boolean,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { relations } from 'drizzle-orm';







export const agent = pgTable("agent", {
  id: uuid("id").default(sql`uuid_generate_v4()`).primaryKey().notNull(),
  isUser:boolean('isUser').default(false).notNull(),
  avatar:text('avatar').default('https://u2ewvsbhuhjy8vhw.public.blob.vercel-storage.com/566952b7b5cc5415e33122b20400ba0-5Bw62REotU3XER1NNgvkQGYqjlNm9A.jpg').notNull(),
  name:text("name").notNull(),
  intro:text("intro").notNull(),
  createAt:timestamp("createAt", { mode: "date" }).defaultNow().notNull(),
  api:text("api").notNull(),

});



export const useHistory = pgTable("useHistory",{
  id:uuid("id").default(sql`uuid_generate_v4()`).primaryKey().notNull(),
  agentId:uuid('agentId').notNull().references(() => agent.id, { onDelete: "cascade" }),
  tokenCost:integer('tokenCost').default(0).notNull(),
  timeCost:integer('timeCost'),
  details:text('details').notNull(),
  createAt:timestamp("createAt", { mode: "date" }).defaultNow().notNull(),
})

export const messageHistory = pgTable("messageHistory",{
  id:uuid("id").default(sql`uuid_generate_v4()`).primaryKey().notNull(),
  agentId:uuid('agentId').notNull().references(() => agent.id, { onDelete: "cascade" }),
  channelId:uuid('channelId').notNull().references(() => chatChannel.id, { onDelete: "cascade" }),
  message:text('message').notNull(),
  createAt:timestamp("createAt", { mode:'date' }).defaultNow().notNull(),
  
})

export const chatChannel = pgTable("chatChannel",{
  id:uuid("id").default(sql`uuid_generate_v4()`).primaryKey().notNull(),
  groupName:text('groupName').default('New Group').notNull(),
  lastUpdatedTime:timestamp("lastUpdatedTime", { mode:'date' }).defaultNow().notNull(),
})



export const agentsToChannels = pgTable('agents_to_channels', {
  agentId: uuid('agent_id').notNull().references(() => agent.id),
  channelId: uuid('channel_id').notNull().references(() => chatChannel.id),
}, (t) => ({
  pk: primaryKey({columns: [t.agentId, t.channelId]})}),
)



export const agentRelations = relations(agent,({one,many})=>({
  useHistory:many(useHistory),
  messageHistory:many(messageHistory),
  agentsToChannels:many(agentsToChannels)
}))

export const channelRelations = relations(chatChannel,({many})=>({
  messageHistory:many(messageHistory),
  members:many(agentsToChannels)
}))



export const agentToChannelRelations = relations(agentsToChannels,({one})=>({
  agent:one(agent,{
    fields:[agentsToChannels.agentId],
    references:[agent.id]
  }),
  channel:one(chatChannel,{
    fields:[agentsToChannels.channelId],
    references:[chatChannel.id]
  })
}))


export const messageHistoryRelations = relations(messageHistory,({one})=>({
  agent:one(agent, {
    fields:[messageHistory.agentId],
    references:[agent.id]
  }),
  chatChannel:one(chatChannel,{
    fields:[messageHistory.channelId],
    references:[chatChannel.id]
  })
}))


export const useHistoryRelations = relations(useHistory,({one})=>({
  agent:one(agent,{
    fields:[useHistory.agentId],
    references:[agent.id]
  }),
}))





export const modelEnum = pgEnum('model', ['gpt-4','gpt-3.5','gemini-1','gemini-1.5']);


export const minichar = pgTable("minichar",{
  id:uuid("id").default(sql`uuid_generate_v4()`).primaryKey().notNull(),
  model:modelEnum('model').default('gpt-3.5').notNull(),
  agentName:text('agentName').notNull(),
  agentLore:text('agentLore').notNull(),
  preferLanguage:text('preferLanguage').notNull(),
  agentTarget:text('agentTarget').notNull(),
  agentRule:text('agentRule').notNull(),
  agentSpeech:text('agentSpeech').notNull(),
  
})


