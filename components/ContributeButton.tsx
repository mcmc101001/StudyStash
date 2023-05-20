"use client";

import { ResourceTypeURL } from "@/lib/content";
import Link from "next/link";
import useQueryParams from "@/hooks/useQueryParams";
import { useParams, redirect } from "next/navigation";

interface ContributeButtonProps {
  moduleCode: string;
}

export default function ContributeButton({
  moduleCode,
}: ContributeButtonProps) {
  const { queryParams, setQueryParams } = useQueryParams();
  const params = useParams(); // No need check type since guaranteed? Contribute page already checks

  return (
    <Link
      href={
        `/addPDF/${params?.category}` +
        `/?filterModuleCode=${params?.moduleCode}&${queryParams?.toString()}`
      }
      className="rounded-md border border-slate-800 p-2 font-semibold dark:border-slate-200 dark:text-slate-200"
    >
      Contribute
    </Link>
  );
}
