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
  const cheatsheets = await prisma.cheatsheet.findMany({
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

  const questionPapers = await prisma.questionPaper.findMany({
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

  const notes = await prisma.notes.findMany({
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

  const solutions = await prisma.solution.findMany({
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

  const qnpaperComments = await prisma.questionPaperComment.findMany({
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

  const cheatsheetComments = await prisma.cheatsheetComment.findMany({
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

  const noteComments = await prisma.notesComment.findMany({
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

  const solutionComments = await prisma.solutionComment.findMany({
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

  // Comment count
  const commentsUploaded =
    qnpaperComments.length +
    cheatsheetComments.length +
    noteComments.length +
    solutionComments.length;

  // Comment votes
  let commentUpvotes = 0;
  let commentDownvotes = 0;
  const addCommentKarma = (vote: { value: boolean }) =>
    vote.value ? commentUpvotes++ : commentDownvotes++;

  for (const qnpaperComment of qnpaperComments) {
    qnpaperComment.votes.forEach(addCommentKarma);
  }
  for (const cheatsheetComment of cheatsheetComments) {
    cheatsheetComment.votes.forEach(addCommentKarma);
  }
  for (const noteComment of noteComments) {
    noteComment.votes.forEach(addCommentKarma);
  }
  for (const solutionComment of solutionComments) {
    solutionComment.votes.forEach(addCommentKarma);
  }

  return (
    <div className="rounded-2xl bg-slate-300 p-4 text-center text-xl dark:bg-slate-700">
      <div className="flex items-center justify-center gap-x-5 pb-5">
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger>
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
            <TooltipTrigger>
              <Achievement
                description="Total resource rating"
                value={upvotes - downvotes}
                icon={"FileUp"}
              />
            </TooltipTrigger>
            <TooltipContent side="top">
              Upvote percentage:
              <br />
              {Math.round((upvotes / (upvotes + downvotes)) * 10000) / 100}%
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex items-center justify-center gap-x-5 ">
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger>
              <Achievement
                description="Comments uploaded"
                value={commentsUploaded}
                icon={"MessageSquare"}
              />
            </TooltipTrigger>
            <TooltipContent side="top">
              Cheatsheets comments: {cheatsheetComments.length}
              <br />
              Past papers comments: {qnpaperComments.length}
              <br />
              Notes comments: {noteComments.length}
              <br />
              Solutions comments: {solutionComments.length}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger>
              <Achievement
                description="Total resource rating"
                value={commentUpvotes - commentDownvotes}
                icon={"MessageSquarePlus"}
              />
            </TooltipTrigger>
            <TooltipContent side="top">
              Upvote percentage:
              <br />
              {Math.round(
                (commentUpvotes / (commentUpvotes + commentDownvotes)) * 10000
              ) / 100}
              %
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
