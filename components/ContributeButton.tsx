"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";

interface ContributeButtonProps {
  moduleCode: string;
}

export default function ContributeButton({
  moduleCode,
}: ContributeButtonProps) {
  const searchParams = useSearchParams();
  const params = useParams(); // No need check type since guaranteed? Contribute page already checks

  return (
    <Link
      href={
        `/addPDF/${params?.category}` +
        `/?filterModuleCode=${params?.moduleCode}&${searchParams?.toString()}`
      }
      className="rounded-md border border-slate-800 p-2 font-semibold dark:border-slate-200 dark:text-slate-200"
    >
      Contribute
    </Link>
  );
}
