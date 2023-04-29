import { ResourceType } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import PDFSheetLauncher from "@/components/PDFSheetLauncher";
import Rating from "@/components/Rating";
import { CheatsheetVote, QuestionPaperVote, NotesVote } from "@prisma/client";

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
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  let votes: CheatsheetVote[] | NotesVote[] | QuestionPaperVote[];
  let userVote: CheatsheetVote | NotesVote | QuestionPaperVote | null;
  if (category === "Cheatsheets") {
    const votesPromise = prisma.cheatsheetVote.findMany({
      where: {
        resourceId: id,
      },
    });
    const userVotePromise = prisma.cheatsheetVote.findUnique({
      where: {
        userId_resourceId: {
          userId: userId,
          resourceId: id,
        },
      },
    });
    [votes, userVote] = await Promise.all([votesPromise, userVotePromise]);
  } else if (category === "Notes") {
    const votesPromise = prisma.notesVote.findMany({
      where: {
        resourceId: id,
      },
    });
    const userVotePromise = prisma.notesVote.findUnique({
      where: {
        userId_resourceId: {
          userId: userId,
          resourceId: id,
        },
      },
    });
    [votes, userVote] = await Promise.all([votesPromise, userVotePromise]);
  } else if (category === "Past Papers") {
    const votesPromise = prisma.questionPaperVote.findMany({
      where: {
        resourceId: id,
      },
    });
    const userVotePromise = prisma.questionPaperVote.findUnique({
      where: {
        userId_resourceId: {
          userId: userId,
          resourceId: id,
        },
      },
    });
    [votes, userVote] = await Promise.all([votesPromise, userVotePromise]);
  } else {
    redirect("/404");
  }
  const rating = votes.reduce(
    (total, vote) => (vote.value ? total + 1 : total - 1),
    0
  );
  const formatted_rating = Intl.NumberFormat("en-GB", {
    notation: "compact",
  }).format(rating);

  return (
    <tr>
      <td>
        <Rating
          resourceId={id}
          userId={userId}
          totalRating={formatted_rating}
          userRating={userVote ? userVote.value : null}
        />
      </td>
      <td>
        <PDFSheetLauncher id={id}>
          <div className="h-full w-full text-slate-800 hover:underline dark:text-slate-200">
            {name}
          </div>
        </PDFSheetLauncher>
      </td>
      <td>{user?.name}</td>
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
