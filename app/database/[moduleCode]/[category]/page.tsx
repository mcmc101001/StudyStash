import {
  ResourceFiltersSorts,
  ResourceType,
  ResourceTypeURL,
} from "@/lib/content";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ResourceItem from "@/components/ResourceItem";
import { getAcadYearOptions } from "@/lib/nusmods";
import ResourceFilters from "@/components/ResourceFilters";
import { ExamType, NotesVote, Prisma } from "@prisma/client";

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

async function getCheatsheetsWithPosts(
  moduleCode: string,
  FilterSemester: string | null,
  FilterAcadYear: string | null,
  FilterExamType: ExamType | null
) {
  const resource = await prisma.cheatsheet.findMany({
    where: {
      moduleCode: moduleCode,
      ...(FilterSemester ? { semester: FilterSemester } : {}),
      ...(FilterAcadYear ? { acadYear: FilterAcadYear } : {}),
      ...(FilterExamType ? { type: FilterExamType } : {}),
    },
    include: {
      votes: true,
    },
  });
  return resource;
}

async function getQuestionPapersWithPosts(
  moduleCode: string,
  FilterSemester: string | null,
  FilterAcadYear: string | null,
  FilterExamType: ExamType | null
) {
  const resource = await prisma.questionPaper.findMany({
    where: {
      moduleCode: moduleCode,
      ...(FilterSemester ? { semester: FilterSemester } : {}),
      ...(FilterAcadYear ? { acadYear: FilterAcadYear } : {}),
      ...(FilterExamType ? { type: FilterExamType } : {}),
    },
    include: {
      votes: true,
    },
  });
  return resource;
}

async function getNotesWithPosts(
  moduleCode: string,
  FilterSemester: string | null,
  FilterAcadYear: string | null,
  FilterExamType: ExamType | null
) {
  const resource = await prisma.notes.findMany({
    where: {
      moduleCode: moduleCode,
      ...(FilterSemester ? { semester: FilterSemester } : {}),
      ...(FilterAcadYear ? { acadYear: FilterAcadYear } : {}),
      ...(FilterExamType ? { type: FilterExamType } : {}),
    },
    include: {
      votes: true,
    },
  });
  return resource;
}

type CheatsheetWithPosts = Prisma.PromiseReturnType<
  typeof getCheatsheetsWithPosts
>;

type QuestionPaperWithPosts = Prisma.PromiseReturnType<
  typeof getQuestionPapersWithPosts
>;

type NotesWithPosts = Prisma.PromiseReturnType<typeof getNotesWithPosts>;

export default async function Page({
  params,
  searchParams,
}: {
  params: { moduleCode: string; category: ResourceTypeURL };
  searchParams: ResourceFiltersSorts;
}) {
  /************  FETCH OPTIONS FOR SELECT ************/
  const acadYearList = getAcadYearOptions();
  const acadYearOptions = acadYearList.map((acadYear) => {
    return { value: acadYear, label: acadYear };
  });

  /************  DATA FETCHING ************/
  const FilterSemester = searchParams.filterSemester ?? null;
  const FilterAcadYear = searchParams.filterAcadYear ?? null;
  const FilterExamType = searchParams.filterExamType ?? null;
  const Sort = searchParams.sort ?? null;
  let parsedResources:
    | CheatsheetWithPosts
    | QuestionPaperWithPosts
    | NotesWithPosts;
  let category: ResourceType;
  if (params.category === "cheatsheets") {
    category = "Cheatsheets";
    parsedResources = await getCheatsheetsWithPosts(
      params.moduleCode,
      FilterSemester,
      FilterAcadYear,
      FilterExamType
    );
  } else if (params.category === "notes") {
    category = "Notes";
    parsedResources = await getNotesWithPosts(
      params.moduleCode,
      FilterSemester,
      FilterAcadYear,
      FilterExamType
    );
  } else if (params.category === "past_papers") {
    category = "Past Papers";
    parsedResources = await getQuestionPapersWithPosts(
      params.moduleCode,
      FilterSemester,
      FilterAcadYear,
      FilterExamType
    );
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
    <div className="flex flex-row gap-x-6 text-slate-800 dark:text-slate-200">
      {sortedResources.length !== 0 ? (
        <div className="flex w-4/5 flex-col gap-y-6">
          {sortedResources.map((resource) => {
            return (
              // @ts-expect-error Server component
              <ResourceItem
                key={resource.id}
                id={resource.id}
                name={resource.name}
                userId={resource.userId}
                createdAt={resource.createdAt}
                acadYear={resource.acadYear}
                semester={resource.semester}
                rating={resource.rating}
                // @ts-expect-error wrong type inference
                examType={category !== "Notes" ? resource.type : null}
                category={category}
              />
            );
          })}
        </div>
      ) : (
        // FIX WIDTH
        <div className="flex w-11/12 flex-col items-center justify-center gap-y-6 text-2xl">
          <h1 className="text-slate-800 dark:text-slate-200">
            No resources found
          </h1>
        </div>
      )}
      <div className="w-1/5">
        <ResourceFilters acadYearOptions={acadYearOptions} />
      </div>
    </div>
  );
}
