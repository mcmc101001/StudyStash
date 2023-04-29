import { ResourceType } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import PDFSheetLauncher from "@/components/PDFSheetLauncher";
import Rating from "@/components/Rating";
import { CheatsheetVote, QuestionPaperVote, NotesVote } from "@prisma/client";
import { getCurrentUser } from "@/lib/session";

interface ResourceItemProps {
  name: string;
  id: string;
  userId: string;
  createdAt: Date;
  acadYear: string;
  semester: string;
  category: ResourceType;
  examType?: string;
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
    const votesPromise = prisma.cheatsheetVote.findMany({
      where: {
        resourceId: id,
      },
    });
    if (currentUser) {
      const userVotePromise = prisma.cheatsheetVote.findUnique({
        where: {
          userId_resourceId: {
            userId: currentUser.id,
            resourceId: id,
          },
        },
      });
      [votes, userVote] = await Promise.all([votesPromise, userVotePromise]);
    } else {
      votes = await votesPromise;
      userVote = null;
    }
  } else if (category === "Notes") {
    const votesPromise = prisma.notesVote.findMany({
      where: {
        resourceId: id,
      },
    });
    if (currentUser) {
      const userVotePromise = prisma.notesVote.findUnique({
        where: {
          userId_resourceId: {
            userId: currentUser.id,
            resourceId: id,
          },
        },
      });
      [votes, userVote] = await Promise.all([votesPromise, userVotePromise]);
    } else {
      votes = await votesPromise;
      userVote = null;
    }
  } else if (category === "Past Papers") {
    const votesPromise = prisma.questionPaperVote.findMany({
      where: {
        resourceId: id,
      },
    });
    if (currentUser) {
      const userVotePromise = prisma.questionPaperVote.findUnique({
        where: {
          userId_resourceId: {
            userId: currentUser.id,
            resourceId: id,
          },
        },
      });
      [votes, userVote] = await Promise.all([votesPromise, userVotePromise]);
    } else {
      votes = await votesPromise;
      userVote = null;
    }
  } else {
    redirect("/404");
  }
  const rating = votes.reduce(
    (total, vote) => (vote.value ? total + 1 : total - 1),
    0
  );

  return (
    <tr>
      <td>
        <Rating
          resourceId={id}
          currentUserId={currentUser ? currentUser.id : null}
          category={category}
          totalRating={rating}
          userRating={userVote !== null ? userVote.value : null}
        />
      </td>
      <td>
        <PDFSheetLauncher id={id}>
          <div className="h-full w-full text-slate-800 hover:underline dark:text-slate-200">
            {name}
          </div>
        </PDFSheetLauncher>
      </td>
      <td>{resourceUser?.name}</td>
      <td>
        {createdAt.toLocaleString("en-GB", {
          minute: "2-digit",
          hour: "numeric",
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </td>
      <td>{`${acadYear} S${semester}`}</td>
      {category !== "Notes" ? <td>{examType}</td> : <></>}
    </tr>
  );
}
