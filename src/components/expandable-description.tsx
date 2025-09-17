import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ExpandableDescriptionProps {
  content: string;
  maxHeight?: string;
  className?: string;
}

export const ExpandableDescription = ({
  content,
  maxHeight = "h-[60px]",
  className = "",
}: ExpandableDescriptionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const checkOverflow = (element: HTMLDivElement | null) => {
    if (!element || !content) return;
    
    // Use requestAnimationFrame to ensure the check happens after the DOM updates
    requestAnimationFrame(() => {
      const isOverflow = element.scrollHeight > element.clientHeight;
      if (isOverflow !== isOverflowing) {
        setIsOverflowing(isOverflow);
      }
      if (!isMounted) {
        setIsMounted(true);
      }
    });
  };

  // Show button if:
  // 1. We've mounted and content is overflowing, OR
  // 2. The content is currently expanded
  const showButton = (isMounted && isOverflowing) || isExpanded;

  return (
    <div className={cn("relative w-full", className)}>
      <div
        ref={checkOverflow}
        className={cn(
          "text-sm text-gray-600 dark:text-gray-300 transition-all duration-200 overflow-hidden",
          isExpanded ? "max-h-[1000px]" : maxHeight,
          !isMounted && "invisible" // Hide content until we've checked for overflow
        )}
      >
        {content}
      </div>
      
      {showButton && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className={cn(
            "mt-1 flex items-center text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
          )}
        >
          {isExpanded ? (
            <>
              <span>Show Less</span>
              <ChevronUp className="ml-1 h-3.5 w-3.5" />
            </>
          ) : (
            <>
              <span>Read More</span>
              <ChevronDown className="ml-1 h-3.5 w-3.5" />
            </>
          )}
        </button>
      )}
    </div>
  );
};
