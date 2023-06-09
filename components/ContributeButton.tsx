"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";

export default function ContributeButton() {
  const queryParams = useSearchParams();
  const params = useParams(); // No need check type since guaranteed? Contribute page already checks

  return (
    <Link
      href={
        `/addPDF/${params?.category}` +
        `/?filterModuleCode=${params?.moduleCode}&${queryParams?.toString()}`
      }
    >
      <Button
        variant="ghost"
        size="lg"
        className="border border-slate-800 text-lg dark:border-slate-200"
      >
        Contribute
      </Button>
    </Link>
  );
}
