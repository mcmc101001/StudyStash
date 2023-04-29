import Link from "next/link";
import { ResourceOptions } from "@/lib/content";
import { Icons } from "@/components/Icons";
import { Separator } from "@/components/ui/Separator";

interface DashboardItemProps {
  moduleCode: string;
}

export default function DashboardItem({ moduleCode }: DashboardItemProps) {
  return (
    <div className="flex h-60 w-60 flex-col justify-center rounded-lg border p-4">
      <h1 className="mb-2 mt-auto text-3xl">{moduleCode}</h1>
      <Separator className="bg-slate-800 dark:bg-slate-200" />
      <div className="mt-4 flex flex-row items-center justify-center gap-3">
        {ResourceOptions.map((option, index, { length }) => {
          const Icon = Icons[option.icon];
          return (
            <>
              <Link href={`/database/${moduleCode}/${option.href}`}>
                <Icon className="h-12 w-12" />
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
}
