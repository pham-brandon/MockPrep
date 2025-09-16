import type { Interview } from "@/types"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { TooltipButton } from "./tooltip-button"
import { MessageSquareMore, Sparkles, SquarePen, Clock, Trash2 } from "lucide-react"

interface InterviewCardProps {
    interview: Interview
    onMockPage?: boolean
    onDelete?: (id: string) => void
}

export const InterviewCard = ({ interview, onMockPage = false, onDelete }: InterviewCardProps) => {
  const navigate = useNavigate()
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col rounded-xl overflow-hidden border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 mb-2">
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white line-clamp-1">
              {interview?.position}
            </CardTitle>
          </div>
          <div className="h-[60px] overflow-hidden">
            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
              {interview?.description}
            </p>
          </div>
        </CardHeader>
        
        <CardContent className="pb-4">
          <div className="flex flex-wrap gap-2 max-h-[72px] overflow-y-auto py-1">
            {interview?.techStack && interview.techStack.split(",").map((tech, index) => (
              <Badge 
                key={index}
                className="px-2.5 py-1 text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-800/40 transition-colors"
                variant="outline"
              >
                {tech.trim()}
              </Badge>
            ))}
          </div>
        </CardContent>

        <CardFooter className={cn(
          "border-t border-gray-100 dark:border-slate-700 p-4 mt-auto",
          onMockPage ? "justify-end" : "justify-between"
        )}>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Clock className="w-4 h-4 mr-1.5 flex-shrink-0" />
            <span className="whitespace-nowrap">
              {new Date(interview?.createdAt.toDate()).toLocaleDateString("en-US", {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </span>
          </div>
          
          {!onMockPage && (
            <div className="flex items-center gap-1 ml-2">
              <TooltipButton
                content="Delete"
                buttonVariant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(interview.id);
                }}
                disabled={!onDelete}
                buttonClassName="h-8 w-8 p-0 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 flex-shrink-0"
                icon={<Trash2 className="h-4 w-4" />}
                loading={false}
              />

              <TooltipButton
                content="Edit"
                buttonVariant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/practice/${interview?.id}`);
                }}
                disabled={false}
                buttonClassName="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 hover:text-blue-500 dark:text-gray-400 flex-shrink-0"
                icon={<SquarePen className="h-4 w-4" />}
                loading={false}
              />

              <TooltipButton
                content="Evaluation"
                buttonVariant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/practice/evaluation/${interview?.id}`);
                }}
                disabled={false}
                buttonClassName="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 hover:text-blue-500 dark:text-gray-400 flex-shrink-0"
                icon={<MessageSquareMore className="h-4 w-4" />}
                loading={false}
              />

              <TooltipButton
                content="Start Interview"
                buttonVariant="default"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/practice/interview/${interview?.id}`);
                }}
                disabled={false}
                buttonClassName="h-8 px-3 bg-yellow-500 hover:bg-yellow-600 text-white shadow-md hover:shadow-lg transition-all duration-200 flex-shrink-0 whitespace-nowrap"
                icon={<Sparkles className="h-4 w-4 mr-1 flex-shrink-0" />}
                loading={false}
              />
            </div>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
}
