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
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface PDFSheetLauncherProps {
  children: React.ReactNode;
  id: string;
}

const PDFSheetLauncher: FC<PDFSheetLauncherProps> = ({ children, id }) => {
  const pathnames = usePathname();
  const searchParams = useSearchParams()!;
  const searchParamsID = searchParams.get("id");

  return (
    <Sheet open={id === searchParamsID}>
      <Link href={`${pathnames}/?id=${id}`}>{children}</Link>
      <SheetContent size={"xl"}>
        <SheetHeader>
          <SheetTitle>Are you sure absolutely sure?</SheetTitle>
          <SheetDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default PDFSheetLauncher;
