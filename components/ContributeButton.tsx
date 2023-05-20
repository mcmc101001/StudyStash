"use client";

import { ResourceTypeURL } from "@/lib/content";
import Link from "next/link";

interface ContributeButtonProps {
  category: ResourceTypeURL;
  moduleCode: string;
  queryParams: string | undefined;
}

export default function ContributeButton({
  category,
  moduleCode,
  queryParams,
}: ContributeButtonProps) {
  return (
    <Link
      href={`/addPDF/${category}/?filterModuleCode=${moduleCode}&${queryParams}`}
      className="absolute right-16 top-12 rounded-md border border-slate-800 p-2 font-semibold dark:border-slate-200"
    >
      Contribute
    </Link>
  );
}
