import type { Interview } from "@/types"
import { useNavigate } from "react-router-dom"

import { Card, CardDescription, CardFooter, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { TooltipButton } from "./tooltip-button"
import { MessageSquareMore, Sparkles, SquarePen } from "lucide-react"

interface InterviewCardProps {
    interview : Interview
    onMockPage? : boolean
}

export const InterviewCard = ({ interview, onMockPage = false }: InterviewCardProps) => {
  const navigate = useNavigate();
  return (
    <Card className="rounded-md shadow-none p-4 hover:shadow-md shadow-gray-100 cursor-pointer transition-all space-y-4">
      <CardTitle className="text-lg">{interview?.position}</CardTitle>
      <CardDescription>{interview?.description}</CardDescription>
      <div className="flex items-center gap-2 flex-wrap w-full">
        {interview?.techStack && interview?.techStack.split(",").map((word, index) => (
          <Badge className="hover:border-blue-400 hover:bg-blue-50 hover:text-blue-900 
          text-xs text-muted-foreground" variant={"outline"} key={index}>
            {word.trim()}
          </Badge>
        ))}
      </div>
             <CardFooter className={cn("flex w-full items-center p-0", onMockPage ? "justify-end" : "justify-between")}>
         <p className="whitespace-nowrap text-[12px] text-muted-foreground truncate">
           {`${new Date(interview?.createdAt.toDate()).toLocaleDateString("en-US", {dateStyle: "long"})} - 
           ${new Date(interview?.createdAt.toDate()).toLocaleTimeString("en-US", {timeStyle: "short"})}`}
         </p>
         {!onMockPage && (
          <div className="items-center flex justify-center gap-4">
            <TooltipButton
              content="Edit"
              buttonVariant={"ghost"}
              onClick={() => {
                navigate(`/practice/${interview?.id}`, { replace: true });
              }}
              disabled={false}
              buttonClassName="hover:text-blue-500"
              icon={<SquarePen />}
              loading={false}
            />

            <TooltipButton
              content="Evaluation"
              buttonVariant={"ghost"}
              onClick={() => {
                navigate(`/practice/evaluation/${interview?.id}`, { replace: true });
              }}
              disabled={false}
              buttonClassName="hover:text-blue-500"
              icon={<MessageSquareMore />}
              loading={false}
            />

            <TooltipButton
              content="Start"
              buttonVariant={"ghost"}
              onClick={() => {
                navigate(`/practice/interview/${interview?.id}`, { replace: true });
              }}
              disabled={false}
              buttonClassName="hover:text-blue-500"
              icon={<Sparkles />}
              loading={false}
            />

          </div>
         )}
       </CardFooter>
    </Card>
  );
}; 
