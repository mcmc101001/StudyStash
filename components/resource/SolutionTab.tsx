"use client";

import Link from "next/link";
import { ResourceTypeURL, solutionOptionsProps } from "@/lib/content";
import {
  useParams,
  useSearchParams,
  useSelectedLayoutSegment,
} from "next/navigation";
import { motion } from "framer-motion";

interface SolutionTabProps {
  solutionTabOptions: solutionOptionsProps[];
}

export default function SolutionTab({ solutionTabOptions }: SolutionTabProps) {
  let params = useParams() as {
    resourceId: string;
    categoryURL: ResourceTypeURL;
    solutionId: string | undefined;
  };
  let segment = useSelectedLayoutSegment();
  const queryParams = useSearchParams();

  if (params.categoryURL !== "past_papers") {
    return null;
  }

  if (params.solutionId !== undefined) {
    return null;
  }

  return (
    <div className="mx-auto mt-5 w-5/6">
      <div className="mb-4 flex flex-row items-center justify-center bg-slate-200 p-2 dark:bg-slate-900">
        {solutionTabOptions.map((option) => {
          if (
            option.assignedCategory.includes("Solutions") &&
            option.assignedCategory.length === 1
          ) {
            return null;
          }
          return (
            <Link
              key={option.tabName}
              href={
                `/resource/${params.resourceId}/${params.categoryURL}/${option.href}` +
                `/?${queryParams?.toString()}`
              }
              className={
                "relative flex-1 rounded-md bg-inherit p-2 text-center text-base font-medium transition duration-300 " +
                (segment === option.href
                  ? "text-black dark:text-white"
                  : "text-slate-600 hover:bg-slate-300 dark:text-slate-400 dark:hover:bg-slate-800")
              }
            >
              {segment === option.href && (
                <motion.div
                  layout
                  layoutId="active-solution-pill"
                  className="absolute inset-0 z-10 rounded-lg bg-white dark:bg-slate-950"
                  transition={{ type: "spring", duration: 0.5 }}
                  initial={false}
                />
              )}
              <span className="relative z-20">{option.tabName}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
