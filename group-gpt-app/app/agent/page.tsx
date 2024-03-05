import { Agent } from "@/drizzle/type-output";
import { getAllAgentWithoutUser } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function Page() {
  const agents = await getAllAgentWithoutUser();

  return (
    <div>

      <Table>
        <TableCaption>List of your Agents</TableCaption>
        <TableHeader>
          <TableRow>
            {/* <TableHead className="w-[100px]">Id</TableHead> */}
            <TableHead>Name</TableHead>
            <TableHead>Introduction</TableHead>
            <TableHead >API</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
        {agents.map((agent) => {
            return(
            <TableRow>
                {/* <TableCell className="font-medium">{agent.id}</TableCell> */}
                <TableCell>
                    <div className='flex flex-row items-center w-[150px]'>
                        <Avatar className='mr-3'>
                            <AvatarImage src={agent.avatar} />
                            <AvatarFallback>{agent.name}</AvatarFallback>
                        </Avatar>
                        <div className='text-base font-medium'>
                        {agent.name}
                        </div>
                    </div>
                    
                </TableCell>
                <TableCell>{agent.intro}</TableCell>
                <TableCell>{agent.api}</TableCell>
                <TableCell>
                    <Button disabled={true}>
                        Edit (Developing)
                    </Button>
                </TableCell>
            </TableRow>
          )
        })}
        </TableBody>
      </Table>

    </div>
  );
}
