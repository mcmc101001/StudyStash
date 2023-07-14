import { redirect } from "next/navigation";
import ResourceItem from "@/components/resource/ResourceItem";
import UserResourceTab from "@/components/user/UserResourceTab";
import {
  ResourceSolutionOptions,
  ResourceSolutionType,
  ResourceSolutionTypeURL,
  sortValue,
} from "@/lib/content";
import ResourceFilters from "@/components/resource/ResourceFilters";
import { getAcadYearOptions, getModuleCodeOptions } from "@/lib/nusmods";
import { ExamType, SemesterType } from "@prisma/client";
import {
  getAvgDifficulty,
  getCheatsheetsWithPosts,
  getNotesWithPosts,
  getQuestionPapersWithPosts,
  getRating,
  getSolutionsWithPosts,
} from "@/lib/dataFetching";

interface UserResourcesSectionProps {
  profileUserId: string;
  filterModuleCode: string | undefined;
  filterCategory: ResourceSolutionTypeURL | undefined;
  filterSemester: SemesterType | undefined;
  filterAcadYear: string | undefined;
  filterExamType: ExamType | undefined;
  sort: sortValue | undefined;
}

export default async function UserResourcesSection({
  profileUserId,
  filterModuleCode,
  filterCategory,
  filterSemester,
  filterAcadYear,
  filterExamType,
  sort,
}: UserResourcesSectionProps) {
  let category: ResourceSolutionType = "Cheatsheets";
  let resources;
  if (filterCategory === "cheatsheets") {
    category = "Cheatsheets";
    resources = await getCheatsheetsWithPosts({
      resourceIdList: undefined,
      moduleCode: filterModuleCode,
      FilterSemester: filterSemester,
      FilterAcadYear: filterAcadYear,
      FilterExamType: filterExamType,
      userId: profileUserId,
      statusUserId: undefined,
      statusType: undefined,
    });
  } else if (filterCategory === "past_papers") {
    category = "Past Papers";
    resources = await getQuestionPapersWithPosts({
      resourceIdList: undefined,
      moduleCode: filterModuleCode,
      FilterSemester: filterSemester,
      FilterAcadYear: filterAcadYear,
      FilterExamType: filterExamType,
      userId: profileUserId,
      statusUserId: undefined,
      statusType: undefined,
    });
  } else if (filterCategory === "notes") {
    category = "Notes";
    resources = await getNotesWithPosts({
      resourceIdList: undefined,
      moduleCode: filterModuleCode,
      FilterSemester: filterSemester,
      FilterAcadYear: filterAcadYear,
      userId: profileUserId,
      statusUserId: undefined,
      statusType: undefined,
    });
  } else if (filterCategory === "solutions") {
    category = "Solutions";
    resources = await getSolutionsWithPosts({
      resourceIdList: undefined,
      questionPaperId: undefined,
      moduleCode: filterModuleCode,
      FilterSemester: filterSemester,
      FilterAcadYear: filterAcadYear,
      FilterExamType: filterExamType,
      userId: profileUserId,
      statusUserId: undefined,
      statusType: undefined,
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
      <UserResourceTab resourceOptions={ResourceSolutionOptions} />
      <div className="flex h-[72vh] w-full flex-row justify-between gap-x-4">
        {filterCategory === undefined ? (
          <div className="flex h-1/2 w-full items-center justify-center text-3xl">
            Select category.
          </div>
        ) : (
          <>
            <div
              className="flex w-4/5 flex-col gap-y-6 overflow-y-auto scroll-smooth pr-5 
          scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-200 scrollbar-thumb-rounded-md 
          hover:scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-800 dark:hover:scrollbar-thumb-slate-700"
              style={{ scrollbarGutter: "stable" }}
            >
              {resourcesWithRating.length !== 0 ? (
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
                        isProfilePage={true}
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
                        solutionIncluded={
                          category === "Past Papers"
                            ? // @ts-expect-error wrong type inference
                              resource.solutionIncluded
                            : undefined
                        }
                      />
                    );
                  })}
                </ul>
              ) : (
                <div className="flex h-1/2 w-full items-center justify-center text-3xl">
                  No resources found!
                </div>
              )}
            </div>
            <div className="w-1/5">
              <ResourceFilters
                acadYearOptions={acadYearOptions}
                category={category}
                moduleCodeOptions={moduleCodeOptions}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}
