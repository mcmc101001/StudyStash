"use client";

import { DashboardTabType } from "@/lib/content";
import { motion } from "framer-motion";
import useQueryParams from "@/hooks/useQueryParams";

interface DashboardResourceTabProps {
  tabsArr: DashboardTabType[];
}

export default function DashboardResourceTab({
  tabsArr,
}: DashboardResourceTabProps) {
  let { queryParams, setQueryParams } = useQueryParams();

  return (
    <div className="mb-4 flex flex-row items-center justify-center bg-slate-200 p-2 dark:bg-slate-900">
      {tabsArr.map((tabName) => {
        return (
          <div
            key={tabName}
            aria-label={tabName}
            onClick={() => setQueryParams({ filterStatus: tabName })}
            className={
              "relative w-1/3 cursor-pointer rounded-md bg-inherit p-3 text-center text-xl font-medium transition duration-300 " +
              (queryParams?.get("filterStatus") === tabName
                ? "text-black dark:text-white"
                : "text-slate-600 hover:bg-slate-300 dark:text-slate-400 dark:hover:bg-slate-800")
            }
          >
            {queryParams?.get("filterStatus") === tabName && (
              <motion.div
                layout
                layoutId="active-dashboard-pill"
                className="absolute inset-0 z-10 rounded-lg bg-white dark:bg-slate-950"
                transition={{ type: "spring", duration: 0.5 }}
                initial={false}
              />
            )}
            <span className="relative z-20 whitespace-nowrap">
              {tabName === "Visited" ? "Recently viewed" : tabName}
            </span>
          </div>
        );
      })}
    </div>
  );
}
