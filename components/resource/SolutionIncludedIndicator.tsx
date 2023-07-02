"use client";

import { Award } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";

export default function SolutionIncludedIndicator() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Award className="cursor-auto text-blue-600 dark:text-blue-400" />
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-normal">Solution included</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
