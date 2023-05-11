import { ResourceType } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import PDFSheetLauncher from "@/components/PDFSheetLauncher";
import Rating from "@/components/Rating";
import {
  CheatsheetVote,
  QuestionPaperVote,
  NotesVote,
  ExamType,
  Prisma,
} from "@prisma/client";
import { getCurrentUser } from "@/lib/session";
import Link from "next/link";
import DifficultyDisplayDialog from "@/components/DifficultyDisplayDialog";
import ResourceDeleteButton from "@/components/ResourceDeleteButton";

async function getCheatsheetVote(userId: string, resourceId: string) {
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

async function getNotesVote(userId: string, resourceId: string) {
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

async function getQuestionPaperVote(userId: string, resourceId: string) {
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

async function getDifficulty(resourceId: string) {
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

async function getUserDifficulty(userId: string, resourceId: string) {
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
  semester: string;
  category: ResourceType;
  difficultyCount?: number;
  examType?: ExamType;
  rating: number;
  deletable?: boolean;
}

export default async function ResourceItem({
  name,
  resourceId,
  userId,
  createdAt,
  acadYear,
  semester,
  difficultyCount,
  examType,
  category,
  rating,
  deletable,
}: ResourceItemProps) {
  const resourceUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  const currentUser = await getCurrentUser();

  let votes: CheatsheetVote[] | NotesVote[] | QuestionPaperVote[];
  let userVote: CheatsheetVote | NotesVote | QuestionPaperVote | null;
  let avgDifficultyData: Prisma.PromiseReturnType<typeof getDifficulty>;
  let userDifficultyData: Prisma.PromiseReturnType<typeof getUserDifficulty>;
  let avgDifficulty: number = 0;
  let userDifficulty: number = 0;

  // If user is signed in, get user vote as well, otherwise just get total votes

  if (category === "Cheatsheets") {
    // const votesPromise = prisma.cheatsheetVote.findMany({
    //   where: {
    //     resourceId: id,
    //   },
    // });
    if (currentUser) {
      userVote = await getCheatsheetVote(currentUser.id, resourceId);
    } else {
      userVote = null;
    }
  } else if (category === "Notes") {
    if (currentUser) {
      userVote = await getNotesVote(currentUser.id, resourceId);
    } else {
      userVote = null;
    }
  } else if (category === "Past Papers") {
    const avgDifficultyPromise = getDifficulty(resourceId);
    if (currentUser) {
      const userVotePromise = getQuestionPaperVote(currentUser.id, resourceId);
      const userDifficultyPromise = getUserDifficulty(
        currentUser.id,
        resourceId
      );
      [avgDifficultyData, userDifficultyData, userVote] = await Promise.all([
        avgDifficultyPromise,
        userDifficultyPromise,
        userVotePromise,
      ]);
      userDifficulty = userDifficultyData?.value || 0;
      avgDifficulty = avgDifficultyData._avg.value || 0;
    } else {
      avgDifficultyData = await avgDifficultyPromise;
      avgDifficulty = avgDifficultyData._avg.value || 0;
      userVote = null;
      userDifficulty = 0;
    }
  } else {
    redirect("/404");
  }

  return (
    <div className="flex h-24 flex-row items-center rounded-xl border border-slate-800 p-4 hover:bg-slate-200 dark:border-slate-200 dark:hover:bg-slate-800">
      <Rating
        resourceId={resourceId}
        currentUserId={currentUser ? currentUser.id : null}
        category={category}
        totalRating={rating}
        userRating={userVote !== null ? userVote.value : null}
      />
      <div className="ml-3 box-border h-full w-full overflow-hidden">
        <PDFSheetLauncher
          resourceId={resourceId}
          title={name}
          currentUserId={currentUser ? currentUser.id : null}
          category={category}
          totalRating={rating}
          userRating={userVote !== null ? userVote.value : null}
          userDifficulty={userDifficulty}
        >
          <div className="flex items-center">
            <div className="space-y-2 overflow-hidden text-ellipsis pr-4">
              <p className="overflow-hidden whitespace-nowrap text-left font-semibold">
                {name}
              </p>
              <p className="overflow-hidden whitespace-nowrap text-left text-slate-600 dark:text-slate-400">
                {createdAt.toLocaleString("en-GB", {
                  minute: "2-digit",
                  hour: "2-digit",
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="ml-auto space-y-2">
              <p className="whitespace-nowrap text-end">
                {category !== "Notes" ? `${examType}, ` : ""}
                {`${acadYear} S${semester}`}
              </p>
              <p className="whitespace-nowrap text-end">
                <Link
                  href={`/profile/${resourceUser?.id}`}
                  className="text-slate-600 hover:text-slate-700 hover:underline dark:text-slate-400 dark:hover:text-slate-300"
                >
                  {resourceUser?.name}
                </Link>
              </p>
            </div>
          </div>
        </PDFSheetLauncher>
      </div>
      {category === "Past Papers" && (
        <div className="ml-4 flex h-full items-center justify-center border-l-2 border-slate-500 pl-4">
          <DifficultyDisplayDialog
            resourceId={resourceId}
            difficulty={avgDifficulty}
            difficultyCount={difficultyCount as number}
          />
        </div>
      )}
      {deletable && currentUser?.id === userId && (
        <div className="ml-4 flex h-full items-center justify-center border-l-2 border-slate-500 pl-4">
          <ResourceDeleteButton resourceId={resourceId} category={category} />
        </div>
      )}
    </div>
  );
}
