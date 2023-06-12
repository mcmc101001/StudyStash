import AddCommentSection from "@/components/AddCommentSection";
import { ResourceSolutionType } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import {
  CheatsheetComment,
  CheatsheetReply,
  NotesComment,
  NotesReply,
  QuestionPaperComment,
  QuestionPaperReply,
  User,
} from "@prisma/client";
import { getCurrentUser } from "@/lib/session";
import CommentItem from "@/components/CommentItem";

interface CommentsSectionProps {
  resourceId: string;
  category: ResourceSolutionType;
}

export default async function CommentsSection({
  resourceId,
  category,
}: CommentsSectionProps) {
  const user = await getCurrentUser();
  let currentUser: User | null = null;
  if (user) {
    currentUser = await prisma.user.findUnique({
      where: {
        id: user?.id,
      },
    });
  }

  let comments:
    | (CheatsheetComment & {
        user: User;
        replies: (CheatsheetReply & {
          user: User;
        })[];
      })[]
    | (QuestionPaperComment & {
        replies: (QuestionPaperReply & {
          user: User;
        })[];
        user: User;
      })[]
    | (NotesComment & {
        replies: (NotesReply & {
          user: User;
        })[];
        user: User;
      })[] = [];

  if (category === "Cheatsheets") {
    comments = await prisma.cheatsheetComment.findMany({
      where: {
        resourceId: resourceId,
      },
      include: {
        replies: {
          include: {
            user: true,
          },
        },
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } else if (category === "Past Papers") {
    comments = await prisma.questionPaperComment.findMany({
      where: {
        resourceId: resourceId,
      },
      include: {
        replies: {
          include: {
            user: true,
          },
        },
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } else if (category === "Notes") {
    comments = await prisma.notesComment.findMany({
      where: {
        resourceId: resourceId,
      },
      include: {
        replies: {
          include: {
            user: true,
          },
        },
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } else {
    redirect("/404");
  }

  return (
    <div
      className="h-[75vh] w-full overflow-y-auto p-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-200 
          hover:scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-800 dark:hover:scrollbar-thumb-slate-700"
      style={{ scrollbarGutter: "stable" }}
    >
      <h1 className="mb-2 text-4xl font-bold text-slate-800 dark:text-slate-200">
        {`Comments (${comments.length})`}
      </h1>
      <AddCommentSection
        category={category}
        resourceId={resourceId}
        currentUserId={currentUser?.id}
      />
      <div className="mt-4 w-full">
        <ul className="flex flex-col gap-y-2">
          {comments.map((comment) => {
            return (
              <li key={comment.id}>
                <CommentItem
                  category={category}
                  currentUser={currentUser}
                  comment={comment}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
``;
