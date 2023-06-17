import ResourceItem from "@/components/resource/ResourceItem";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import {
  Cheatsheet,
  CheatsheetVote,
  Notes,
  NotesVote,
  QuestionPaper,
  QuestionPaperVote,
} from "@prisma/client";
import { toast } from "react-hot-toast";
import { parse, VisitedElementType } from "@/pages/api/updateVisited";

export default async function VisitedResources({ userId }: { userId: string }) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    redirect("/404");
  }

  const recentResources: VisitedElementType[] = user.visitedData
    ? parse(user.visitedData)
    : [];

  console.log(recentResources);

  return (
    <div className="h-screen w-1/2">
      <h1 className="mt-5 text-xl">Visited resources</h1>
      <div className="flex flex-col justify-center gap-2">
        {recentResources.map(async (visitedData) => {
          let rating: number;
          let difficulty: number | undefined = undefined;
          let difficultyCount: number | undefined = undefined;
          let solutionIncluded: boolean | undefined = undefined;
          let resource:
            | (Cheatsheet & { votes: CheatsheetVote[] })
            | (QuestionPaper & { votes: QuestionPaperVote[] })
            | (Notes & { votes: NotesVote[] })
            // | Solution
            | null = null;

          if (visitedData.category === "Cheatsheets") {
            try {
              resource = await prisma.cheatsheet.findUnique({
                where: {
                  id: visitedData.resourceId,
                },
                include: {
                  votes: true,
                },
              });

              if (!resource) {
                redirect("/404");
              }

              rating = resource.votes.reduce(
                (total: number, vote: CheatsheetVote) =>
                  vote.value ? total + 1 : total - 1,
                0
              );
            } catch {
              toast.error("Failed to fetch resource");
            }
          } else if (visitedData.category === "Past Papers") {
            try {
              // new variable for reliable typing
              const qnpaper = await prisma.questionPaper.findUnique({
                where: {
                  id: visitedData.resourceId,
                },
                include: {
                  votes: true,
                  difficulties: true,
                },
              });

              if (!qnpaper) {
                redirect("/404");
              }

              resource = qnpaper;
              rating = qnpaper.votes.reduce(
                (total: number, vote: QuestionPaperVote) =>
                  vote.value ? total + 1 : total - 1,
                0
              );
              difficultyCount = qnpaper.difficulties.length;
              difficulty =
                qnpaper.difficulties.reduce(
                  (total: number, difficulty) => total + difficulty.value,
                  0
                ) / difficultyCount;
              solutionIncluded = qnpaper.solutionIncluded;
            } catch {
              toast.error("Failed to fetch resource");
            }
          } else if (visitedData.category === "Notes") {
            try {
              resource = await prisma.notes.findUnique({
                where: {
                  id: visitedData.resourceId,
                },
                include: {
                  votes: true,
                },
              });

              if (!resource) {
                redirect("/404");
              }

              rating = resource.votes.reduce(
                (total: number, vote: NotesVote) =>
                  vote.value ? total + 1 : total - 1,
                0
              );
            } catch {
              toast.error("Failed to fetch resource");
            }
          }

          if (!resource) {
            return;
          }

          return (
            // @ts-expect-error Server component
            <ResourceItem
              key={resource.id}
              resourceId={resource.id}
              name={resource.name}
              userId={resource.userId}
              createdAt={resource.createdAt}
              acadYear={resource.acadYear}
              semester={resource.semester}
              rating={rating!}
              difficulty={difficulty}
              difficultyCount={difficultyCount}
              solutionIncluded={solutionIncluded}
              examType={
                // @ts-expect-error wrong type inference
                visitedData.category !== "Notes" ? resource.type : undefined
              }
              category={visitedData.category}
              moduleCode={resource.moduleCode}
              isVisited={true}
            />
          );
        })}
      </div>
    </div>
  );
}
