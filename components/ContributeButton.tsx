"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import { toast } from "react-hot-toast";

export default function ContributeButton({
  userId,
}: {
  userId: string | undefined;
}) {
  const queryParams = useSearchParams();
  const params = useParams(); // No need check type since guaranteed? Contribute page already checks

  return userId ? (
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
  ) : (
    <Button
      variant="ghost"
      size="lg"
      className="border border-slate-800 text-lg dark:border-slate-200"
      onClick={() => {
        toast.error("Please login!");
      }}
    >
      Contribute
    </Button>
  );
}
