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
import { IFrame } from "@/components/ui/IFrame";
import { useState } from "react";
import ResourceStatusProvider from "./ResourceStatusProvider";
import axios from "axios";
import { toast } from "react-hot-toast";

interface ResourceSheetLauncherProps {
  children: React.ReactNode;
  commentsSection: React.ReactNode;
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
  isVisited?: boolean;
}

export default function ResourceSheetLauncher({
  children,
  commentsSection,
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
  isVisited,
}: ResourceSheetLauncherProps) {
  const ratingAtom = atom<number>(totalRating);
  const userRatingAtom = atom<boolean | null>(userRating);
  // const resourceStatusAtom = atom<ResourceStatus | null>(resourceStatus);

  const { queryParams, setQueryParams } = useQueryParams();
  const router = useRouter();

  const updateVisited = async () => {
    let body = {
      userId: currentUserId,
      resourceId: resourceId,
      category: category,
    };

    try {
      const res = await axios.post("/api/updateVisited", body);
      toast.success("updates");
    } catch (err) {
      //idk?
      if (err instanceof Error) {
        toast.error("here" + err.message);
      }
    }
  };

  const enterSheet = async () => {
    setDisabledContext(true);
    if (isVisited) {
      await updateVisited();
      router.refresh();
    }
    setQueryParams({ id: resourceId });
    if (!isVisited) {
      updateVisited();
    }
  };

  const exitSheet = () => {
    setDisabledContext(false);
    setCommentsOpen(false);
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
  const [disabledContext, setDisabledContext] = useState(false);

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
          resourceTitle={title}
          resourceUserId={resourceUserId}
          shareURL={PDFURL}
          className="h-full w-full"
          disabled={disabledContext}
          // resourceStatus={resourceStatus}
        >
          <SheetTrigger className="h-full w-full py-3 focus:outline-none">
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
              <div>
                {currentUserId && (
                  <ResourceStatusProvider
                    category={category}
                    resourceId={resourceId}
                    currentUserId={currentUserId}
                    userStatus={resourceStatus}
                  />
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
                  className="flex-1 text-lg"
                  onClick={() => setCommentsOpen(!commentsOpen)}
                >
                  {commentsOpen ? "Close comments" : "View comments"}
                </Button>
              </NBSheetTrigger>
              <NBSheetContent
                className="relative p-0"
                size="default"
                position="left"
                onEscapeKeyDown={() => setCommentsOpen(false)}
              >
                <div
                  className="mb-2 mt-6 flex w-full cursor-pointer justify-end rounded-sm pr-6 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none"
                  onClick={() => setCommentsOpen(false)}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </div>
                {commentsSection}
              </NBSheetContent>
            </NBSheet>
          </div>
        </SheetContent>
      </Sheet>
    </Provider>
  );
}
