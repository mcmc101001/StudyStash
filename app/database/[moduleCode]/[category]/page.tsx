import {
  ResourceFiltersSorts,
  ResourceType,
  ResourceTypeURL,
  sortValue,
  statusOptions,
} from "@/lib/content";
import { redirect } from "next/navigation";
import ResourceItem from "@/components/ResourceItem";
import { getAcadYearOptions } from "@/lib/nusmods";
import ResourceFilters from "@/components/ResourceFilters";
import { Suspense } from "react";
import {
  CheatsheetWithPosts,
  QuestionPaperWithPosts,
  NotesWithPosts,
  getCheatsheetsWithPosts,
  getNotesWithPosts,
  getQuestionPapersWithPosts,
  getRating,
  getAvgDifficulty,
} from "@/lib/dataFetching";
import { getCurrentUser } from "@/lib/session";

export const revalidate = 60;

export default async function Page({
  params,
  searchParams,
}: {
  params: { moduleCode: string; category: ResourceTypeURL };
  searchParams: ResourceFiltersSorts;
}) {
  const currentUser = await getCurrentUser();

  /************  FETCH OPTIONS FOR SELECT ************/
  const acadYearOptions = getAcadYearOptions();

  /************  DATA FETCHING ************/
  const FilterSemester = searchParams.filterSemester;
  const FilterAcadYear = searchParams.filterAcadYear;
  const FilterExamType = searchParams.filterExamType;
  const FilterStatus = searchParams.filterStatus;
  const Sort = searchParams.sort as sortValue | undefined;
  let parsedResources:
    | CheatsheetWithPosts
    | QuestionPaperWithPosts
    | NotesWithPosts;
  let sortedResources;
  let category: ResourceType;
  if (params.category === "cheatsheets") {
    category = "Cheatsheets";
    parsedResources = await getCheatsheetsWithPosts({
      moduleCode: params.moduleCode,
      FilterSemester,
      FilterAcadYear,
      FilterExamType,
      userId: undefined,
      statusUserId: FilterStatus ? currentUser?.id : undefined,
      statusType: FilterStatus,
    });
  } else if (params.category === "notes") {
    category = "Notes";
    parsedResources = await getNotesWithPosts({
      moduleCode: params.moduleCode,
      FilterSemester,
      FilterAcadYear,
      userId: undefined,
      statusUserId: FilterStatus ? currentUser?.id : undefined,
      statusType: FilterStatus,
    });
  } else if (params.category === "past_papers") {
    category = "Past Papers";
    parsedResources = await getQuestionPapersWithPosts({
      moduleCode: params.moduleCode,
      FilterSemester,
      FilterAcadYear,
      FilterExamType,
      userId: undefined,
      statusUserId: FilterStatus ? currentUser?.id : undefined,
      statusType: FilterStatus,
    });
  } else {
    redirect("/404");
  }
  sortedResources = getRating(parsedResources);
  if (params.category === "past_papers") {
    // @ts-expect-error Wrong type inference
    sortedResources = getAvgDifficulty(sortedResources);
  }

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
  } else if (Sort === "difficulty" && category === "Past Papers") {
    sortedResources.sort((a, b) => {
      // @ts-expect-error Wrong type inference
      return b.difficulty - a.difficulty;
    });
  } else if (Sort === "difficulty_flip" && category === "Past Papers") {
    sortedResources.sort((a, b) => {
      // @ts-expect-error Wrong type inference
      return a.difficulty - b.difficulty;
    });
  }

  return (
    <div className="flex h-[70vh] flex-row gap-x-4 text-slate-800 dark:text-slate-200">
      {sortedResources.length !== 0 ? (
        <ul
          className="flex h-full w-4/5 flex-col gap-y-6 overflow-y-scroll scroll-smooth pr-5 
          scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-200 
          hover:scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-800 dark:hover:scrollbar-thumb-slate-700"
          style={{ scrollbarGutter: "stable" }}
        >
          {sortedResources.map((resource, index) => {
            return (
              // @ts-expect-error Server component
              <ResourceItem
                key={resource.id}
                resourceId={resource.id}
                name={resource.name}
                userId={resource.userId}
                createdAt={resource.createdAt}
                // @ts-expect-error wrong type inference
                acadYear={resource.acadYear}
                // @ts-expect-error wrong type inference
                semester={resource.semester}
                rating={resource.rating}
                difficulty={
                  category === "Past Papers"
                    ? // @ts-expect-error wrong type inference
                      resource.difficulty
                    : undefined
                }
                difficultyCount={
                  category === "Past Papers"
                    ? // @ts-expect-error wrong type inference
                      resource._count.difficulties
                    : undefined
                }
                solutionIncluded={
                  category === "Past Papers"
                    ? // @ts-expect-error wrong type inference
                      resource.solutionIncluded
                    : undefined
                }
                // @ts-expect-error wrong type inference
                examType={category !== "Notes" ? resource.type : undefined}
                category={category}
                designNumber={index % 4}
              />
            );
          })}
        </ul>
      ) : (
        <div className="flex h-full w-4/5 flex-col items-center justify-center gap-y-6 pt-10 text-2xl">
          <h1 className="text-slate-800 dark:text-slate-200">
            No resources found
          </h1>
        </div>
      )}
      <div className="w-1/5">
        <Suspense>
          <ResourceFilters
            acadYearOptions={acadYearOptions}
            category={category}
            currentUserId={currentUser?.id}
            statusOptions={statusOptions}
          />
        </Suspense>
      </div>
    </div>
  );
}
