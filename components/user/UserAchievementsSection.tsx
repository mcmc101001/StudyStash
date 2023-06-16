import { prisma } from "@/lib/prisma";
import { Achievement } from "@/components/user/Achievement";

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

  let resourcesKarma = 0;

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

  const resourcesUploaded =
    cheatsheets.length +
    questionPapers.length +
    notes.length +
    solutions.length;

  return (
    <div className="flex items-center justify-center gap-x-5 bg-slate-400 p-4 text-center text-xl dark:bg-slate-600">
      <Achievement
        description="Resources uploaded"
        value={resourcesUploaded}
        icon={"Files"}
      />
      <Achievement
        description="Total resource rating"
        value={resourcesKarma}
        icon={"FileUp"}
      />
    </div>
  );
}
