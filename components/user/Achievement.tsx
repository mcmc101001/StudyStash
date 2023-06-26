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
    <div className="flex flex-col items-center p-5">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-200 p-5 text-2xl font-semibold dark:bg-slate-950">
        <Icon className="h-full w-full" />
      </div>
      <div className="mt-2 flex items-center justify-center text-3xl font-semibold">
        {value}
      </div>
      <div className="text-base font-light text-slate-700 opacity-75 dark:text-slate-300">
        {description}
      </div>
    </div>
  );
}
