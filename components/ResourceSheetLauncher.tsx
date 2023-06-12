"use client";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/Sheet";
import {
  NBSheet,
  NBSheetTrigger,
  NBSheetContent,
  NBSheetHeader,
  NBSheetTitle,
  NBSheetDescription,
} from "@/components/ui/NoBlurSheet";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import useQueryParams from "@/hooks/useQueryParams";
import ResourceRating from "@/components/ResourceRating";
import { ResourceSolutionType } from "@/lib/content";
import DifficultyRating from "@/components/DifficultyRating";
import { Provider, atom } from "jotai";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { solutionTabOptions } from "@/lib/content";
import ResourceContextMenu from "@/components/ResourceContextMenu";
import { ResourceStatus } from "@prisma/client";
import SolutionIncludedIndicator from "@/components/SolutionIncludedIndicator";
import PDFViewer from "@/components/PDFViewer";
import { IFrame } from "@/components/ui/IFrame";
import AddCommentSection from "@/components/AddCommentSection";
import { useState } from "react";

interface ResourceSheetLauncherProps {
  children: React.ReactNode;
  title: string;
  resourceId: string;
  resourceUserId: string;
  category: ResourceSolutionType;
  currentUserId: string | null;
  totalRating: number;
  userRating: boolean | null;
  userDifficulty: number;
  resourceStatus: ResourceStatus | null;
  solutionIncluded?: boolean;
  questionPaperId?: string;
}

export default function ResourceSheetLauncher({
  children,
  title,
  resourceId,
  resourceUserId,
  category,
  currentUserId,
  totalRating,
  userRating,
  userDifficulty,
  resourceStatus,
  solutionIncluded,
  questionPaperId,
}: ResourceSheetLauncherProps) {
  const ratingAtom = atom<number>(totalRating);
  const userRatingAtom = atom<boolean | null>(userRating);

  const { queryParams, setQueryParams } = useQueryParams();
  const router = useRouter();

  const enterSheet = () => {
    setQueryParams({ id: resourceId });
    router.refresh(); // to sync any upvotes before entering dialog with dialog's state
  };

  const exitSheet = () => {
    setQueryParams({ id: null });
  };

  const PDFURL = `https://${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_DOMAIN}/${resourceId}`;

  const categoryURL =
    category === "Cheatsheets"
      ? "cheatsheets"
      : category === "Past Papers"
      ? "past_papers"
      : category === "Notes"
      ? "notes"
      : "solutions";

  const [commentsOpen, setCommentsOpen] = useState(false);

  return (
    <Provider>
      <Sheet
        open={queryParams?.get("id") === resourceId}
        onOpenChange={
          queryParams?.get("id") !== resourceId ? enterSheet : undefined
        }
      >
        <ResourceContextMenu
          category={category}
          currentUserId={currentUserId}
          resourceId={resourceId}
          resourceUserId={resourceUserId}
          shareURL={PDFURL}
          className="h-full w-full"
          // resourceStatus={resourceStatus}
        >
          <SheetTrigger className="h-full w-full py-3">
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
        </ResourceContextMenu>
        <SheetContent
          size={"xl"}
          onEscapeKeyDown={exitSheet}
          onPointerDownOutside={exitSheet}
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
              <div className="flex overflow-scroll scrollbar-none">
                {title}
                {category === "Past Papers" && solutionIncluded && (
                  <SolutionIncludedIndicator />
                )}
              </div>
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
              onClick={exitSheet}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </div>
          </SheetHeader>
          {/* <PDFViewer url={PDFURL} /> */}
          {/* <object
            data={shareURL}
            type="application/pdf"
            width="100%"
            height="85%"
          /> */}
          {/* <embed
            src={PDFURL}
            type="application/pdf"
            width="100%"
            height="85%"
          /> */}
          <IFrame title="PDF Resource" src={PDFURL} width="100%" height="80%" />
          <div className="mt-5 flex h-max gap-x-4">
            {solutionTabOptions.map((option) => {
              if (!option.assignedCategory.includes(category)) return null;
              return (
                <Link
                  className="flex-1"
                  key={option.tabName}
                  href={
                    categoryURL === "solutions"
                      ? `/resource/${questionPaperId}/past_papers/solutions/${resourceId}`
                      : `/resource/${resourceId}/${categoryURL}/${option.href}`
                  }
                >
                  <Button
                    variant="default"
                    size="lg"
                    className="w-full text-lg"
                  >
                    {option.buttonName}
                  </Button>
                </Link>
              );
            })}
            <NBSheet modal={false} open={commentsOpen}>
              <NBSheetTrigger asChild>
                <Button
                  variant="default"
                  size="lg"
                  className="w-1/2 text-lg"
                  onClick={() => setCommentsOpen(!commentsOpen)}
                >
                  {commentsOpen ? "Close comments" : "View comments v2"}
                </Button>
              </NBSheetTrigger>
              <NBSheetContent
                size="default"
                position="left"
                onEscapeKeyDown={() => setCommentsOpen(false)}
                onOpenAutoFocus={(event) => event.preventDefault()}
              >
                <div className="flex flex-col justify-center gap-3">
                  <div className="flex flex-row items-center justify-between text-2xl font-bold text-slate-800 dark:text-slate-200">
                    <p>Comments</p>
                    <Button
                      variant="ghost"
                      onClick={() => setCommentsOpen(false)}
                      className="rounded-full p-2"
                    >
                      <X />
                    </Button>
                  </div>
                  <AddCommentSection
                    category={category}
                    resourceId={resourceId}
                    currentUserId={currentUserId ?? undefined}
                  />
                  <div> all the comments </div>
                </div>
              </NBSheetContent>
            </NBSheet>
          </div>
        </SheetContent>
      </Sheet>
    </Provider>
  );
}
