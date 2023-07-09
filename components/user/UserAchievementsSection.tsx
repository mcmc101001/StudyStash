import { prisma } from "@/lib/prisma";
import { Achievement } from "@/components/user/Achievement";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";

interface UserAchievementsSectionProps {
  userId: string;
}

export async function UserAchievementsSection({
  userId,
}: UserAchievementsSectionProps) {
  const cheatsheetsPromise = prisma.cheatsheet.findMany({
    where: {
      userId: userId,
    },
    include: {
      votes: {
        select: {
          value: true,
        },
      },
    },
  });

  const questionPapersPromise = prisma.questionPaper.findMany({
    where: {
      userId: userId,
    },
    include: {
      votes: {
        select: {
          value: true,
        },
      },
    },
  });

  const notesPromise = prisma.notes.findMany({
    where: {
      userId: userId,
    },
    include: {
      votes: {
        select: {
          value: true,
        },
      },
    },
  });

  const solutionsPromise = prisma.solution.findMany({
    where: {
      userId: userId,
    },
    include: {
      votes: {
        select: {
          value: true,
        },
      },
    },
  });

  const cheatsheetCommentsPromise = prisma.cheatsheetComment.findMany({
    where: {
      userId: userId,
    },
    include: {
      votes: {
        select: {
          value: true,
        },
      },
    },
  });

  const questionPaperCommentsPromise = prisma.questionPaperComment.findMany({
    where: {
      userId: userId,
      isDeleted: false,
    },
    include: {
      votes: {
        select: {
          value: true,
        },
      },
    },
  });

  const notesCommentsPromise = prisma.notesComment.findMany({
    where: {
      userId: userId,
      isDeleted: false,
    },
    include: {
      votes: {
        select: {
          value: true,
        },
      },
    },
  });

  const solutionCommentsPromise = prisma.solutionComment.findMany({
    where: {
      userId: userId,
      isDeleted: false,
    },
    include: {
      votes: {
        select: {
          value: true,
        },
      },
    },
  });

  const cheatsheetRepliesPromise = prisma.cheatsheetReply.findMany({
    where: {
      userId: userId,
      isDeleted: false,
    },
    include: {
      votes: {
        select: {
          value: true,
        },
      },
    },
  });

  const questionPaperRepliesPromise = prisma.questionPaperReply.findMany({
    where: {
      userId: userId,
      isDeleted: false,
    },
    include: {
      votes: {
        select: {
          value: true,
        },
      },
    },
  });

  const notesRepliesPromise = prisma.notesReply.findMany({
    where: {
      userId: userId,
      isDeleted: false,
    },
    include: {
      votes: {
        select: {
          value: true,
        },
      },
    },
  });

  const solutionRepliesPromise = prisma.solutionReply.findMany({
    where: {
      userId: userId,
      isDeleted: false,
    },
    include: {
      votes: {
        select: {
          value: true,
        },
      },
    },
  });

  const [
    cheatsheets,
    questionPapers,
    notes,
    solutions,
    cheatsheetComments,
    questionPaperComments,
    notesComments,
    solutionComments,
    cheatsheetReplies,
    questionPaperReplies,
    notesReplies,
    solutionReplies,
  ] = await Promise.all([
    cheatsheetsPromise,
    questionPapersPromise,
    notesPromise,
    solutionsPromise,
    cheatsheetCommentsPromise,
    questionPaperCommentsPromise,
    notesCommentsPromise,
    solutionCommentsPromise,
    cheatsheetRepliesPromise,
    questionPaperRepliesPromise,
    notesRepliesPromise,
    solutionRepliesPromise,
  ]);

  // Resource count
  const resourcesUploaded =
    cheatsheets.length +
    questionPapers.length +
    notes.length +
    solutions.length;

  // Resource votes
  let upvotes = 0;
  let downvotes = 0;
  const addKarma = (vote: { value: boolean }) =>
    vote.value ? upvotes++ : downvotes++;

  for (const cheatsheet of cheatsheets) {
    cheatsheet.votes.forEach(addKarma);
  }
  for (const questionPaper of questionPapers) {
    questionPaper.votes.forEach(addKarma);
  }
  for (const note of notes) {
    note.votes.forEach(addKarma);
  }
  for (const solution of solutions) {
    solution.votes.forEach(addKarma);
  }

  const resourceUpvotesPercentage =
    upvotes + downvotes
      ? (
          Math.round((upvotes / (upvotes + downvotes)) * 10000) / 100
        ).toString() + "%"
      : "-";

  // Comment count
  const commentsPosted =
    cheatsheetComments.length +
    questionPaperComments.length +
    notesComments.length +
    solutionComments.length +
    cheatsheetReplies.length +
    questionPaperReplies.length +
    notesReplies.length +
    solutionReplies.length;

  // Comment votes
  let commentUpvotes = 0;
  let commentDownvotes = 0;
  const addCommentKarma = (vote: { value: boolean }) =>
    vote.value ? commentUpvotes++ : commentDownvotes++;

  for (const qnpaperComment of questionPaperComments) {
    qnpaperComment.votes.forEach(addCommentKarma);
  }
  for (const cheatsheetComment of cheatsheetComments) {
    cheatsheetComment.votes.forEach(addCommentKarma);
  }
  for (const noteComment of notesComments) {
    noteComment.votes.forEach(addCommentKarma);
  }
  for (const solutionComment of solutionComments) {
    solutionComment.votes.forEach(addCommentKarma);
  }
  for (const qnpaperComment of cheatsheetReplies) {
    qnpaperComment.votes.forEach(addCommentKarma);
  }
  for (const cheatsheetComment of questionPaperReplies) {
    cheatsheetComment.votes.forEach(addCommentKarma);
  }
  for (const noteComment of notesReplies) {
    noteComment.votes.forEach(addCommentKarma);
  }
  for (const solutionComment of solutionReplies) {
    solutionComment.votes.forEach(addCommentKarma);
  }
  const commentUpvotesPercentage =
    commentUpvotes + commentDownvotes
      ? (
          Math.round(
            (commentUpvotes / (commentUpvotes + commentDownvotes)) * 10000
          ) / 100
        ).toString() + "%"
      : "-";

  return (
    <div className="flex w-full flex-col justify-evenly overflow-hidden rounded-2xl bg-slate-300 text-center text-xl dark:bg-slate-700">
      <div className="flex w-full items-center justify-evenly">
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger className="cursor-default">
              <Achievement
                description="Resources uploaded"
                value={resourcesUploaded}
                icon={"Files"}
              />
            </TooltipTrigger>
            <TooltipContent side="top">
              Cheatsheets: {cheatsheets.length}
              <br />
              Past papers: {questionPapers.length}
              <br />
              Notes: {notes.length}
              <br />
              Solutions: {solutions.length}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger className="cursor-default">
              <Achievement
                description="Total resource rating"
                value={upvotes - downvotes}
                icon={"FilePlus"}
              />
            </TooltipTrigger>
            <TooltipContent side="top">
              Upvote percentage:
              <br />
              {resourceUpvotesPercentage}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex w-full items-center justify-evenly">
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger className="cursor-default">
              <Achievement
                description="Comments posted"
                value={commentsPosted}
                icon={"MessageSquare"}
              />
            </TooltipTrigger>
            <TooltipContent side="top">
              Cheatsheets comments:{" "}
              {cheatsheetComments.length + cheatsheetReplies.length}
              <br />
              Past papers comments:{" "}
              {questionPaperComments.length + questionPaperReplies.length}
              <br />
              Notes comments: {notesComments.length + notesReplies.length}
              <br />
              Solutions comments:{" "}
              {solutionComments.length + solutionReplies.length}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger className="cursor-default">
              <Achievement
                description="Total comment rating"
                value={commentUpvotes - commentDownvotes}
                icon={"MessageSquarePlus"}
              />
            </TooltipTrigger>
            <TooltipContent side="top">
              Upvote percentage:
              <br />
              {commentUpvotesPercentage}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
