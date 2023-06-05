import SolutionItem from "@/components/SolutionItem";
import SolutionSort from "@/components/SolutionSort";
import { ResourceFiltersSorts, ResourceTypeURL } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { ExamType, Prisma, SolutionVote } from "@prisma/client";
import { redirect } from "next/navigation";

function getSolutionRating(resources: SolutionsWithPosts) {
  const new_resources = resources.map((resource) => {
    const rating = resource.votes.reduce(
      (total: number, vote: SolutionVote) =>
        vote.value ? total + 1 : total - 1,
      0
    );
    return {
      ...resource,
      rating: rating,
    };
  });
  return new_resources;
}

export async function getSolutionsWithPosts({
  userId,
  questionPaperId,
  moduleCode,
  FilterSemester,
  FilterAcadYear,
  FilterExamType,
}: {
  userId: string | undefined;
  questionPaperId: string | undefined;
  moduleCode: string | undefined;
  FilterSemester: string | undefined;
  FilterAcadYear: string | undefined;
  FilterExamType: ExamType | undefined;
}) {
  try {
    const resource = await prisma.solution.findMany({
      where: {
        questionPaper: {
          ...(moduleCode ? { moduleCode: moduleCode } : {}),
          ...(FilterSemester ? { semester: FilterSemester } : {}),
          ...(FilterAcadYear ? { acadYear: FilterAcadYear } : {}),
          ...(FilterExamType ? { type: FilterExamType } : {}),
        },
        ...(userId ? { userId: userId } : {}),
        ...(questionPaperId ? { questionPaperId: questionPaperId } : {}),
      },
      include: {
        votes: true,
        questionPaper: true,
      },
    });
    return resource;
  } catch (error) {
    return [];
  }
}

export type SolutionsWithPosts = Prisma.PromiseReturnType<
  typeof getSolutionsWithPosts
>;

export default async function SolutionPage({
  params: { resourceId, categoryURL },
  searchParams,
}: {
  params: { resourceId: string; categoryURL: ResourceTypeURL };
  searchParams: ResourceFiltersSorts;
}) {
  if (categoryURL !== "past_papers") {
    redirect("/404");
  }

  const Sort = searchParams.sort;

  const solutions = await getSolutionsWithPosts({
    userId: undefined,
    questionPaperId: resourceId,
    moduleCode: undefined,
    FilterSemester: undefined,
    FilterAcadYear: undefined,
    FilterExamType: undefined,
  });

  let sortedSolutions = getSolutionRating(solutions);

  /************** SORTING **************/
  if (Sort === "rating") {
    sortedSolutions.sort((a, b) => {
      return b.rating - a.rating;
    });
  } else if (Sort === "rating_flip") {
    sortedSolutions.sort((a, b) => {
      return a.rating - b.rating;
    });
  } else if (Sort === "date") {
    sortedSolutions.sort((a, b) => {
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  } else if (Sort === "date_flip") {
    sortedSolutions.sort((a, b) => {
      return a.createdAt.getTime() - b.createdAt.getTime();
    });
  }

  return (
    <>
      <div className="mb-3 w-64">
        <SolutionSort />
      </div>
      {sortedSolutions.length !== 0 ? (
        <div
          className="flex max-h-[70vh] w-full flex-col gap-y-6 overflow-y-scroll scroll-smooth pr-3 text-slate-800 scrollbar-thin
          scrollbar-track-transparent scrollbar-thumb-slate-200 hover:scrollbar-thumb-slate-300 
          dark:text-slate-200 dark:scrollbar-thumb-slate-800 dark:hover:scrollbar-thumb-slate-700"
          style={{ scrollbarGutter: "stable" }}
        >
          {sortedSolutions.map((solution) => {
            return (
              // @ts-expect-error Server component
              <SolutionItem
                key={solution.id}
                questionPaperId={resourceId}
                solutionId={solution.id}
                name={solution.name}
                userId={solution.userId}
                createdAt={solution.createdAt}
                rating={solution.rating}
              />
            );
          })}
        </div>
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-y-6 pb-10 text-2xl">
          <h1 className="text-slate-800 dark:text-slate-200">
            No resources found
          </h1>
        </div>
      )}
    </>
  );
}
