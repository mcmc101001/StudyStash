"use client";

import { BadgeCheck } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";

export function ProfleVerifiedIndicator() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <BadgeCheck className="ml-1 cursor-auto text-blue-500" />
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-normal">Verified user</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
