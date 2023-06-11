"use client";

import { cn } from "@/lib/utils";
import { RefObject, useRef, useState } from "react";

interface ResizableTextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export default function ResizableTextArea({
  className,
  ...props
}: ResizableTextAreaProps) {
  function setInputHeight(
    element: RefObject<HTMLTextAreaElement>,
    defaultHeight: number
  ) {
    if (element.current) {
      element.current.style.height = defaultHeight + "px";
      element.current.style.height =
        Math.max(element.current.scrollHeight, defaultHeight) + "px";
    }
  }

  let inputRef = useRef<HTMLTextAreaElement>(null);

  return (
    <textarea
      ref={inputRef}
      className={cn(
        "min-h-[100px] w-full resize-none overflow-hidden rounded-xl border border-slate-200 bg-slate-200 p-4 shadow-md scrollbar-none",
        className
      )}
      onChange={() => setInputHeight(inputRef, 105)}
      {...props}
    />
  );
}
