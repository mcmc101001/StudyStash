"use client";
import { FC, useState } from "react";
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

interface PDFSheetLauncherProps {
  children: React.ReactNode;
  id: string;
}

const PDFSheetLauncher: FC<PDFSheetLauncherProps> = ({ children, id }) => {
  const router = useRouter();
  const pathnames = usePathname();
  const searchParams = useSearchParams()!;
  const searchParamsID = searchParams.get("id");
  const url = `${pathnames}/?id=${id}`;
  const PDFURL = `https://orbital2023.s3.ap-southeast-1.amazonaws.com/${id}`;

  return (
    <Sheet
      open={searchParamsID === id}
      onOpenChange={() => {
        router.push(url);
      }}
    >
      <SheetTrigger>{children}</SheetTrigger>
      <SheetContent
        size={"xl"}
        onEscapeKeyDown={router.back}
        onPointerDownOutside={router.back}
      >
        <SheetHeader>
          <SheetTitle>Are you sure absolutely sure?</SheetTitle>
          <SheetDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </SheetDescription>
        </SheetHeader>
        <div
          className="absolute right-4 top-4 cursor-pointer rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none"
          onClick={router.back}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </div>
        <iframe src={PDFURL} width="100%" height="500px"></iframe>
      </SheetContent>
    </Sheet>
  );
};

export default PDFSheetLauncher;
