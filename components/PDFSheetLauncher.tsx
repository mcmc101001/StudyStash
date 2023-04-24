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
import { RouteHandlerManager } from "next/dist/server/future/route-handler-managers/route-handler-manager";

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

  return (
    <Sheet
      onOpenChange={() => {
        router.push(url);
      }}
    >
      <SheetTrigger>{children}</SheetTrigger>
      <SheetContent
        size={"xl"}
        onEscapeKeyDown={router.back}
        // onPointerDownOutside={router.back}
      >
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
