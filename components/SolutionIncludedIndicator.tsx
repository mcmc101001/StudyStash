"use client";

import { Lightbulb } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";

export function SolutionIncludedIndicator() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Lightbulb className="ml-1 cursor-auto fill-yellow-200 text-slate-950 dark:fill-yellow-400 dark:text-white" />
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-normal">Solution included</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
