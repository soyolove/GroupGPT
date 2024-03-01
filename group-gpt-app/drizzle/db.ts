import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema';

import { createClient } from '@supabase/supabase-js'


const connectionString = process.env.DATABASE_URL as string


const client = postgres(connectionString)
export const db = drizzle(client,{schema});

const supabaseURL = process.env.SUPABASE_URL as string
const supabaseKey = process.env.SUPABASE_KEY as string
export const supabase = createClient(supabaseURL, supabaseKey)




