import Link from "next/link";
import { ResourceOptions } from "@/lib/content";
import { Icons } from "@/components/Icons";
import { Separator } from "@/components/ui/Separator";

interface DashboardItemProps {
  moduleCode: string | null;
}

export default function DashboardItem({ moduleCode }: DashboardItemProps) {
  if (moduleCode) {
    return (
      <div className="flex h-40 w-56 flex-col justify-center rounded-lg border-4 border-slate-900 p-4 dark:border-slate-100">
        <h1 className="mb-2 mt-auto text-3xl">{moduleCode}</h1>
        <Separator className="bg-slate-800 dark:bg-slate-200" />
        <div className="mt-4 flex flex-row items-center justify-center gap-3">
          {ResourceOptions.map((option, index, { length }) => {
            const Icon = Icons[option.icon];
            return (
              <>
                <Link href={`/database/${moduleCode}/${option.href}`}>
                  <Icon className="h-12 w-12 hover:text-slate-500" />
                </Link>
                {index + 1 !== length && (
                  <Separator
                    orientation="vertical"
                    className="bg-slate-800 dark:bg-slate-200"
                  />
                )}
              </>
            );
          })}
        </div>
      </div>
    );
  } else {
    // add dashboard item button
    return (
      <div className="flex h-40 w-56 cursor-pointer flex-col items-center justify-center rounded-lg border-4 border-dashed border-slate-600 p-4 text-3xl text-slate-600 dark:border-slate-400 dark:text-slate-400">
        Add module
      </div>
    );
  }
}
