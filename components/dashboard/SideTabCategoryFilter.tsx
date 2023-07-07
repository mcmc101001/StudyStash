"use client";

import { ResourceSolutionOptions } from "@/lib/content";
import useQueryParams from "@/hooks/useQueryParams";

interface SideTabCategoryFilterProps {
  children: React.ReactNode;
}

export default function SideTabCategoryFilter({
  children,
}: SideTabCategoryFilterProps) {
  let { queryParams, setQueryParams } = useQueryParams();

  return (
    <div>
      <div className="inline-flex h-[80vh] w-[6%] flex-col align-top">
        {ResourceSolutionOptions.map((option) => {
          return (
            <div
              key={option.name}
              aria-label={option.href}
              onClick={() => setQueryParams({ filterCategory: option.href })}
              className={
                "flex flex-1 cursor-pointer items-center justify-center rounded-l-xl border-b-[0.5px] border-l border-t-[0.5px] border-slate-800 first:border-t last:border-b dark:border-slate-200 " +
                (queryParams?.get("filterCategory") === option.href
                  ? "bg-slate-100 dark:bg-slate-900 "
                  : "border-r ")
              }
            >
              <span className="-rotate-90 whitespace-nowrap ">
                {option.name}
              </span>
            </div>
          );
        })}
      </div>
      {children}
    </div>
  );
}
