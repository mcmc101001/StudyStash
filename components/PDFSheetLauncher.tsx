"use client";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/Sheet";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import useQueryParams from "@/hooks/useQueryParams";
import Rating from "./Rating";
import { ResourceType } from "@/lib/content";

interface PDFSheetLauncherProps {
  children: React.ReactNode;
  title: string;
  id: string;
  category: ResourceType;
  currentUserId: string | null;
  totalRating: number;
  userRating: boolean | null;
}

export default function PDFSheetLauncher({
  children,
  title,
  id,
  category,
  currentUserId,
  totalRating,
  userRating,
}: PDFSheetLauncherProps) {
  const { queryParams, setQueryParams } = useQueryParams();
  const router = useRouter();
  const PDFURL = `https://orbital2023.s3.ap-southeast-1.amazonaws.com/${id}`;

  return (
    <Sheet
      open={queryParams?.get("id") === id}
      onOpenChange={() => {
        setQueryParams({ id: id });
      }}
    >
      <SheetTrigger className="h-full w-full">{children}</SheetTrigger>
      <SheetContent
        size={"xl"}
        onEscapeKeyDown={router.back}
        onPointerDownOutside={router.back}
      >
        <SheetHeader>
          <SheetTitle className="flex flex-row items-center gap-x-4">
            <Rating
              category={category}
              currentUserId={currentUserId}
              totalRating={totalRating}
              userRating={userRating}
              resourceId={id}
            />
            <div>{title}</div>
          </SheetTitle>
          <SheetDescription>Placeholder text</SheetDescription>
          <div
            className="absolute right-4 top-4 cursor-pointer rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none"
            onClick={router.back}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </div>
        </SheetHeader>
        <iframe
          src={PDFURL}
          width="100%"
          height="600px"
          className="mt-4"
        ></iframe>
      </SheetContent>
    </Sheet>
  );
}
