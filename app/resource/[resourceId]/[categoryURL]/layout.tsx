import { getRating } from "@/app/database/[moduleCode]/[category]/page";
import ResizableDiv from "@/components/ui/ResizableDiv";
import { ResourceType, ResourceTypeURL } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import DifficultyRating from "@/components/DifficultyRating";
import { redirect } from "next/navigation";
import {
  CheatsheetStatus,
  CheatsheetVote,
  NotesStatus,
  NotesVote,
  Prisma,
  QuestionPaperStatus,
  QuestionPaperVote,
} from "@prisma/client";
import {
  getCheatsheetStatus,
  getCheatsheetVote,
  getDifficulty,
  getNotesStatus,
  getNotesVote,
  getQuestionPaperStatus,
  getQuestionPaperVote,
  getUserDifficulty,
} from "@/components/ResourceItem";
import ResourceRatingProvider from "@/components/ResourceRatingProvider";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { ChevronLeft } from "lucide-react";
import SolutionTab from "@/components/SolutionTab";
import { solutionTabOptions } from "@/lib/content";

export default async function ResourcePage({
  params: { resourceId, categoryURL },
  children,
}: {
  params: { resourceId: string; categoryURL: ResourceTypeURL };
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  let resource;
  let category: ResourceType;
  if (categoryURL === "cheatsheets") {
    category = "Cheatsheets";
    try {
      resource = await prisma.cheatsheet.findUnique({
        where: { id: resourceId },
        include: {
          votes: true,
        },
      });
    } catch (error) {
      redirect("/401");
    }
  } else if (categoryURL === "past_papers") {
    category = "Past Papers";
    try {
      resource = await prisma.questionPaper.findUnique({
        where: { id: resourceId },
        include: {
          votes: true,
        },
      });
    } catch (error) {
      redirect("/402");
    }
  } else if (categoryURL === "notes") {
    category = "Notes";
    try {
      resource = await prisma.notes.findUnique({
        where: { id: resourceId },
        include: {
          votes: true,
        },
      });
    } catch (error) {
      redirect("/403");
    }
  } else {
    redirect("/404");
  }
  if (!resource) {
    redirect("/404");
  }

  let userVote: CheatsheetVote | NotesVote | QuestionPaperVote | null;
  let userStatus: CheatsheetStatus | NotesStatus | QuestionPaperStatus | null;
  let userDifficultyData: Prisma.PromiseReturnType<typeof getUserDifficulty>;
  let userDifficulty: number = 0;

  // If user is signed in, get user vote as well as user status

  if (categoryURL === "cheatsheets") {
    if (currentUser) {
      userVote = await getCheatsheetVote(currentUser.id, resourceId);
      userStatus = await getCheatsheetStatus(currentUser.id, resourceId);
    } else {
      userVote = null;
      userStatus = null;
    }
  } else if (categoryURL === "notes") {
    if (currentUser) {
      userVote = await getNotesVote(currentUser.id, resourceId);
      userStatus = await getNotesStatus(currentUser.id, resourceId);
    } else {
      userVote = null;
      userStatus = null;
    }
  } else if (categoryURL === "past_papers") {
    if (currentUser) {
      // Parallel data fetching
      const userVotePromise = getQuestionPaperVote(currentUser.id, resourceId);
      const userStatusPromise = getQuestionPaperStatus(
        currentUser.id,
        resourceId
      );
      const userDifficultyPromise = getUserDifficulty(
        currentUser.id,
        resourceId
      );
      [userVote, userStatus, userDifficultyData] = await Promise.all([
        userVotePromise,
        userStatusPromise,
        userDifficultyPromise,
      ]);
      userDifficulty = userDifficultyData?.value || 0;
    } else {
      userVote = null;
      userStatus = null;
      userDifficulty = 0;
    }
  } else {
    redirect("/404");
  }

  const resourceWithRating = getRating([resource]);
  const totalRating = resourceWithRating[0].rating;
  const userRating = userVote !== null ? userVote.value : null;

  const PDFURL = `https://orbital2023.s3.ap-southeast-1.amazonaws.com/${resourceId}`;

  return (
    <div className="flex h-full overflow-hidden">
      <ResizableDiv className="flex max-w-[40vw] flex-col text-slate-800 dark:text-slate-200">
        <Link
          href={`/database/${resource.moduleCode}/${categoryURL}?id=${resourceId}`}
        >
          <Button variant="default">
            <span>
              <ChevronLeft className="-ml-1" size={20} />
            </span>
            <span>Back to resource</span>
          </Button>
        </Link>
        <div className="mt-4 flex flex-row items-center gap-x-4 text-lg font-semibold">
          <ResourceRatingProvider
            category={category}
            currentUserId={currentUser?.id || null}
            totalRating={totalRating}
            userRating={userRating}
            resourceId={resourceId}
          />
          <div className="overflow-scroll scrollbar-none">{resource.name}</div>
          {category === "Past Papers" && (
            <div className="ml-auto mr-4 flex flex-col items-center">
              <span>Rate difficulty</span>
              <DifficultyRating
                resourceId={resourceId}
                currentUserId={currentUser?.id || null}
                userDifficulty={userDifficulty}
              />
            </div>
          )}
        </div>
        <iframe
          title="PDF Resource"
          className="mt-4"
          src={PDFURL}
          width="100%"
          height="100%"
        ></iframe>
      </ResizableDiv>
      <div className="m-10 w-full">
        {categoryURL === "past_papers" ? (
          <div className="mx-auto w-5/6">
            <SolutionTab solutionTabOptions={solutionTabOptions} />
          </div>
        ) : (
          <h1 className="text-2xl text-slate-800 dark:text-slate-200">
            Comments
          </h1>
        )}
        {children}
      </div>
    </div>
  );
}
