import { getRating } from "@/lib/dataFetching";
import { ResourceType, ResourceTypeURL } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import DifficultyRating from "@/components/resource/DifficultyRating";
import { redirect } from "next/navigation";
import {
  Cheatsheet,
  CheatsheetStatus,
  CheatsheetVote,
  Notes,
  NotesStatus,
  NotesVote,
  Prisma,
  QuestionPaper,
  QuestionPaperStatus,
  QuestionPaperVote,
} from "@prisma/client";
import {
  getCheatsheetStatus,
  getCheatsheetVote,
  getNotesStatus,
  getNotesVote,
  getQuestionPaperStatus,
  getQuestionPaperVote,
  getUserDifficulty,
} from "@/components/resource/ResourceItem";
import ResourceRatingProvider from "@/components/resource/ResourceRatingProvider";
import Link from "next/link";
import Button from "@/components/ui/Button";
import SolutionTab from "@/components/resource/SolutionTab";
import { solutionTabOptions } from "@/lib/content";
import SolutionIncludedIndicator from "@/components/resource/SolutionIncludedIndicator";
import { IFrame } from "@/components/ui/IFrame";
import ResourceStatusProvider from "@/components/resource/ResourceStatusProvider";
import DraggableResizableDiv from "@/components/ui/DraggableResizableDiv";

export async function generateMetadata({
  params,
}: {
  params: { resourceId: string; categoryURL: ResourceTypeURL };
}) {
  let resource: Notes | Cheatsheet | QuestionPaper | null;
  if (params.categoryURL === "cheatsheets") {
    try {
      resource = await prisma.cheatsheet.findUnique({
        where: { id: params.resourceId },
      });
    } catch (error) {
      redirect("/404");
    }
  } else if (params.categoryURL === "past_papers") {
    try {
      resource = await prisma.questionPaper.findUnique({
        where: { id: params.resourceId },
      });
    } catch (error) {
      redirect("/404");
    }
  } else if (params.categoryURL === "notes") {
    try {
      resource = await prisma.notes.findUnique({
        where: { id: params.resourceId },
      });
    } catch (error) {
      redirect("/404");
    }
  } else {
    redirect("/404");
  }
  if (!resource) {
    redirect("/404");
  }

  return {
    title: `StudyStash | ${resource.name} (resizable view)`,
    description: `View ${resource.name} on StudyStash!`,
  };
}

export default async function ResourcePage({
  params: { resourceId, categoryURL },
  children,
}: {
  params: {
    resourceId: string;
    categoryURL: ResourceTypeURL;
  };
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  let resource:
    | (Notes & { votes: NotesVote[] })
    | (Cheatsheet & { votes: CheatsheetVote[] })
    | (QuestionPaper & { votes: QuestionPaperVote[] })
    | null;
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
  const userStatusValue = userStatus !== null ? userStatus.status : null;

  // @ts-expect-error Wrong type inference for category past papers
  const solutionIncluded = resource?.solutionIncluded;

  const PDFURL = `https://${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_DOMAIN}/${resourceId}`;

  return (
    <div className="flex h-full w-full overflow-hidden">
      <DraggableResizableDiv
        leftPanel={
          <div className="h-full w-full overflow-hidden">
            <div className="flex h-full w-full flex-col px-10 py-5 text-slate-800 dark:text-slate-200">
              <div className="mx-2 mt-4 flex flex-row items-center gap-x-4 text-lg font-semibold">
                <ResourceRatingProvider
                  category={category}
                  currentUserId={currentUser?.id || null}
                  totalRating={totalRating}
                  userRating={userRating}
                  resourceId={resourceId}
                />
                <div className="flex overflow-scroll whitespace-nowrap scrollbar-none">
                  {resource.name}
                  {category === "Past Papers" && solutionIncluded && (
                    <SolutionIncludedIndicator />
                  )}
                </div>
                <div>
                  {currentUser && (
                    <ResourceStatusProvider
                      category={category}
                      resourceId={resourceId}
                      currentUserId={currentUser.id}
                      userStatus={userStatusValue}
                    />
                  )}
                </div>
                {category === "Past Papers" && (
                  <div className="ml-auto flex flex-col items-center">
                    <span className="text-base">Rate difficulty</span>
                    <DifficultyRating
                      resourceId={resourceId}
                      currentUserId={currentUser?.id || null}
                      userDifficulty={userDifficulty}
                    />
                  </div>
                )}
                <Link
                  href={`/database/${resource.moduleCode}/${categoryURL}?id=${resourceId}`}
                  className="ml-auto w-max"
                >
                  <Button variant="default">
                    {/* <span>
                      <ChevronLeft className="-ml-1" size={20} />
                    </span> */}
                    <span>Sheet view</span>
                  </Button>
                </Link>
              </div>
              <IFrame
                title="PDF Resource"
                className="mt-5 flex-1"
                src={PDFURL}
                width="100%"
                height="100%"
              ></IFrame>
            </div>
          </div>
        }
        rightPanel={
          <div className="relative h-full w-full overflow-hidden py-5">
            {categoryURL === "past_papers" && (
              <SolutionTab solutionTabOptions={solutionTabOptions} />
            )}
            {children}
          </div>
        }
      />
    </div>
  );
}
