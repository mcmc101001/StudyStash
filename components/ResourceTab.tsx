'use client'

import { FC } from "react";
import Link from "next/link";
import { ResourceOptionsProps } from "@/lib/content";
import { useSelectedLayoutSegment } from "next/navigation";

interface ResourceTabProps {
  moduleCode: string;
  resourceOptions: ResourceOptionsProps[];
}

const ResourceTab: FC<ResourceTabProps> = ({ moduleCode, resourceOptions }) => {
  let segment = useSelectedLayoutSegment();
  return (
    <div className="flex flex-row justify-center items-center p-2 bg-slate-200 dark:bg-slate-900 my-4">
      {resourceOptions.map((option) => {
        return (
          <Link 
            key={option.name} 
            href={`/database/${moduleCode}/${option.href}`} 
            className={"text-xl font-medium p-3 rounded-md w-1/3 flex justify-center items-center " + (segment === option.href ? "bg-white dark:bg-slate-950 text-slate-950 dark:text-white" : "bg-inherit text-slate-600 dark:text-slate-400")}
          >
            {option.name}
          </Link>
        )
      })}
    </div>
  )
}

export default ResourceTab;