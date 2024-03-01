import {Agent} from '@/drizzle/type-output'

export interface Message{
    id:string;
    name:string;
    role:'user' | 'agent';
    content:string;
  }
  
export interface GroupMessage extends Message{
    agent?:Agent;
  }