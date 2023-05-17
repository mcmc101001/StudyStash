"use client";

import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { useState } from "react";

export default function ResizableDiv({
  children,
}: {
  children: React.ReactNode;
}) {
  const [minimised, setMinimised] = useState(false);
  return (
    <>
      <div
        className={
          "relative flex flex-col text-white transition-all duration-500 " +
          (minimised
            ? "invisible m-0 ml-8 w-0 opacity-0"
            : "m-10 w-full opacity-100")
        }
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
