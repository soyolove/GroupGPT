"use client";
import { useChat, useCompletion } from "ai/react";

import { Agent } from "@/drizzle/type-output";
import { useEffect, useCallback, useState } from "react";
import { useImperativeHandle, forwardRef } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

interface Message {
  id: string;
  name: string;
  role: "user" | "agent";
  content: string;
}

interface AiMessageProps {
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
    },
    ref
  ) => {
    console.log(agent.api+'/groupchat')
    const [generated, setGenerated] = useState(false);
    const { completion, complete, stop } = useCompletion({
      api: agent.api+'/groupchat',

      onFinish(prompt, completion) {
        setChatHistory([
          ...chatHistory,
          { id: prompt, name: agent.name, role: "agent", content: completion },
        ]);
        const newOngoingMessages = ongoingMessages.filter(
          (id) => id !== messageId
        );
        setOngoingMessages(newOngoingMessages);
        // Remove the messageId from ongoingMessages
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
      setOngoingMessages([...ongoingMessages, messageId]);
      complete("Hi", { body: { groupMessages: chatHistory } });
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
        
          <Avatar className='w-5 h-5 mr-2'>
            <AvatarImage src={agent.avatar} alt={agent.name} />
          </Avatar>
          <div className="text-sm">  {agent.name}
          </div>
        </div>
        <div>{completion}</div>
      </div>
    );
  }
);

AiMessage.displayName = "AiMessage";

export default AiMessage;
