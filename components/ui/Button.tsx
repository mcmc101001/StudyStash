"use client";

import { cva, VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "active:scale-95 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default:
          "dark:bg-slate-100 dark:text-slate-700 dark:hover:bg-slate-300 bg-slate-900 text-slate-300 hover:bg-slate-800",
        ghost:
          "bg-transparent dark:text-slate-200 dark:hover:text-slate-300 dark:hover:bg-slate-800 text-slate-800 hover:text-slate-700 hover:bg-slate-200",
        dangerous:
          "bg-red-600 text-white hover:bg-red-500 dark:bg-red-700 dark:hover:bg-red-600",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-2",
        lg: "h-11 px-8",
        huge: "h-56 w-96 px-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export default function Button({
  className,
  children,
  variant,
  isLoading,
  size,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={isLoading}
      {...props}
    >
      {children}
      {isLoading ? (
        <Loader2 className="ml-1 h-4 w-4 animate-spin text-slate-200 dark:text-slate-800" />
      ) : null}
    </button>
  );
}
