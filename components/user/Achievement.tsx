"use client";

import { Icon, Icons } from "@/components/Icons";

interface AchievementProps {
  description: string;
  value: number;
  icon: Icon;
}

export function Achievement({ description, value, icon }: AchievementProps) {
  const Icon = Icons[icon];
  return (
    <div className="flex flex-col items-center p-3 2xl:p-5">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 p-4 text-2xl font-semibold scrollbar-w-16 dark:bg-slate-950 2xl:h-20 2xl:w-20 2xl:p-5">
        <Icon className="h-full w-full" />
      </div>
      <div className="mt-2 flex items-center justify-center text-2xl font-semibold 2xl:text-3xl">
        {value}
      </div>
      <div className="text-xs font-light text-slate-700 opacity-75 dark:text-slate-300 2xl:text-sm">
        {description}
      </div>
    </div>
  );
}
