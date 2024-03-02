import * as React from 'react'
import Textarea from 'react-textarea-autosize'
import { UseChatHelpers } from 'ai/react'
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit'
import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from '@/components/ui/tooltip'
import { IconArrowElbow, IconPlus } from '@/components/ui/icons'
// import { useRouter } from 'next/navigation'
import { GroupMessage,Message } from '@/lib/modules'




interface PromptProps{
  // onSubmit:(value:string)=>void,
  input:string,
  setInput:(value:string)=>void,
  inChatting:boolean,
  groupMessages:GroupMessage[],
  setGroupMessages:(state:GroupMessage[])=>void,
  chatHistory:Message[],
  setChatHistory:(state:Message[])=>void,
  
  
}


export function PromptForm({
  inChatting,
  input,
  setInput,
  groupMessages,
  setGroupMessages,
  chatHistory,
  setChatHistory
  // isLoading
}: PromptProps) {
  const { formRef, onKeyDown } = useEnterSubmit()
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  // const router = useRouter()
  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <form
      // onSubmit={async e => {
      //   e.preventDefault()
      //   if (!input?.trim()) {
      //     return
      //   }
      //   setInput('')
      //   await onSubmit(input)
      // }}

      onSubmit={(e) => {
        e.preventDefault(); // 阻止表单默认提交行为
        const uniqueId = crypto.randomUUID();

        // 将用户输入的消息添加到groupMessages展示逻辑中
        setGroupMessages([...groupMessages, { id:uniqueId,name: 'user', role: 'user', content: input }]);

      // 同时添加到历史消息
        setChatHistory([...chatHistory, { id:uniqueId,name: 'user', role: 'user', content: input }]); 
        setInput(''); // 提交后清空输入框
      }
    }
      ref={formRef}
    >
      <div className="relative flex flex-col w-full px-8 overflow-hidden max-h-60 grow bg-background sm:rounded-md sm:border sm:px-12">
        {/* <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={e => {
                e.preventDefault()
                router.refresh()
                router.push('/')
              }}
              className={cn(
                buttonVariants({ size: 'sm', variant: 'outline' }),
                'absolute left-0 top-4 size-8 rounded-full bg-background p-0 sm:left-4'
              )}
            >
              <IconPlus />
              <span className="sr-only">New Chat</span>
            </button>
          </TooltipTrigger>
          <TooltipContent>New Chat</TooltipContent>
        </Tooltip> */}
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          rows={1}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Send a message."
          spellCheck={false}
          className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
        />
        <div className="absolute right-0 top-4 sm:right-4">
          < TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="submit"
                size="icon"
                // disabled={isLoading || input === ''}
              >
                <IconArrowElbow />
                <span className="sr-only">Send message</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Send message</TooltipContent>
          </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </form>
  )
}
