import { prisma } from "@/lib/prisma";
import { Achievement } from "@/components/user/Achievement";

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
    cheatsheetComment,
    questionPaperComment,
    notesComment,
    solutionComments,
    cheatsheetReplies,
    questionPaperReplies,
    notesReplies,
    solutionCReplies,
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

  let resourcesKarma = 0;
  let commentsKarma = 0;

  for (const cheatsheet of cheatsheets) {
    resourcesKarma += cheatsheet.votes.length;
  }
  for (const questionPaper of questionPapers) {
    resourcesKarma += questionPaper.votes.length;
  }
  for (const note of notes) {
    resourcesKarma += note.votes.length;
  }
  for (const solution of solutions) {
    resourcesKarma += solution.votes.length;
  }

  for (const comment of cheatsheetComment) {
    commentsKarma += comment.votes.length;
  }
  for (const comment of questionPaperComment) {
    commentsKarma += comment.votes.length;
  }
  for (const comment of notesComment) {
    commentsKarma += comment.votes.length;
  }
  for (const comment of solutionComments) {
    commentsKarma += comment.votes.length;
  }
  for (const reply of cheatsheetReplies) {
    commentsKarma += reply.votes.length;
  }
  for (const reply of questionPaperReplies) {
    commentsKarma += reply.votes.length;
  }
  for (const reply of notesReplies) {
    commentsKarma += reply.votes.length;
  }
  for (const reply of solutionCReplies) {
    commentsKarma += reply.votes.length;
  }

  const resourcesUploaded =
    cheatsheets.length +
    questionPapers.length +
    notes.length +
    solutions.length;

  const commentsPosted =
    cheatsheetComment.length +
    questionPaperComment.length +
    notesComment.length +
    solutionComments.length +
    cheatsheetReplies.length +
    questionPaperReplies.length +
    notesReplies.length +
    solutionCReplies.length;

  return (
    <div className="flex w-full flex-col items-center justify-center gap-y-6 overflow-hidden rounded-xl bg-slate-300 p-6 px-10 text-center text-xl dark:bg-slate-700">
      <div className="flex w-full items-center justify-between">
        <Achievement
          description="Resources uploaded"
          value={resourcesUploaded}
          icon={"Files"}
        />
        <Achievement
          description="Total resource rating"
          value={resourcesKarma}
          icon={"Star"}
        />
      </div>
      <div className="flex w-full items-center justify-between">
        <Achievement
          description="Comments made"
          value={commentsPosted}
          icon={"MessageCircle"}
        />
        <Achievement
          description="Total comments rating"
          value={commentsKarma}
          icon={"ThumbsUp"}
        />
      </div>
    </div>
  );
}
