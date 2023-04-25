import {
  ResourceFiltersSorts,
  ResourceType,
  ResourceTypeURL,
} from "@/lib/content";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ExamType } from "@prisma/client";
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
  let parsed_resources;
  let category: ResourceType;
  if (params.category === "cheatsheets") {
    category = "Cheatsheets";
    parsed_resources = await prisma.cheatsheet.findMany({
      where: {
        moduleCode: params.moduleCode,
        ...(FilterSemester ? { semester: FilterSemester } : {}),
        ...(FilterAcadYear ? { acadYear: FilterAcadYear } : {}),
        ...(FilterExamType ? { type: FilterExamType } : {}),
      },
    });
  } else if (params.category === "notes") {
    category = "Notes";
    parsed_resources = await prisma.notes.findMany({
      where: {
        moduleCode: params.moduleCode,
      },
    });
  } else if (params.category === "past_papers") {
    category = "Past Papers";
    parsed_resources = await prisma.questionPaper.findMany({
      where: {
        moduleCode: params.moduleCode,
      },
    });
  } else {
    redirect("/404");
  }

  return (
    <div className="flex flex-col gap-y-6">
      <ResourceFilters acadYearOptions={acadYearOptions} />
      {parsed_resources.length !== 0 ? (
        <table className="text-sate-800 w-full dark:text-slate-200">
          <thead>
            <tr>
              <th>Name</th>
              <th>User</th>
              <th>Uploaded at</th>
              <th>Semester</th>
              {category !== "Notes" ? <th>Exam Type</th> : <></>}
            </tr>
          </thead>
          <tbody>
            {parsed_resources.map((resource) => {
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
          </tbody>
        </table>
      ) : (
        <h1 className="text-slate-800 dark:text-slate-200">
          No resources found
        </h1>
      )}
    </div>
  );
}
