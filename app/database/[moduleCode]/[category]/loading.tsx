import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="flex gap-x-6">
      <div className="flex w-4/5 flex-col gap-y-6">
        <Skeleton className="h-24 w-full rounded-xl bg-slate-200 dark:bg-slate-800" />
        <Skeleton className="h-24 w-full rounded-xl bg-slate-200 dark:bg-slate-800" />
        <Skeleton className="h-24 w-full rounded-xl bg-slate-200 dark:bg-slate-800" />
        <Skeleton className="h-24 w-full rounded-xl bg-slate-200 dark:bg-slate-800" />
      </div>
      <div className="flex w-1/5 flex-col gap-y-6">
        <Skeleton className="h-24 w-full rounded-xl bg-slate-200 dark:bg-slate-800" />
        <Skeleton className="h-24 w-full rounded-xl bg-slate-200 dark:bg-slate-800" />
      </div>
    </div>
  );
}
