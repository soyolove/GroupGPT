'use server'

import { db } from "@/drizzle/db";
import { agent,chatChannel,minichar } from "@/drizzle/schema";
import { sql, eq } from "drizzle-orm";
import { insertAgent, insertMinichar,insertAgentWithMiniChar } from "@/drizzle/type-output";
import {v4} from 'uuid'
import { supabase } from "@/drizzle/db";
import { redirect } from 'next/navigation';


export async function removeGroup(groupId:string){
  'use server'
  const deleteGroup = await db.delete(chatChannel).where(eq(chatChannel.id,groupId))
  return deleteGroup
}

export async function shareChat(groupId:string){
  'use server'
  try{
    return groupId

  }catch(e){
    return{
      error: 'unknown error'
    }
  }
}



export async function getAllGroup(){
  'use server'
  const groups = await db.query.chatChannel.findMany({
    with:{
      messageHistory:true,
      members:true
    }
  })
  return groups
}


export async function getAgentById(id: string) {
  'use server'

  const agentQuery = await db.query.agent.findFirst({
    where: eq(agent.id, id),
  });
  return agentQuery;
}



export async function getAllAgent() {
  'use server'
  console.log('getting the agent')
  


  const agents = await db.query.agent.findMany({
    with:{
      useHistory:true
    }
  });
  // console.log(agents)

  return agents

}



export async function createNewAgentWithMinichar(formdata: FormData) {
  "use server";

  // let user;

    
  const agentValidatedFields = insertAgentWithMiniChar.safeParse({
    avatar: formdata.get("agentAvatar"),
    name: formdata.get("agentShowName"),
    intro: formdata.get("agentIntro"),
  });

  if (!agentValidatedFields.success) {
    console.log("not success");

    console.log(agentValidatedFields.error.flatten().fieldErrors);
    return {
      errors: agentValidatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Agent.",
    };
  }
  const {avatar:avatarBase64, name, intro } = agentValidatedFields.data;

  const minicharValidatedFields = insertMinichar.safeParse({
    model:formdata.get("model"),
    agentName: formdata.get("agentName"),
    agentLore: formdata.get("agentLore"),
    preferLanguage: formdata.get("agentLanguage"),
    agentTarget: formdata.get("agentTarget"),
    agentRule: formdata.get("agentRule"),
    agentSpeech: formdata.get("agentSpeech"),
  })

  if (!minicharValidatedFields.success) {
    console.log("not success");
    console.log(minicharValidatedFields.error.flatten().fieldErrors);
    return {
      errors: minicharValidatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Minichar.",
    };
  }

  const {model,agentName, agentLore, preferLanguage, agentTarget, agentRule, agentSpeech} = minicharValidatedFields.data


  if (!avatarBase64){
    return {
      errors: {avatar: "avatar is required"},
      message: "Missing Fields. Failed to Create Agent.",
    }
  }



  function dataURLToBlob(dataURL:string) {
    return fetch(dataURL).then(res => res.blob());
}

  // function blobToFile(blob:Blob, fileName:string) {
  //   return new File([blob], fileName, { type: blob.type });
  // }


const agentId = v4()
const minicharId = v4()


  const blob = await dataURLToBlob(avatarBase64);

    // 将Blob对象转换为File对象
    // 这里需要一个文件名，你可以从form中获取，或者自动生成
    const fileName = `$avatar_${agentId}.png`; // 替换为实际的文件名
    // const file = blobToFile(blob, fileName);

    // 上传File对象
    // const uploadResult = await put(file.name, file, { access: 'public' });
    
    const uploadAvatar = async(fileName:string,blob:Blob)=>{
      const response = await supabase.storage.from('avatar').upload(fileName, blob)
      return response
    }

    let avatarPath:string
    avatarPath = ''
    const {data,error} = await uploadAvatar(fileName,blob)
    if (error){
      console.log(error)
      console.log('storage bucker has not been created. creating one now automaticly.')
      await supabase.storage.createBucket('avatar',{public:true})
      const {data:data_2nd,error:error_2nd} = await uploadAvatar(fileName,blob)
      if (data_2nd){
        avatarPath = data_2nd.path
      }

    }else{
      avatarPath = data.path
    }

  const { data:publicAvatarData } = supabase
  .storage
  .from('avatar')
  .getPublicUrl(avatarPath)

  
  
  

  const agentResponse = await db.insert(agent).values({
    avatar:publicAvatarData.publicUrl,
    id:agentId,
    name: name,
    intro: intro,
    api:`/api/mini-character/${minicharId}`
  });
  // console.log(agentResponse);



  const minicharResponse = await db.insert(minichar).values({
    id:minicharId,
    model: model,
    agentName: agentName,
    agentLore: agentLore,
    preferLanguage: preferLanguage,
    agentTarget: agentTarget,
    agentRule: agentRule,
    agentSpeech: agentSpeech,
   
  });

  console.log('create success')
  redirect('/agent/my');

}



export async function createNewAgent(formdata: FormData) {
  "use server";

  const validatedFields = insertAgent.safeParse({
    name: formdata.get("agentShowName"),
    intro: formdata.get("agentIntro"),
    api: formdata.get("agentApi"),
  });

  if (!validatedFields.success) {
    console.log("not success");

    console.log(validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Agent.",
    };
  }
  const { name, intro,api} = validatedFields.data;
  const dbResponse = await db.insert(agent).values({
    name: name,
    intro: intro,
    api:api
  });
  console.log(dbResponse);
}


