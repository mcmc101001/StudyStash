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
          <Lightbulb className="ml-1 cursor-auto fill-yellow-300" />
        </TooltipTrigger>
        <TooltipContent>
          <p>Solution included</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
