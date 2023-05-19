"use client";

import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function ResizableDiv({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [minimised, setMinimised] = useState(false);
  return (
    <>
      <div
        className={cn(
          "relative transition-all duration-500",
          {
            "invisible m-0 ml-8 w-0 opacity-0": minimised === true,
            "m-10 w-full opacity-100": minimised === false,
          },
          className
        )}
      >
        {children}
      </div>
      <button
        onClick={() => setMinimised(!minimised)}
        className="top-1/2 h-full"
      >
        {minimised ? (
          <ChevronsRight className="text-white" size={24} />
        ) : (
          <ChevronsLeft className="text-white" size={24} />
        )}
      </button>
    </>
  );
}
