'use client'

import { FC } from "react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { Icon, Icons } from "./Icons";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/Tooltip"
  

export interface NavOptionsProps {
    name: string,
    href: string,
    icon: Icon
}

const NavOptions: FC<NavOptionsProps> = ({ name, href, icon }) => {
    let segment = useSelectedLayoutSegment();
    let isActive = false;
    if (!segment && href === '/') {
        isActive = true;
    }
    else {
        isActive = href === `/${segment}`;
    }
    const Icon = Icons[icon];
    return (
        <li className='inline-flex items-center justify-center'>
            <TooltipProvider delayDuration={0}>
                <Tooltip>
                    <TooltipTrigger>
                    <Link href={href} className={'dark:text-gray-300 text-gray-700 flex gap-3 rounded-md p-2 text-lg leading-6 font-semibold '
                    + (isActive ? "outline outline-2 -outline-offset-2 dark:outline-slate-200 outline-slate-800" : "dark:hover:text-indigo-900 hover:text-indigo-100 dark:hover:bg-slate-200 hover:bg-slate-800")}>
                        <Icon className='h-7 w-7' />
                    </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                    <p>{name}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </li>
    )
}

export default NavOptions;
