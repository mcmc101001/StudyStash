"use client";

import { ResourceOptionsProps } from "@/lib/content";
import { motion } from "framer-motion";
import useQueryParams from "@/hooks/useQueryParams";

interface UserResourceTabProps {
  resourceOptions: ResourceOptionsProps[];
}

export default function UserResourceTab({
  resourceOptions,
}: UserResourceTabProps) {
  let { queryParams, setQueryParams } = useQueryParams();
  return (
    <div className="my-4 flex flex-row items-center justify-center bg-slate-200 p-2 dark:bg-slate-900">
      {resourceOptions.map((option) => {
        return (
          <div
            key={option.name}
            aria-label={option.href}
            onClick={() => setQueryParams({ filterCategory: option.href })}
            className={
              "relative w-1/3 cursor-pointer rounded-md bg-inherit p-3 text-center text-xl font-medium transition duration-300 " +
              (queryParams?.get("filterCategory") === option.href
                ? "text-black dark:text-white"
                : "text-slate-600 hover:bg-slate-300 dark:text-slate-400 dark:hover:bg-slate-800")
            }
          >
            {queryParams?.get("filterCategory") === option.href && (
              <motion.div
                layout
                layoutId="active-pill"
                className="absolute inset-0 z-10 rounded-lg bg-white dark:bg-slate-950"
                transition={{ type: "spring", duration: 0.5 }}
                initial={false}
              />
            )}
            <span className="relative z-20">{option.name}</span>
          </div>
        );
      })}
    </div>
  );
}
