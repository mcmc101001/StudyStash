import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ResourceSheetLauncher from "@/components/resource/ResourceSheetLauncher";
import {
  CheatsheetVote,
  QuestionPaperVote,
  NotesVote,
  CheatsheetStatus,
  NotesStatus,
  QuestionPaperStatus,
  ExamType,
  Prisma,
  SolutionVote,
  SolutionStatus,
  SemesterType,
} from "@prisma/client";
import { getCurrentUser } from "@/lib/session";
import Link from "next/link";
import DifficultyDisplayDialog from "@/components/resource/DifficultyDisplayDialog";
import { Separator } from "@/components/ui/Separator";
import ClientDateTime from "@/components/ClientDateTime";
import SolutionIncludedIndicator from "@/components/resource/SolutionIncludedIndicator";
import { ResourceSolutionType } from "@/lib/content";
import {
  getSolutionStatus,
  getSolutionVote,
} from "@/components/resource/SolutionItem";
import ResourceDeleteButton from "@/components/resource/ResourceDeleteButton";
import CommentsSection from "@/components/comments/CommentsSection";
import ResourceStatusProvider from "@/components/resource/ResourceStatusProvider";
import ProfileVerifiedIndicator from "@/components/user/ProfileVerifiedIndicator";

/*************** DATA FETCHING CODE ****************/
export async function getCheatsheetVote(userId: string, resourceId: string) {
  const res = await prisma.cheatsheetVote.findUnique({
    where: {
      userId_resourceId: {
        userId: userId,
        resourceId: resourceId,
      },
    },
  });
  return res;
}

export async function getNotesVote(userId: string, resourceId: string) {
  const res = await prisma.notesVote.findUnique({
    where: {
      userId_resourceId: {
        userId: userId,
        resourceId: resourceId,
      },
    },
  });
  return res;
}

export async function getQuestionPaperVote(userId: string, resourceId: string) {
  const res = await prisma.questionPaperVote.findUnique({
    where: {
      userId_resourceId: {
        userId: userId,
        resourceId: resourceId,
      },
    },
  });
  return res;
}

export async function getCheatsheetStatus(userId: string, resourceId: string) {
  const res = await prisma.cheatsheetStatus.findUnique({
    where: {
      userId_resourceId: {
        userId: userId,
        resourceId: resourceId,
      },
    },
  });
  return res;
}

export async function getNotesStatus(userId: string, resourceId: string) {
  const res = await prisma.notesStatus.findUnique({
    where: {
      userId_resourceId: {
        userId: userId,
        resourceId: resourceId,
      },
    },
  });
  return res;
}

export async function getQuestionPaperStatus(
  userId: string,
  resourceId: string
) {
  const res = await prisma.questionPaperStatus.findUnique({
    where: {
      userId_resourceId: {
        userId: userId,
        resourceId: resourceId,
      },
    },
  });
  return res;
}

export async function getDifficulty(resourceId: string) {
  const res = prisma.questionPaperDifficulty.aggregate({
    where: {
      resourceId: resourceId,
    },
    _avg: {
      value: true,
    },
  });
  return res;
}

export async function getUserDifficulty(userId: string, resourceId: string) {
  const res = prisma.questionPaperDifficulty.findUnique({
    where: {
      userId_resourceId: {
        userId: userId,
        resourceId: resourceId,
      },
    },
  });
  return res;
}

interface ResourceItemProps {
  name: string;
  resourceId: string;
  userId: string;
  createdAt: Date;
  acadYear: string;
  semester: SemesterType;
  category: ResourceSolutionType;
  difficulty?: number;
  difficultyCount?: number;
  examType?: ExamType;
  solutionIncluded?: boolean;
  rating: number;
  isProfilePage?: boolean;
  moduleCode?: string;
  questionPaperId?: string;
  isVisited?: boolean;
  displayCode?: boolean;
}

export default async function ResourceItem({
  name,
  resourceId,
  userId,
  createdAt,
  acadYear,
  semester,
  difficulty,
  difficultyCount,
  examType,
  solutionIncluded,
  category,
  rating,
  isProfilePage,
  moduleCode,
  questionPaperId,
  isVisited = false,
  displayCode,
}: ResourceItemProps) {
  const resourceUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  const currentUser = await getCurrentUser();

  let userVote:
    | CheatsheetVote
    | NotesVote
    | QuestionPaperVote
    | SolutionVote
    | null;
  let userStatus:
    | CheatsheetStatus
    | NotesStatus
    | QuestionPaperStatus
    | SolutionStatus
    | null;
  let userDifficultyData: Prisma.PromiseReturnType<typeof getUserDifficulty>;
  let userDifficulty: number = 0;

  // If user is signed in, get user vote as well as user status

  if (category === "Cheatsheets") {
    if (currentUser) {
      userVote = await getCheatsheetVote(currentUser.id, resourceId);
      userStatus = await getCheatsheetStatus(currentUser.id, resourceId);
    } else {
      userVote = null;
      userStatus = null;
    }
  } else if (category === "Notes") {
    if (currentUser) {
      userVote = await getNotesVote(currentUser.id, resourceId);
      userStatus = await getNotesStatus(currentUser.id, resourceId);
    } else {
      userVote = null;
      userStatus = null;
    }
  } else if (category === "Solutions") {
    if (currentUser) {
      userVote = await getSolutionVote({
        userId: currentUser.id,
        solutionId: resourceId,
      });
      userStatus = await getSolutionStatus({
        userId: currentUser.id,
        solutionId: resourceId,
      });
    } else {
      userVote = null;
      userStatus = null;
    }
  } else if (category === "Past Papers") {
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

  let semesterString: string;
  if (semester === "semester1") {
    semesterString = "S1";
  } else if (semester === "semester2") {
    semesterString = "S2";
  } else if (semester === "specialTerm1") {
    semesterString = "ST1";
  } else if (semester === "specialTerm2") {
    semesterString = "ST2";
  } else {
    semesterString = "ERROR";
  }

  return (
    <li
      data-cy="resourceItem"
      className="min-h-24 flex flex-row items-center rounded-xl border border-slate-400 px-4 transition-colors duration-300 
      hover:border-violet-500 hover:bg-slate-200 dark:border-slate-400 dark:hover:border-violet-600 dark:hover:bg-slate-800 "
    >
      <div className="flex h-full w-full overflow-hidden">
        {/* @container breaks tooltips */}
        <ResourceSheetLauncher
          commentsSection={
            // @ts-expect-error Server component
            <CommentsSection
              label="Comments"
              className="h-[90vh]"
              resourceId={resourceId}
              category={category}
            />
          }
          resourceId={resourceId}
          resourceUserId={resourceUser?.id!}
          title={name}
          currentUserId={currentUser ? currentUser.id : null}
          category={category}
          totalRating={rating}
          userRating={userVote !== null ? userVote.value : null}
          userDifficulty={userDifficulty}
          resourceStatus={userStatus ? userStatus.status : null}
          solutionIncluded={solutionIncluded}
          questionPaperId={questionPaperId}
          isVisited={isVisited}
        >
          <div className="ml-3 flex h-full flex-col gap-y-2 overflow-hidden pr-4">
            <div className="flex items-center gap-x-2 text-left font-semibold">
              <span className="max-w-xl overflow-scroll text-ellipsis whitespace-nowrap scrollbar-none">
                {/* @2xl:max-w-xs @3xl:max-w-xl */}
                {name}
              </span>
              {category === "Past Papers" && solutionIncluded && (
                <SolutionIncludedIndicator />
              )}
              {currentUser && (
                <ResourceStatusProvider
                  category={category}
                  resourceId={resourceId}
                  currentUserId={currentUser.id}
                  userStatus={userStatus ? userStatus.status : null}
                />
              )}
            </div>
            <p className="overflow-hidden overflow-x-scroll whitespace-nowrap text-left text-slate-600 scrollbar-none dark:text-slate-400">
              <ClientDateTime datetime={createdAt} />
            </p>
          </div>
          <div className="ml-auto flex h-full flex-col gap-y-2">
            <p className="whitespace-nowrap text-end">
              {displayCode ? (
                <>
                  <Link
                    className="hover:text-violet-700 dark:hover:text-violet-500"
                    href={`/database/${moduleCode}/cheatsheets`}
                  >
                    {moduleCode}
                  </Link>
                  {", "}
                </>
              ) : (
                ""
              )}
              {category !== "Notes" ? `${examType}, ` : ""}
              {`${acadYear} ${semesterString}`}
            </p>
            <div className="ml-auto flex w-max whitespace-nowrap text-end">
              {isProfilePage ? (
                <Link
                  className="truncate hover:text-violet-700 dark:hover:text-violet-500"
                  href={`/database/${moduleCode}/cheatsheets`}
                >
                  {moduleCode}
                </Link>
              ) : (
                <>
                  <Link
                    href={`/profile/${resourceUser?.id!}`}
                    className={
                      "group ml-auto block max-w-[210px] truncate text-slate-600 hover:text-slate-700 focus:outline-none dark:text-slate-400 dark:hover:text-slate-300"
                    }
                  >
                    <div className="flex items-center">
                      <span className="truncate">{resourceUser?.name!}</span>
                    </div>
                    <span className="mx-auto block h-0.5 max-w-0 bg-slate-700 transition-all duration-300 group-hover:max-w-full dark:bg-slate-300"></span>
                  </Link>
                  {resourceUser?.verified! && (
                    <div>
                      <ProfileVerifiedIndicator />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </ResourceSheetLauncher>
      </div>
      {category === "Past Papers" && (
        <div className="flex h-full items-center justify-center">
          <Separator
            className="mx-4 box-border h-3/4 bg-slate-800 dark:bg-slate-200"
            orientation="vertical"
          />
          <DifficultyDisplayDialog
            resourceId={resourceId}
            difficulty={difficulty as number}
            difficultyCount={difficultyCount as number}
          />
        </div>
      )}
      {isProfilePage && currentUser?.id === userId && (
        <div className="flex h-full items-center justify-center">
          <Separator
            className="mx-4 box-border h-3/4 bg-slate-800 dark:bg-slate-200"
            orientation="vertical"
          />
          <ResourceDeleteButton
            currentUserId={currentUser.id}
            resourceId={resourceId}
            category={category}
          />
        </div>
      )}
    </li>
  );
}
