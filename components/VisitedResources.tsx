import ResourceItem from "@/components/ResourceItem";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import {
  Cheatsheet,
  CheatsheetVote,
  Notes,
  NotesVote,
  QuestionPaper,
  QuestionPaperVote,
  Solution,
} from "@prisma/client";
import { ResourceSolutionType } from "@/lib/content";
import { toast } from "react-hot-toast";

interface visitedElementType {
  resourceId: string;
  category: ResourceSolutionType;
}

const parse = (str: string): visitedElementType[] => {
  let array: visitedElementType[] = [];
  while (str.indexOf("$") !== -1) {
    let index = str.indexOf("|");
    array.push({
      resourceId: str.substring(0, index),
      category: str.slice(index + 1, str.indexOf("$")) as ResourceSolutionType,
    });
    str = str.slice(str.indexOf("$") + 1);
  }
  return array;
};

export default async function VisitedResources({ userId }: { userId: string }) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    redirect("/404");
  }

  const recentResources = user.visitedData ? parse(user.visitedData) : [];

  console.log(recentResources);

  return (
    <div className="h-screen w-1/2">
      <h1 className="mt-5 text-xl">Visited resources</h1>
      <div className="flex flex-col justify-center gap-2">
        {recentResources.map(async (visitedData) => {
          let resource:
            | (Cheatsheet & { votes: CheatsheetVote[] })
            | (QuestionPaper & { votes: QuestionPaperVote[] })
            | (Notes & { votes: NotesVote[] })
            // | Solution
            | null = null;
          let rating: number;
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
              resource = await prisma.questionPaper.findUnique({
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
                (total: number, vote: QuestionPaperVote) =>
                  vote.value ? total + 1 : total - 1,
                0
              );
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
            // } else if (visitedData.category === "Solutions") {
            //   try {
            //     resource = await prisma.solution.findUnique({
            //       where: {
            //         id: visitedData.resourceId,
            //       },
            //     });
            //   } catch {
            //     toast.error("Failed to fetch resource");
            //   }
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
              difficulty={2}
              difficultyCount={2}
              solutionIncluded={false}
              examType={
                // @ts-expect-error wrong type inference
                visitedData.category !== "Notes" ? resource.type : undefined
              }
              category={visitedData.category}
            />
          );
        })}
      </div>
    </div>
  );
}
