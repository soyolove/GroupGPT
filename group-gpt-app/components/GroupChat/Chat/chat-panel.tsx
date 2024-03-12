import * as React from 'react'
import { type UseChatHelpers } from 'ai/react'

// import { shareChat } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { PromptForm } from './prompt-form'
// import { ButtonScrollToBottom } from '@/components/button-scroll-to-bottom'
import { IconRefresh, IconShare, IconStop } from '@/components/ui/icons'
import { GroupMessage,Message } from '@/lib/modules'
import { Agent } from '@/drizzle/type-output'


interface ChatPanelProps{
  inChatting:boolean,
  setInChatting:(value:boolean)=>void,
  input:string,
  setInput:(value:string)=>void,
   groupMessages:GroupMessage[],
  setGroupMessages:(state:GroupMessage[])=>void,
  chatHistory:Message[],
  setChatHistory:(state:Message[])=>void,
  user:Agent,
}

export function ChatPanel({

  // title,
  // isLoading,
  // stop,
  inChatting,
  setInChatting,
  groupMessages,
  setGroupMessages,
  chatHistory,
  setChatHistory,
  // reload,
  input,
  setInput,
  user,
  
  // messages
}: ChatPanelProps) {
  const [shareDialogOpen, setShareDialogOpen] = React.useState(false)

  return (
    <div className="fixed inset-x-0 bottom-0 w-full bg-gradient-to-b from-muted/30 from-0% to-muted/30 to-50% animate-in duration-300 ease-in-out dark:from-background/10 dark:from-10% dark:to-background/80 peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
      {/* <ButtonScrollToBottom /> */}
      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="flex items-center justify-center h-12">
          {inChatting ? (
            <Button
              variant="outline"
              onClick={
                () => {
                  setInChatting(false)
                }
              }
              className="bg-background"
            >
              <IconStop className="mr-2" />
              Stop Chatting
            </Button>
          ) : (

            <Button
              variant="outline"
              onClick={
                () => {
                  setInChatting(true)
                }
              }
              className="bg-background"
            >
              <IconStop className="mr-2" />
              Continue Chatting
            </Button>

            // messages?.length >= 2 && (
            //   <div className="flex space-x-2">
            //     {/* <Button variant="outline" onClick={() => reload()}>
            //       <IconRefresh className="mr-2" />
            //       Regenerate response
            //     </Button> */}
            //     {id && title ? (
            //       <>
            //         <Button
            //           variant="outline"
            //           onClick={() => setShareDialogOpen(true)}
            //         >
            //           <IconShare className="mr-2" />
            //           Share
            //         </Button>
            //         <ChatShareDialog
            //           open={shareDialogOpen}
            //           onOpenChange={setShareDialogOpen}
            //           onCopy={() => setShareDialogOpen(false)}
            //           shareChat={shareChat}
            //           chat={{
            //             id,
            //             title,
            //             messages
            //           }}
            //         />
            //       </>
            //     ): null}
            //   </div>
            // )
          )}
        </div>
        <div className="px-4 py-2 space-y-4 border-t shadow-lg bg-background sm:rounded-t-xl sm:border md:py-4">
          <PromptForm
            user={user}
            input={input}
            setInput={setInput}
            inChatting={inChatting}
            groupMessages={groupMessages}
            setGroupMessages={setGroupMessages}
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}

          />
          {/* <FooterText className="hidden sm:block" /> */}
        </div>
      </div>
    </div>
  )
}
