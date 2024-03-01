"use client";



import React,{ useState,useRef,useEffect } from "react";
import { Agent } from "@/drizzle/type-output";
import { ChatPanel } from './chat-panel'
import AIMessage from "./aiMessage";
import UserMessage from "./userMessage"
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {ChatScrollAnchor} from './chat-scroll-anchor'

interface ChatProps {
    selectedAgent: Agent[];
    maxSpeaking:number;
    speakingGap:number;
    initialMessage:string;
}

interface Message{
  id:string;
  name:string;
  role:'user' | 'agent';
  content:string;
}

interface GroupMessage extends Message{
  agent?:Agent;
}

interface AiMessageHandles {
  completeMethod: () => void;
  stopMethod:()=>void
  isGenerated:()=>boolean
}




export default function Chat({selectedAgent,maxSpeaking,speakingGap,initialMessage}: ChatProps) {


  // 状态逻辑：
  // 群聊部分是自动运行的，只与是否开启聊天有关，用户的输入不影响群聊逻辑
  // 核心状态是GroupMessages，GroupMessages包括AI和User两类消息，其中AIMessage能够维护自己的内容
  // 注意，groupMessages是展示逻辑，而不是记录逻辑
  // 原因是，生成AImessage组件需要有一个数组作为触发器
  // 但是，这个触发器在被触发的时候，内容还没有生成，而排队器的触发依赖已经完成的内容
  // 因此，需要有一个单独的数组，被用来维护完成生成的内容，排队器的触发将依赖这个数组（ChatHistory）
  // 而GroupMessages数组则被用于控制前端元素的渲染
  // 如果未来版本允许导入聊天记录，只要直接操作GroupMessages再同步给ChatHistory即可


  const [userInput, setUserInput] = useState('');

  const [groupMessages, setGroupMessages] = useState<GroupMessage[]>(
    [{id:'1',name:'user',role:'user',content:initialMessage}]
  );

  const [chatHistory,setChatHistory] = useState<Message[]>(
    [{id:'1',name:'user',role:'user',content:initialMessage}]
  ); // 历史消息

  const messageRefs = useRef<React.RefObject<AiMessageHandles>[]>([]);

  
  const [speakingOrder,setSpeakingOrder] = useState<Agent[]>([]); // 排队器

  const [ongoingMessages,setOngoingMessages] = useState<string[]>([]) 
// 正在进行生成（被发言）的消息id

  const [inChatting,setInChatting] = useState(false); // 是否正在聊天



  // 把群聊理解成一个排队系统，每个时间点最多有m个agent在发言
  // 当发言的agent数量少于m时，增加发言者，直到数量重新等于m
  // 假设有n个agent，每当群聊消息更新，使用排队器更新(n-1)个agent的状态
  // 特别的，如果A agent正在发言，此时B结束发言，排队器认为接下来应该由A发言，此时A agent仍可以发言
  // 这是特别的规定，因为agent处理消息可以并行（而非人类只能串行处理消息）
  // 唯一要禁止的是连续逻辑发言，也就是A发言引起的排队器更新再次导致A优先发言


  function CreateNewAIMessage(agent:Agent,content:string){
    const uniqueId = crypto.randomUUID();

    const newRef = React.createRef<AiMessageHandles>(); // 创建新的ref
    messageRefs.current.push(newRef); // 先将ref添加到数组中

    setGroupMessages((prevMessages) => [...prevMessages, {id:uniqueId,agent:agent,name:agent.name,role:'agent',content:''}])

    console.log(`new AI message is created, id is ${uniqueId} for agent ${agent.name}`)

    
    // 使用timeout延后处理
    // 这里必须要延后处理，我认为可能是react会把状态更新打包执行，如果不延后的话，这段代码元素在未创建的时候就被调用了
    // setTimeout(() => {
    //   newRef.current?.completeMethod();
    //   console.log(`detect ${agent.name} speaking, the ref state is ${newRef.current}`)
    // }, 1000);
    // 仍然不行，组件刚创建的时候还没有加载完成，ref拿不到里面的method，调用会空
    return newRef

  }

  // useEffect(() => {
  //   console.log('check messageRefs')
  //   // 假设messageRefs是你存储子组件引用的数组
  //   messageRefs.current.forEach(ref => {
      
  //     if (ref.current && !ref.current.isGenerated()) {
  //       console.log('execute ref')
  //       ref.current.completeMethod(); // 对未生成内容的子组件调用completeMethod
  //     }
  //   });
  // }, [messageRefs]); // 当messageRefs变化时执行

  

  

  // 每次群聊状态的按钮被按下，检测状态，如果为开启，则进入聊天初始化，反之，则清空聊天状态，仅保留历史消息
  useEffect(()=>{
    if (inChatting){
      // 处理聊天初始化
      // setOngoingMessages([]); // 清空所有进行记录
      setSpeakingOrder(selectedAgent); // 重置排队器
      for (let i = 0; i < maxSpeaking; i++){
        
        // 从排队器中取出一个agent
        const newAgent = speakingOrder[i];
        // 此时，弹出被取出的agent
        // 如果没有agent了，就不发言
        if (newAgent){
          // 如果有agent，就让他发言
          CreateNewAIMessage(newAgent,'');
        }
      }

      
    }else{
      // 处理停止的逻辑
      setOngoingMessages([]); // 清空所有进行记录
      setSpeakingOrder(selectedAgent); // 重置排队器
      messageRefs.current.forEach(ref=>{
        ref.current?.stopMethod()
      }

      )
        
    }


  },[inChatting])


const RandomQueue = (prevAgentsQueue: Agent[],allAgent:Agent[]) => {
  // 生成一个随机的队列
  // 可以换成别的实现，总之需要是一个队列
  const shuffledQueue = [...allAgent];
  for (let i = shuffledQueue.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledQueue[i], shuffledQueue[j]] = [shuffledQueue[j], shuffledQueue[i]];
  }

    // 确保新队列的第一位和prevAgentsQueue的第一位不同
    if (prevAgentsQueue.length > 0 && shuffledQueue[0].id === prevAgentsQueue[0].id) {
      // 如果新队列的第一位和prevAgentsQueue的第一位相同
      // 找到一个不同的元素进行交换
      const differentIndex = shuffledQueue.findIndex(agent => agent.id !== prevAgentsQueue[0].id);
      if (differentIndex > 0) { // 确保找到了不同的元素
        // 与第一位进行交换
        [shuffledQueue[0], shuffledQueue[differentIndex]] = [shuffledQueue[differentIndex], shuffledQueue[0]];
      }
    }

  return shuffledQueue;
};




useEffect(()=>{

  if (inChatting){
  // 每次有新消息，都更新排队器
  setSpeakingOrder(speakingOrder => RandomQueue([...speakingOrder],[...selectedAgent]))
  }

},[chatHistory])




useEffect(()=>{
  // 排队器被更新，意味着有新消息出现，也意味着有Agent完成了发言
  // 这时候需要检查是否有新的Agent可以发言

  if (inChatting){
    if (ongoingMessages.length < maxSpeaking){
      // 如果正在发言的消息数量小于最大发言数量
      // 那么就可以让新的agent发言
      // 从排队器中取出一个agent
      const newAgent = speakingOrder[0];

      // 如果没有agent了，就不发言
      if (newAgent){
        // 如果有agent，就让他发言

        setTimeout(() => {
          const templateRef = CreateNewAIMessage(newAgent,'');

        },speakingGap)
        
}
        }
}

},[speakingOrder])



  return (


    <div>

    <div  className='pb-[200px] pt-4 md:pt-10'>

        <div className="relative mx-auto max-w-2xl px-4">

          <div>
              {groupMessages.map((m,index) => {

                if (m.role == 'agent' && m.agent){
                  return (
                    <div key={m.id}>
                    <AIMessage 
                    messageId={m.id} 
                    ref={messageRefs.current[index]}
                    chatHistory={chatHistory} 
                    setChatHistory={setChatHistory}
                    agent={m.agent}
                    ongoingMessages={ongoingMessages}
                    setOngoingMessages={setOngoingMessages}
                    />

                    <Separator className="my-4 md:my-8" />
                    </div>
                    
                  )
              }else if (m.role=='user'){
                return(
                  <div key={m.id}>
                    <UserMessage userMessage={m}/>
                    <Separator className="my-4 md:my-8" />
                    </div>
                )
              }
              })}
            </div>
            <ChatScrollAnchor trackVisibility={inChatting} />

          </div>
      </div>


      {/* {inChatting ? 
      (<Button onClick={()=>{setInChatting(false)}}>Stop Chat</Button>)
      :
      (<Button onClick={()=>{setInChatting(true)}}>Start Chat</Button>)} */}

{/*       
      <div className="flex w-full max-w-sm items-center space-x-2">
      <form onSubmit={(e) => {
        e.preventDefault(); // 阻止表单默认提交行为
        const uniqueId = crypto.randomUUID();

        // 将用户输入的消息添加到groupMessages展示逻辑中
        setGroupMessages([...groupMessages, { id:uniqueId,name: 'user', role: 'user', content: userInput }]);

      // 同时添加到历史消息
          setChatHistory([...chatHistory, { id:uniqueId,name: 'user', role: 'user', content: userInput }]); 
        setUserInput(''); // 提交后清空输入框
      }
      }>
        <textarea
          name='userMessage'
          placeholder="Say something..."
          className="textarea-class" 
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)} // 更新状态以反映用户输入
        />
        <Button type="submit">Send</Button>
      </form>
    </div> */}


    <ChatPanel
        inChatting={inChatting}
        setInChatting={setInChatting}
        groupMessages={groupMessages}
        setGroupMessages={setGroupMessages}
        chatHistory={chatHistory}
        setChatHistory={setChatHistory}

        // reload={reload}
        // messages={messages}
        input={userInput}
        setInput={setUserInput}
      />


    </div>
  );
}

