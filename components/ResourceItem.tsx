import { ResourceType } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import PDFSheetLauncher from "@/components/PDFSheetLauncher";
import Rating from "@/components/Rating";
import { CheatsheetVote, QuestionPaperVote, NotesVote } from "@prisma/client";
import { getCurrentUser } from "@/lib/session";
import Link from "next/link";

interface ResourceItemProps {
  name: string;
  id: string;
  userId: string;
  createdAt: Date;
  acadYear: string;
  semester: string;
  category: ResourceType;
  examType?: string;
  rating: number;
}

export default async function ResourceItem({
  name,
  id,
  userId,
  createdAt,
  acadYear,
  semester,
  examType,
  category,
  rating,
}: ResourceItemProps) {
  const resourceUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  const currentUser = await getCurrentUser();

  let votes: CheatsheetVote[] | NotesVote[] | QuestionPaperVote[];
  let userVote: CheatsheetVote | NotesVote | QuestionPaperVote | null;

  // If user is signed in, get user vote as well, otherwise just get total votes

  if (category === "Cheatsheets") {
    // const votesPromise = prisma.cheatsheetVote.findMany({
    //   where: {
    //     resourceId: id,
    //   },
    // });
    if (currentUser) {
      userVote = await prisma.cheatsheetVote.findUnique({
        where: {
          userId_resourceId: {
            userId: currentUser.id,
            resourceId: id,
          },
        },
      });
    } else {
      userVote = null;
    }
  } else if (category === "Notes") {
    if (currentUser) {
      userVote = await prisma.notesVote.findUnique({
        where: {
          userId_resourceId: {
            userId: currentUser.id,
            resourceId: id,
          },
        },
      });
    } else {
      userVote = null;
    }
  } else if (category === "Past Papers") {
    if (currentUser) {
      userVote = await prisma.questionPaperVote.findUnique({
        where: {
          userId_resourceId: {
            userId: currentUser.id,
            resourceId: id,
          },
        },
      });
    } else {
      userVote = null;
    }
  } else {
    redirect("/404");
  }

  return (
    <div className="flex h-24 w-full flex-row items-center justify-start gap-x-4 rounded-xl border border-slate-800 p-2 hover:bg-slate-200 dark:border-slate-200 dark:hover:bg-slate-800">
      <Rating
        resourceId={id}
        currentUserId={currentUser ? currentUser.id : null}
        category={category}
        totalRating={rating}
        userRating={userVote !== null ? userVote.value : null}
      />
      <PDFSheetLauncher
        title={name}
        currentUserId={currentUser ? currentUser.id : null}
        category={category}
        totalRating={rating}
        userRating={userVote !== null ? userVote.value : null}
        id={id}
      >
        <div className="grid h-full w-full grid-flow-row grid-cols-5 justify-center">
          <div className="col-span-3 row-span-1 flex items-center font-semibold">
            {name}
          </div>
          <div className="col-span-2 row-span-1 flex items-center justify-end">
            {category !== "Notes" ? `${examType}, ` : ""}
            {`${acadYear} S${semester}`}
          </div>
          <div className="col-span-3 row-span-1 flex items-center text-slate-600 dark:text-slate-400">
            {createdAt.toLocaleString("en-GB", {
              minute: "2-digit",
              hour: "numeric",
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>
          <div className="col-span-2 row-span-1 flex items-center justify-end">
            <Link
              href={`#`}
              className="text-slate-600 hover:text-slate-700 hover:underline dark:text-slate-400 dark:hover:text-slate-300"
            >
              {resourceUser?.name}
            </Link>
          </div>
        </div>
      </PDFSheetLauncher>
    </div>
  );
}
