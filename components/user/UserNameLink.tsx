import Link from "next/link";
import ProfileVerifiedIndicator from "./ProfileVerifiedIndicator";
import { cn } from "@/lib/utils";

interface UserNameLinkProps {
  id: string;
  name: string;
  verified: boolean;
  className?: string;
}

export default function UserNameLink({
  id,
  name,
  verified,
  className,
}: UserNameLinkProps) {
  return (
    <>
      <Link
        href={`/profile/${id}`}
        className={cn(
          "group ml-auto block max-w-[210px] truncate text-slate-600 hover:text-slate-700 focus:outline-none dark:text-slate-400 dark:hover:text-slate-300",
          className
        )}
      >
        <div className="flex items-center">
          <span className="truncate">{name}</span>
        </div>
        <span className="mx-auto block h-0.5 max-w-0 bg-slate-700 transition-all duration-300 group-hover:max-w-full dark:bg-slate-300"></span>
      </Link>
      {verified && (
        <div>
          <ProfileVerifiedIndicator />
        </div>
      )}
    </>
  );
}
