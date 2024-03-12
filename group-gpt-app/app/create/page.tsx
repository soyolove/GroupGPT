import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from 'next/link'

export default async function Page() {
  return (
    <div className="flex flex-row justify-center  translate-y-[10%] sm:translate-y-[50%]">
      <div className="flex flex-col  sm:flex-row">
        <div className='mr-20 '>
        <Card className="w-[400px]  h-[350px] relative">
          <CardHeader>
            <CardTitle>Agent on API</CardTitle>
            <CardDescription>
              <div>Create Agent By API endpoint.</div>
              <div>
                Before this, you should have an endpoint and finish adjustment
                of your endpoint according to document.
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              <li>Completely controlled by yourself</li>
              <li>Support all kinds of agent</li>
              <li>Enjoy all the supports by agent-middleware</li>
            </div>
          </CardContent>
          <CardFooter  className="absolute bottom-0 right-0">
            <Button >
                <Link href='/create/general'>
                Next Step
                </Link>
            </Button>
          </CardFooter>
        </Card>
        </div>

        <div className=''>
        <Card  className="w-[400px] h-[350px] relative">
          <CardHeader>
            <CardTitle>Agent on Mini-Character</CardTitle>
            <CardDescription>
              <div>Create Agent By Mini-Character frame</div>
              <div>No code, No deployment, just click and create.</div>
              <div>
                Mini-Character is a lightweight agent frame, which can construct
                a high-performance agent by several prompts.
              </div>
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="text-sm">
              <li>One-Click to your own agent</li>
              <li>Lightweight and high-performance</li>
              <li>The best way to start GroupGPT</li>
            </div>
          </CardContent>
          <CardFooter className="absolute bottom-0 right-0">
            <Button >
                <Link href='/create/mini-char'>
                Next Step
                </Link>
            </Button>
          </CardFooter>
        </Card>
        </div>
        </div>

    </div>
  );
}
