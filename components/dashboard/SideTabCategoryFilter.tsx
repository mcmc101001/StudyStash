"use client";

import { ResourceSolutionOptions } from "@/lib/content";
import { Icons } from "../Icons";
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
          const Icon = Icons[option.icon];
          return (
            <div
              key={option.name}
              aria-label={option.href}
              onClick={() => setQueryParams({ filterCategory: option.href })}
              className={
                "flex flex-1 cursor-pointer items-center justify-center rounded-l-2xl border border-slate-200 " +
                (queryParams?.get("filterCategory") === option.href
                  ? "border-r-transparent dark:bg-slate-900"
                  : "")
              }
            >
              <span className="-rotate-90 whitespace-nowrap ">
                {option.name}
              </span>
              {/* <Icon className="h-16 w-10" /> */}
            </div>
          );
        })}
      </div>
      {children}
    </div>
  );
}
