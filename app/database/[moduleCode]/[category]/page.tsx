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
  let parsedResources;
  let category: ResourceType;
  if (params.category === "cheatsheets") {
    category = "Cheatsheets";
    parsedResources = await prisma.cheatsheet.findMany({
      where: {
        moduleCode: params.moduleCode,
        ...(FilterSemester ? { semester: FilterSemester } : {}),
        ...(FilterAcadYear ? { acadYear: FilterAcadYear } : {}),
        ...(FilterExamType ? { type: FilterExamType } : {}),
      },
      include: {
        _count: {
          select: { votes: true },
        },
      },
    });
  } else if (params.category === "notes") {
    category = "Notes";
    parsedResources = await prisma.notes.findMany({
      where: {
        moduleCode: params.moduleCode,
      },
    });
  } else if (params.category === "past_papers") {
    category = "Past Papers";
    parsedResources = await prisma.questionPaper.findMany({
      where: {
        moduleCode: params.moduleCode,
      },
    });
  } else {
    redirect("/404");
  }

  return (
    <div className="flex flex-row gap-x-6 text-slate-800 dark:text-slate-200">
      {parsedResources.length !== 0 ? (
        <div className="flex w-11/12 flex-col gap-y-6">
          {parsedResources.map((resource) => {
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
                // @ts-expect-error Wrong type inference
                examType={category !== "Notes" ? resource.type : null}
                category={category}
              />
            );
          })}
        </div>
      ) : (
        <h1 className="text-slate-800 dark:text-slate-200">
          No resources found
        </h1>
      )}
      <ResourceFilters acadYearOptions={acadYearOptions} />
    </div>
  );
}
