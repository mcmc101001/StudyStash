"use client";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/Sheet";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import useQueryParams from "@/hooks/useQueryParams";
import ResourceRating from "@/components/ResourceRating";
import { ResourceType } from "@/lib/content";
import DifficultyRating from "@/components/DifficultyRating";
import { atom } from "jotai";

interface PDFSheetLauncherProps {
  children: React.ReactNode;
  title: string;
  resourceId: string;
  category: ResourceType;
  currentUserId: string | null;
  totalRating: number;
  userRating: boolean | null;
  userDifficulty: number;
}

export default function PDFSheetLauncher({
  children,
  title,
  resourceId,
  category,
  currentUserId,
  totalRating,
  userRating,
  userDifficulty,
}: PDFSheetLauncherProps) {
  const ratingAtom = atom<number>(totalRating);
  const userRatingAtom = atom<boolean | null>(userRating);

  const { queryParams, setQueryParams } = useQueryParams();
  const router = useRouter();
  const PDFURL = `https://orbital2023.s3.ap-southeast-1.amazonaws.com/${resourceId}`;

  return (
    <Sheet
      open={queryParams?.get("id") === resourceId}
      onOpenChange={() => {
        setQueryParams({ id: resourceId });
      }}
    >
      <SheetTrigger className="h-full w-full py-2">
        <div className="flex items-center">
          <ResourceRating
            category={category}
            resourceId={resourceId}
            currentUserId={currentUserId}
            ratingAtom={ratingAtom}
            userRatingAtom={userRatingAtom}
          />
          {children}
        </div>
      </SheetTrigger>
      <SheetContent
        size={"xl"}
        onEscapeKeyDown={router.back}
        onPointerDownOutside={router.back}
      >
        <SheetHeader>
          <SheetTitle className="flex flex-row items-center gap-x-4">
            <ResourceRating
              category={category}
              currentUserId={currentUserId}
              ratingAtom={ratingAtom}
              userRatingAtom={userRatingAtom}
              resourceId={resourceId}
            />
            <div className="overflow-scroll scrollbar-none">{title}</div>
            {category === "Past Papers" && (
              <div className="ml-auto mr-4 flex flex-col items-center">
                <span>Rate difficulty</span>
                <DifficultyRating
                  resourceId={resourceId}
                  currentUserId={currentUserId}
                  userDifficulty={userDifficulty}
                />
              </div>
            )}
          </SheetTitle>
          <SheetDescription></SheetDescription>
          <div
            className="absolute right-4 top-4 cursor-pointer rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none"
            onClick={router.back}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </div>
        </SheetHeader>
        <iframe src={PDFURL} width="100%" height="600px"></iframe>
      </SheetContent>
    </Sheet>
  );
}
