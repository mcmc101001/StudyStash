import AddCommentSection from "@/components/comments/AddCommentSection";
import { ResourceSolutionType } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import {
  CheatsheetComment,
  CheatsheetCommentVote,
  CheatsheetReply,
  CheatsheetReplyVote,
  NotesComment,
  NotesCommentVote,
  NotesReply,
  NotesReplyVote,
  QuestionPaperComment,
  QuestionPaperCommentVote,
  QuestionPaperReply,
  QuestionPaperReplyVote,
  SolutionComment,
  SolutionCommentVote,
  SolutionReply,
  SolutionReplyVote,
  User,
} from "@prisma/client";
import { getCurrentUser } from "@/lib/session";
import { cn } from "@/lib/utils";
import CommentsSorter from "@/components/comments/CommentsSorter";

export interface CommentsSectionProps
  extends React.HTMLAttributes<HTMLDivElement> {
  resourceId: string;
  category: ResourceSolutionType;
  label?: string;
}

export default async function CommentsSection({
  className,
  resourceId,
  category,
  label,
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
        replies: (CheatsheetReply & {
          user: User;
          votes: CheatsheetReplyVote[];
        })[];
        user: User;
        votes: CheatsheetCommentVote[];
      })[]
    | (QuestionPaperComment & {
        replies: (QuestionPaperReply & {
          user: User;
          votes: QuestionPaperReplyVote[];
        })[];
        user: User;
        votes: QuestionPaperCommentVote[];
      })[]
    | (NotesComment & {
        replies: (NotesReply & {
          user: User;
          votes: NotesReplyVote[];
        })[];
        user: User;
        votes: NotesCommentVote[];
      })[]
    | (SolutionComment & {
        replies: (SolutionReply & {
          user: User;
          votes: SolutionReplyVote[];
        })[];
        user: User;
        votes: SolutionCommentVote[];
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
            votes: true,
          },
        },
        user: true,
        votes: true,
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
            votes: true,
          },
        },
        user: true,
        votes: true,
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
            votes: true,
          },
        },
        user: true,
        votes: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } else if (category === "Solutions") {
    comments = await prisma.solutionComment.findMany({
      where: {
        resourceId: resourceId,
      },
      include: {
        replies: {
          include: {
            user: true,
            votes: true,
          },
        },
        user: true,
        votes: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } else {
    redirect("/404");
  }

  const commentsWithRating = comments.map((comment) => {
    const commentRating = comment.votes.reduce(
      (total: number, vote: SolutionCommentVote) =>
        vote.value ? total + 1 : total - 1,
      0
    );
    const userCommentRating = comment.votes.find(
      (vote) => vote.userId === currentUser?.id
    );
    const repliesWithRating = comment.replies.map((reply) => {
      const replyRating = reply.votes.reduce(
        (total: number, vote: SolutionReplyVote) =>
          vote.value ? total + 1 : total - 1,
        0
      );
      const userReplyRating = reply.votes.find(
        (vote) => vote.userId === currentUser?.id
      );
      return {
        ...reply,
        rating: replyRating,
        userRating: userReplyRating?.value ?? null,
      };
    });
    return {
      ...comment,
      replies: repliesWithRating,
      rating: commentRating,
      userRating: userCommentRating?.value ?? null,
    };
  });

  return (
    <div className="pr-2">
      <div
        className={cn(
          `w-full overflow-y-auto overflow-x-hidden px-5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-200 scrollbar-thumb-rounded-md
        hover:scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-800 dark:hover:scrollbar-thumb-slate-700`,
          className
        )}
        style={{ scrollbarGutter: "stable" }}
      >
        {label && (
          <h1 className="mb-4 text-xl font-bold text-slate-800 dark:text-slate-200">
            {`${label} (${
              commentsWithRating.filter((comment) => !comment.isDeleted).length
            })`}
          </h1>
        )}
        <AddCommentSection
          category={category}
          resourceId={resourceId}
          currentUserId={currentUser?.id}
        />
        <div className="mt-4 w-full">
          <CommentsSorter
            category={category}
            currentUser={currentUser}
            comments={commentsWithRating}
          />
        </div>
      </div>
    </div>
  );
}
