import ContributeForm from "@/components/ContributeForm";
import { authOptions } from "@/lib/auth";
import { getAcadYearOptions, getModuleList } from "@/lib/nusmods";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { ResourceType, ResourceTypeURL } from "@/lib/content";

/* from prisma schema
enum ExamType {
  Midterm
  Final
  Quiz
  Assignment
  PE
  Other
}
*/

export async function generateStaticParams() {
  const paths: Array<{ resourceType: ResourceTypeURL }> = [
    { resourceType: "cheatsheets" },
    { resourceType: "past_papers" },
    { resourceType: "notes" },
  ];
  return {
    paths,
    fallback: false, // Paths not returned will result in 404
  };
}

// Bad implementation, copy from prisma schema, but I can't seem to import it
const examTypeOptions = [
  { value: "Midterm", label: "Midterm" },
  { value: "Final", label: "Final" },
  { value: "Quiz", label: "Quiz" },
  { value: "Assignment", label: "Assignment" },
  { value: "PE", label: "PE" },
  { value: "Other", label: "Other" },
];

const semesterOptions = [
  { value: "1", label: "Semester 1" },
  { value: "2", label: "Semester 2" },
];

export default async function Page({
  params,
}: {
  params: { resourceType: ResourceTypeURL };
}) {
  let resourceType: ResourceType;
  let header: string;
  if (params.resourceType === "cheatsheets") {
    resourceType = "Cheatsheets";
    header = "Submit cheatsheet";
  } else if (params.resourceType === "past_papers") {
    resourceType = "Past Papers";
    header = "Submit past papers";
  } else if (params.resourceType === "notes") {
    resourceType = "Notes";
    header = "Submit notes";
  } else {
    // this should be taken care of by generateStaticParams
    redirect("/404");
  }

  const user = await getCurrentUser();
  if (!user) {
    redirect(authOptions?.pages?.signIn || "api/auth/signin/google");
  }

  const acadYearList = getAcadYearOptions();
  const acadYearOptions = acadYearList.map((acadYear) => {
    return { value: acadYear, label: acadYear };
  });
  const moduleList = await getModuleList();
  const moduleCodeOptions = moduleList.map((module) => {
    return { value: module.moduleCode, label: module.moduleCode };
  });

  return (
    <main className="p-20 h-screen w-full flex flex-1 flex-col">
      <h1 className="text-slate-800 dark:text-slate-200 text-4xl font-bold">
        {header}
      </h1>
      <div className="flex flex-row h-full items-center justify-around">
        <ContributeForm
          acadYearOptions={acadYearOptions}
          moduleCodeOptions={moduleCodeOptions}
          semesterOptions={semesterOptions}
          examTypeOptions={resourceType !== "Notes" ? examTypeOptions : null}
          resourceType={resourceType}
          userID={user.id}
        />
      </div>
    </main>
  );
}
