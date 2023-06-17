import {
  ResourceSolutionOptions,
  ResourceSolutionTypeURL,
  ResourceStatusOptions,
  sortValue,
  statusOptions,
} from "@/lib/content";
import UserResourceTab from "@/components/user/UserResourceTab";
import { ExamType, ResourceStatus, SemesterType } from "@prisma/client";
import { redirect } from "next/navigation";
import ResourceItem from "@/components/resource/ResourceItem";
import ResourceFilters from "@/components/resource/ResourceFilters";
import { getAcadYearOptions, getModuleCodeOptions } from "@/lib/nusmods";
import {
  getAvgDifficulty,
  getCheatsheetsWithPosts,
  getNotesWithPosts,
  getQuestionPapersWithPosts,
  getRating,
} from "@/lib/dataFetching";
import { Suspense } from "react";
import { getSolutionsWithPosts } from "@/lib/dataFetching";
import { ResourceSolutionType } from "@/lib/content";
import SideTabCategoryFilter from "@/components/SideTabCategoryFilter";
import DashboardResourceTab from "./DashboardResourceTab";

interface DashboardResourcesSectionProps {
  currentUserId: string;
  filterModuleCode: string | undefined;
  filterCategory: ResourceSolutionTypeURL | undefined;
  filterSemester: SemesterType | undefined;
  filterAcadYear: string | undefined;
  filterExamType: ExamType | undefined;
  filterStatus: ResourceStatus | undefined;
  sort: sortValue | undefined;
}

export default async function DashboardResourcesSection({
  currentUserId,
  filterModuleCode,
  filterCategory,
  filterSemester,
  filterAcadYear,
  filterExamType,
  filterStatus,
  sort,
}: DashboardResourcesSectionProps) {
  let category: ResourceSolutionType = "Cheatsheets";
  let resources;
  if (filterCategory === "cheatsheets") {
    category = "Cheatsheets";
    resources = await getCheatsheetsWithPosts({
      moduleCode: filterModuleCode,
      FilterSemester: filterSemester,
      FilterAcadYear: filterAcadYear,
      FilterExamType: filterExamType,
      userId: undefined,
      statusUserId: currentUserId,
      statusType: filterStatus,
    });
  } else if (filterCategory === "past_papers") {
    category = "Past Papers";
    resources = await getQuestionPapersWithPosts({
      moduleCode: filterModuleCode,
      FilterSemester: filterSemester,
      FilterAcadYear: filterAcadYear,
      FilterExamType: filterExamType,
      userId: undefined,
      statusUserId: currentUserId,
      statusType: filterStatus,
    });
  } else if (filterCategory === "notes") {
    category = "Notes";
    resources = await getNotesWithPosts({
      moduleCode: filterModuleCode,
      FilterSemester: filterSemester,
      FilterAcadYear: filterAcadYear,
      userId: undefined,
      statusUserId: currentUserId,
      statusType: filterStatus,
    });
  } else if (filterCategory === "solutions") {
    category = "Solutions";
    resources = await getSolutionsWithPosts({
      questionPaperId: undefined,
      moduleCode: filterModuleCode,
      FilterSemester: filterSemester,
      FilterAcadYear: filterAcadYear,
      FilterExamType: filterExamType,
      userId: undefined,
      statusUserId: currentUserId,
      statusType: filterStatus,
    });
  } else if (filterCategory !== undefined) {
    redirect("/404");
  }

  let resourcesWithRating = resources ? getRating(resources) : [];
  if (category === "Past Papers") {
    // @ts-expect-error Wrong type inference
    resourcesWithRating = getAvgDifficulty(resourcesWithRating);
  }

  /************** SORTING **************/
  if (sort === "rating") {
    resourcesWithRating.sort((a, b) => {
      return b.rating - a.rating;
    });
  } else if (sort === "rating_flip") {
    resourcesWithRating.sort((a, b) => {
      return a.rating - b.rating;
    });
  } else if (sort === "date") {
    resourcesWithRating.sort((a, b) => {
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  } else if (sort === "date_flip") {
    resourcesWithRating.sort((a, b) => {
      return a.createdAt.getTime() - b.createdAt.getTime();
    });
  } else if (sort === "difficulty" && category === "Past Papers") {
    resourcesWithRating.sort((a, b) => {
      // @ts-expect-error Wrong type inference
      return b.difficulty - a.difficulty;
    });
  } else if (sort === "difficulty_flip" && category === "Past Papers") {
    resourcesWithRating.sort((a, b) => {
      // @ts-expect-error Wrong type inference
      return a.difficulty - b.difficulty;
    });
  }

  const acadYearOptions = getAcadYearOptions();
  const moduleCodeOptions = await getModuleCodeOptions();

  return (
    <>
      <Suspense>
        <DashboardResourceTab resourceStatusOptions={ResourceStatusOptions} />
      </Suspense>
      <div className="flex w-full flex-row justify-between">
        {filterStatus === undefined ? (
          <div className="flex h-1/2 w-full items-center justify-center text-3xl">
            Select status.
          </div>
        ) : (
          <>
            <div className="flex w-4/5 flex-col">
              <SideTabCategoryFilter>
                <div
                  className="inline-flex h-[77vh] w-11/12 flex-col gap-y-6 overflow-y-auto scroll-smooth border border-slate-200 border-l-transparent bg-slate-900 p-4 pr-5
          scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-200 
          hover:scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-800 dark:hover:scrollbar-thumb-slate-700"
                  style={{ scrollbarGutter: "stable" }}
                >
                  {filterCategory === undefined ? (
                    <div className="flex h-1/2 w-full items-center justify-center text-3xl">
                      Select category.
                    </div>
                  ) : resourcesWithRating.length !== 0 ? (
                    <ul className="flex flex-col gap-y-6">
                      {resourcesWithRating.map((resource) => {
                        return (
                          /* @ts-expect-error Server Component */
                          <ResourceItem
                            key={resource.id}
                            resourceId={resource.id}
                            name={resource.name}
                            userId={resource.userId}
                            createdAt={resource.createdAt}
                            acadYear={
                              category === "Solutions"
                                ? // @ts-expect-error wrong type inference
                                  resource.questionPaper.acadYear
                                : // @ts-expect-error wrong type inference
                                  resource.acadYear
                            }
                            semester={
                              category === "Solutions"
                                ? // @ts-expect-error wrong type inference
                                  resource.questionPaper.semester
                                : // @ts-expect-error wrong type inference
                                  resource.semester
                            }
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
                            examType={
                              category === "Solutions"
                                ? // @ts-expect-error wrong type inference
                                  resource.questionPaper.type
                                : filterCategory !== "notes"
                                ? // @ts-expect-error wrong type inference
                                  resource.type
                                : null
                            }
                            category={category}
                            moduleCode={
                              category === "Solutions"
                                ? // @ts-expect-error wrong type inference
                                  resource.questionPaper.moduleCode
                                : // @ts-expect-error wrong type inference
                                  resource.moduleCode
                            }
                            questionPaperId={
                              category === "Solutions"
                                ? // @ts-expect-error wrong type inference
                                  resource.questionPaperId
                                : undefined
                            }
                          />
                        );
                      })}
                    </ul>
                  ) : (
                    <div className="flex h-[50vh] w-full items-center justify-center pr-5 text-3xl">
                      No resources found!
                    </div>
                  )}
                </div>
              </SideTabCategoryFilter>
            </div>
            <div className="w-1/5 pl-4">
              <Suspense>
                <ResourceFilters
                  acadYearOptions={acadYearOptions}
                  category={category}
                  moduleCodeOptions={moduleCodeOptions}
                  currentUserId={currentUserId}
                />
              </Suspense>
            </div>
          </>
        )}
      </div>
    </>
  );
}
