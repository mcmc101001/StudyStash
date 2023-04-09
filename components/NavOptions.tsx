'use client'

import { FC } from "react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { Icon, Icons } from "./Icons";

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
            <Link href={href} className={'text-gray-300 flex gap-3 rounded-md p-2 text-lg leading-6 font-semibold '+ (isActive ? "outline outline-2 -outline-offset-2 outline-slate-200" : "hover:text-indigo-900 hover:bg-slate-200")}>
                <Icon className='h-7 w-7' />
            </Link>
        </li>
    )
}

export default NavOptions;
