"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { Icon, Icons } from "@/components/Icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";

export interface NavOptionsProps {
  name: string;
  href: string;
  icon: Icon;
}

export default function NavOptions({ name, href, icon }: NavOptionsProps) {
  let segment = useSelectedLayoutSegment();
  let isActive = false;
  if (!segment && href === "/") {
    isActive = true;
  } else {
    isActive = href === `/${segment}`;
  }
  const Icon = Icons[icon];
  return (
    <li className="inline-flex items-center justify-center">
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={href}
              className={
                "flex gap-3 rounded-md p-2 text-lg font-semibold leading-6 text-gray-700 dark:text-gray-300 " +
                (isActive
                  ? "outline outline-2 -outline-offset-2 outline-slate-800 dark:outline-slate-200"
                  : "hover:bg-slate-800 hover:text-indigo-100 dark:hover:bg-slate-200 dark:hover:text-indigo-900")
              }
            >
              <Icon className="h-7 w-7" />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" asChild>
            <p>{name}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </li>
  );
}
