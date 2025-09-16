import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
import { Button } from "./ui/button";
import { Loader } from "lucide-react";

  type ButtonVariant =
  | "ghost"
  | "link"
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | null
  | undefined;

interface TooltipButtonProps {
  content: string;
  icon: React.ReactNode;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: ButtonVariant;
  className?: string;
  size?: 'sm' | 'default' | 'lg' | 'icon';
  delay?: number;
  disabled?: boolean;
  loading?: boolean;
  // Legacy props (kept for backward compatibility)
  buttonVariant?: ButtonVariant;
  buttonClassName?: string;
}

export const TooltipButton = ({
  content,
  icon,
  onClick,
  variant: propVariant,
  className = "",
  size = "icon",
  delay = 0,
  disabled = false,
  loading = false,
  // Legacy props
  buttonVariant,
  buttonClassName,
}: TooltipButtonProps) => {
  // Support both new and legacy prop names
  const variant = propVariant || buttonVariant || "ghost";
  const buttonClass = className || buttonClassName || "";
  return (
    <TooltipProvider delayDuration={delay}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size={size}
            disabled={disabled}
            variant={variant}
            className={buttonClass}
            onClick={onClick}
          >
            {loading ? (
              <Loader className="min-w-4 min-h-4 animate-spin text-emerald-400" />
            ) : (
              icon
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{loading ? "Loading..." : content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};