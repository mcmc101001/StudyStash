import AddCommentSection from "@/components/AddCommentSection";
import { ResourceType, ResourceTypeURL } from "@/lib/content";
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

export default async function SolutionCommentsPage({
  params: { resourceId, categoryURL },
}: {
  params: { resourceId: string; categoryURL: ResourceTypeURL };
}) {
  const user = await getCurrentUser();
  let currentUser: User | null = null;
  if (user) {
    currentUser = await prisma.user.findUnique({
      where: {
        id: user?.id,
      },
    });
  }

  let category: ResourceType;
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

  if (categoryURL === "cheatsheets") {
    category = "Cheatsheets";
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
  } else if (categoryURL === "past_papers") {
    category = "Past Papers";
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
  } else if (categoryURL === "notes") {
    category = "Notes";
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
    <div className="h-[75vh] w-full overflow-y-auto p-2">
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
              <li>
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
