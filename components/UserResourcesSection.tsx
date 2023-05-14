import { redirect } from "next/navigation";
import ResourceItem from "@/components/ResourceItem";
import UserResourceTab from "./UserResourceTab";
import { ResourceOptions, ResourceType, ResourceTypeURL } from "@/lib/content";
import ResourceFilters from "./ResourceFilters";
import { getAcadYearOptions, getModuleCodeOptions } from "@/lib/nusmods";
import { ExamType } from "@prisma/client";
import {
  getCheatsheetsWithPosts,
  getNotesWithPosts,
  getQuestionPapersWithPosts,
  getRating,
} from "@/app/database/[moduleCode]/[category]/page";
import { deleteS3ObjectType } from "@/pages/api/deleteS3Object";
import axios from "axios";
import { deletePDFType } from "@/pages/api/deletePDF";
import { toast } from "react-hot-toast";

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
      FilterExamType: filterExamType,
      userId: profileUserId,
    });
  } else if (filterCategory !== undefined) {
    redirect("/404");
  }

  let resourcesWithRating = resources ? getRating(resources) : [];

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
  }

  const acadYearOptions = getAcadYearOptions();
  const moduleCodeOptions = await getModuleCodeOptions();

  return (
    <>
      <UserResourceTab resourceOptions={ResourceOptions} />
      <div className="flex h-[70vh] w-full flex-row justify-between gap-x-4">
        {filterCategory === undefined ? (
          <div>Select category.</div>
        ) : (
          <>
            <div
              className="flex w-3/4 flex-col gap-y-6 overflow-y-auto scroll-smooth pr-5 
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
                <div className="flex justify-center text-xl">
                  No resources found!
                </div>
              )}
            </div>
            <div className="w-1/4">
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
