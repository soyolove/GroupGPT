"use client";
import { useChat, useCompletion } from "ai/react";

import { Agent } from "@/drizzle/type-output";
import { useEffect, useCallback, useState } from "react";
import { useImperativeHandle, forwardRef } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { addGroupMessage } from "@/lib/actions";

interface Message {
  id: string;
  name: string;
  role: "user" | "agent";
  content: string;
}

interface AiMessageProps {
  initialContent?: string;
  groupId: string;

  messageId: string;
  agent: Agent;
  chatHistory: Message[];
  setChatHistory: (state: Message[]) => void;
  ongoingMessages: string[];
  setOngoingMessages: (state: string[]) => void;
}

interface AiMessageHandles {
  completeMethod: () => void;
  stopMethod: () => void;
  isGenerated: () => boolean;
}

const AiMessage = forwardRef<AiMessageHandles, AiMessageProps>(
  (
    {
      agent,
      chatHistory,
      setChatHistory,
      ongoingMessages,
      setOngoingMessages,
      messageId,
      initialContent,
      groupId
    },
    ref
  ) => {
    console.log(agent.api + "/groupchat");
    const [generated, setGenerated] = useState(false);

    const { completion, complete, stop, setCompletion } = useCompletion({
      api: agent.api + "/groupchat",

      onFinish: async(prompt, completion) =>{
        setChatHistory([
          ...chatHistory,
          { id: prompt, name: agent.name, role: "agent", content: completion },
        ]);
        const newOngoingMessages = ongoingMessages.filter(
          (id) => id !== messageId
        );
        setOngoingMessages(newOngoingMessages);
        // Remove the messageId from ongoingMessages
        await addGroupMessage(groupId,agent.id,completion)
        
      },

      onError(error) {
        setChatHistory([
          ...chatHistory,
          {
            id: messageId,
            name: agent.name,
            role: "agent",
            content: error.message,
          },
        ]);
        const newOngoingMessages = ongoingMessages.filter(
          (id) => id !== messageId
        );
        setOngoingMessages(newOngoingMessages);
      },
    });

    useEffect(() => {
      // 如果不存在初始化内容，则进行生成
      if (!initialContent) {
        setOngoingMessages([...ongoingMessages, messageId]);
        complete("Hi", { body: { groupMessages: chatHistory } });
      } else {
        // 如果存在初始化内容，跳过生成
        setCompletion(initialContent);
      }
    }, []);

    useImperativeHandle(ref, () => ({
      completeMethod: () => {
        setGenerated(true);
        setOngoingMessages([...ongoingMessages, messageId]);
        complete("Hi", { body: { groupMessages: chatHistory } });
      },

      stopMethod: () => {
        stop();
      },
      isGenerated: () => generated,
    }));

    return (
      <div>
        <div className="flex flex-row items-center">
          <Avatar className="w-5 h-5 mr-2">
            <AvatarImage src={agent.avatar} alt={agent.name} />
          </Avatar>
          <div className="text-sm"> {agent.name}</div>
        </div>
        <div>{completion}</div>
      </div>
    );
  }
);

AiMessage.displayName = "AiMessage";

export default AiMessage;
