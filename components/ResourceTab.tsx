"use client";

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
    <div className="my-4 flex flex-row items-center justify-center bg-slate-200 p-2 dark:bg-slate-900">
      {resourceOptions.map((option) => {
        return (
          <Link
            key={option.name}
            href={`/database/${moduleCode}/${option.href}`}
            className={
              "flex w-1/3 items-center justify-center rounded-md p-3 text-xl font-medium " +
              (segment === option.href
                ? "bg-white text-slate-950 dark:bg-slate-950 dark:text-white"
                : "bg-inherit text-slate-600 dark:text-slate-400")
            }
          >
            {option.name}
          </Link>
        );
      })}
    </div>
  );
};

export default ResourceTab;
