import {
  ResourceFiltersSorts,
  ResourceType,
  ResourceTypeURL,
} from "@/lib/content";
import { redirect } from "next/navigation";
import ResourceItem from "@/components/ResourceItem";
import { getAcadYearOptions } from "@/lib/nusmods";
import ResourceFilters from "@/components/ResourceFilters";
import { ExamType, NotesVote, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export function getRating(
  resources: CheatsheetWithPosts | QuestionPaperWithPosts | NotesWithPosts
) {
  const new_resources = resources.map((resource) => {
    const rating = resource.votes.reduce(
      (total: number, vote: NotesVote) => (vote.value ? total + 1 : total - 1),
      0
    );
    return {
      ...resource,
      rating: rating,
    };
  });
  return new_resources;
}

export async function getCheatsheetsWithPosts({
  moduleCode,
  FilterSemester,
  FilterAcadYear,
  FilterExamType,
  userId,
}: {
  moduleCode: string | undefined;
  FilterSemester: string | undefined;
  FilterAcadYear: string | undefined;
  FilterExamType: ExamType | undefined;
  userId: string | undefined;
}) {
  try {
    const resource = await prisma.cheatsheet.findMany({
      where: {
        ...(moduleCode ? { moduleCode: moduleCode } : {}),
        ...(FilterSemester ? { semester: FilterSemester } : {}),
        ...(FilterAcadYear ? { acadYear: FilterAcadYear } : {}),
        ...(FilterExamType ? { type: FilterExamType } : {}),
        ...(userId ? { userId: userId } : {}),
      },
      include: {
        votes: true,
      },
    });
    return resource;
  } catch (error) {
    return [];
  }
}

export async function getQuestionPapersWithPosts({
  moduleCode,
  FilterSemester,
  FilterAcadYear,
  FilterExamType,
  userId,
}: {
  moduleCode: string | undefined;
  FilterSemester: string | undefined;
  FilterAcadYear: string | undefined;
  FilterExamType: ExamType | undefined;
  userId: string | undefined;
}) {
  try {
    const resource = await prisma.questionPaper.findMany({
      where: {
        ...(moduleCode ? { moduleCode: moduleCode } : {}),
        ...(FilterSemester ? { semester: FilterSemester } : {}),
        ...(FilterAcadYear ? { acadYear: FilterAcadYear } : {}),
        ...(FilterExamType ? { type: FilterExamType } : {}),
        ...(userId ? { userId: userId } : {}),
      },
      include: {
        votes: true,
        _count: {
          select: { difficulties: true },
        },
      },
    });
    return resource;
  } catch (error) {
    return [];
  }
}

export async function getNotesWithPosts({
  moduleCode,
  FilterSemester,
  FilterAcadYear,
  FilterExamType,
  userId,
}: {
  moduleCode: string | undefined;
  FilterSemester: string | undefined;
  FilterAcadYear: string | undefined;
  FilterExamType: ExamType | undefined;
  userId: string | undefined;
}) {
  try {
    const resource = await prisma.notes.findMany({
      where: {
        ...(moduleCode ? { moduleCode: moduleCode } : {}),
        ...(FilterSemester ? { semester: FilterSemester } : {}),
        ...(FilterAcadYear ? { acadYear: FilterAcadYear } : {}),
        ...(FilterExamType ? { type: FilterExamType } : {}),
        ...(userId ? { userId: userId } : {}),
      },
      include: {
        votes: true,
      },
    });
    return resource;
  } catch (error) {
    return [];
  }
}

export type CheatsheetWithPosts = Prisma.PromiseReturnType<
  typeof getCheatsheetsWithPosts
>;

export type QuestionPaperWithPosts = Prisma.PromiseReturnType<
  typeof getQuestionPapersWithPosts
>;

export type NotesWithPosts = Prisma.PromiseReturnType<typeof getNotesWithPosts>;

export default async function Page({
  params,
  searchParams,
}: {
  params: { moduleCode: string; category: ResourceTypeURL };
  searchParams: ResourceFiltersSorts;
}) {
  /************  FETCH OPTIONS FOR SELECT ************/
  const acadYearOptions = getAcadYearOptions();

  /************  DATA FETCHING ************/
  const FilterSemester = searchParams.filterSemester;
  const FilterAcadYear = searchParams.filterAcadYear;
  const FilterExamType = searchParams.filterExamType;
  const Sort = searchParams.sort;
  let parsedResources:
    | CheatsheetWithPosts
    | QuestionPaperWithPosts
    | NotesWithPosts;
  let category: ResourceType;
  if (params.category === "cheatsheets") {
    category = "Cheatsheets";
    parsedResources = await getCheatsheetsWithPosts({
      moduleCode: params.moduleCode,
      FilterSemester,
      FilterAcadYear,
      FilterExamType,
      userId: undefined,
    });
  } else if (params.category === "notes") {
    category = "Notes";
    parsedResources = await getNotesWithPosts({
      moduleCode: params.moduleCode,
      FilterSemester,
      FilterAcadYear,
      FilterExamType,
      userId: undefined,
    });
  } else if (params.category === "past_papers") {
    category = "Past Papers";
    parsedResources = await getQuestionPapersWithPosts({
      moduleCode: params.moduleCode,
      FilterSemester,
      FilterAcadYear,
      FilterExamType,
      userId: undefined,
    });
  } else {
    redirect("/404");
  }

  let sortedResources = getRating(parsedResources);

  /************** SORTING **************/
  if (Sort === "rating") {
    sortedResources.sort((a, b) => {
      return b.rating - a.rating;
    });
  } else if (Sort === "rating_flip") {
    sortedResources.sort((a, b) => {
      return a.rating - b.rating;
    });
  } else if (Sort === "date") {
    sortedResources.sort((a, b) => {
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  } else if (Sort === "date_flip") {
    sortedResources.sort((a, b) => {
      return a.createdAt.getTime() - b.createdAt.getTime();
    });
  }

  return (
    <div className="flex h-[70vh] flex-row justify-between gap-x-4 text-slate-800 dark:text-slate-200">
      {sortedResources.length !== 0 ? (
        <div
          className="flex w-4/5 flex-col gap-y-6 overflow-y-auto scroll-smooth pr-5 
          scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-200 
          hover:scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-800 dark:hover:scrollbar-thumb-slate-700"
          style={{ scrollbarGutter: "stable" }}
        >
          {sortedResources.map((resource) => {
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
                rating={resource.rating}
                difficultyCount={
                  category === "Past Papers"
                    ? // @ts-expect-error wrong type inference
                      resource._count.difficulties
                    : null
                }
                // @ts-expect-error wrong type inference
                examType={category !== "Notes" ? resource.type : null}
                category={category}
              />
            );
          })}
        </div>
      ) : (
        <div className="flex h-full w-4/5 flex-col items-center justify-center gap-y-6 pt-10 text-2xl">
          <h1 className="text-slate-800 dark:text-slate-200">
            No resources found
          </h1>
        </div>
      )}
      <div className="w-1/5">
        <ResourceFilters
          acadYearOptions={acadYearOptions}
          category={category}
          urlParams={params}
        />
      </div>
    </div>
  );
}
