import { redirect } from "next/navigation";
import ResourceItem from "@/components/ResourceItem";
import UserResourceTab from "@/components/UserResourceTab";
import { ResourceOptions, ResourceType, ResourceTypeURL } from "@/lib/content";
import ResourceFilters from "@/components/ResourceFilters";
import { getAcadYearOptions, getModuleCodeOptions } from "@/lib/nusmods";
import { ExamType } from "@prisma/client";
import {
  getAvgDifficulty,
  getCheatsheetsWithPosts,
  getNotesWithPosts,
  getQuestionPapersWithPosts,
  getRating,
} from "@/app/database/[moduleCode]/[category]/page";
import { Suspense } from "react";

interface UserResourcesSectionProps {
  profileUserId: string;
  filterModuleCode: string | undefined;
  filterCategory: ResourceTypeURL | undefined;
  filterSemester: string | undefined;
  filterAcadYear: string | undefined;
  filterExamType: ExamType | undefined;
  sort: string | undefined;
  isProfile: boolean;
}

export default async function UserResourcesSection({
  profileUserId,
  filterModuleCode,
  filterCategory,
  filterSemester,
  filterAcadYear,
  filterExamType,
  sort,
  isProfile,
}: UserResourcesSectionProps) {
  let category: ResourceType = "Cheatsheets";
  let resources;
  if (filterCategory === "cheatsheets") {
    category = "Cheatsheets";
    resources = await getCheatsheetsWithPosts({
      moduleCode: filterModuleCode,
      FilterSemester: filterSemester,
      FilterAcadYear: filterAcadYear,
      FilterExamType: filterExamType,
      userId: profileUserId,
    });
  } else if (filterCategory === "past_papers") {
    category = "Past Papers";
    resources = await getQuestionPapersWithPosts({
      moduleCode: filterModuleCode,
      FilterSemester: filterSemester,
      FilterAcadYear: filterAcadYear,
      FilterExamType: filterExamType,
      userId: profileUserId,
    });
  } else if (filterCategory === "notes") {
    category = "Notes";
    resources = await getNotesWithPosts({
      moduleCode: filterModuleCode,
      FilterSemester: filterSemester,
      FilterAcadYear: filterAcadYear,
      userId: profileUserId,
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
        <UserResourceTab resourceOptions={ResourceOptions} />
      </Suspense>
      <div className="flex h-[70vh] w-full flex-row justify-between gap-x-4">
        {filterCategory === undefined ? (
          <div className="flex h-1/2 w-full items-center justify-center text-3xl">
            Select category.
          </div>
        ) : (
          <>
            <div
              className="flex w-4/5 flex-col gap-y-6 overflow-y-auto scroll-smooth pr-5 
          scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-200 
          hover:scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-800 dark:hover:scrollbar-thumb-slate-700"
              style={{ scrollbarGutter: "stable" }}
            >
              {resourcesWithRating.length !== 0 ? (
                <div className="flex flex-col gap-y-6">
                  {resourcesWithRating.map((resource) => {
                    return (
                      /* @ts-expect-error Server Component */
                      <ResourceItem
                        key={resource.id}
                        resourceId={resource.id}
                        name={resource.name}
                        userId={resource.userId}
                        createdAt={resource.createdAt}
                        acadYear={resource.acadYear}
                        semester={resource.semester}
                        rating={resource.rating}
                        difficulty={
                          category === "Past Papers"
                            ? // @ts-expect-error wrong type inference
                              resource.difficulty
                            : undefined
                        }
                        difficultyCount={
                          filterCategory === "past_papers"
                            ? // @ts-expect-error wrong type inference
                              resource._count.difficulties
                            : undefined
                        }
                        examType={
                          // @ts-expect-error wrong type inference
                          filterCategory !== "notes" ? resource.type : null
                        }
                        category={category}
                        deletable={isProfile}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="flex h-1/2 w-full items-center justify-center text-3xl">
                  No resources found!
                </div>
              )}
            </div>
            <div className="w-1/5">
              <Suspense>
                <ResourceFilters
                  acadYearOptions={acadYearOptions}
                  category={category}
                  moduleCodeOptions={moduleCodeOptions}
                />
              </Suspense>
            </div>
          </>
        )}
      </div>
    </>
  );
}
