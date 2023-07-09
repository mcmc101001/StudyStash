import ContributeForm from "@/components/ContributeForm";
import { authOptions } from "@/lib/auth";
import { getAcadYearOptions, getModuleCodeOptions } from "@/lib/nusmods";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import {
  examTypeOptions,
  semesterOptions,
  ResourceType,
  ResourceTypeURL,
} from "@/lib/content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "StudyStash | Contribute",
  description: "Contribute resources to the StudyStash database!",
};

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
    redirect("/404");
  }

  const user = await getCurrentUser();
  if (!user) {
    redirect(authOptions?.pages?.signIn || "api/auth/signin/google");
  }

  const acadYearOptions = getAcadYearOptions();
  const moduleCodeOptions = await getModuleCodeOptions();

  return (
    <main className="flex h-screen w-full flex-1 flex-col p-20">
      <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-200">
        {header}
      </h1>
      <ContributeForm
        acadYearOptions={acadYearOptions}
        moduleCodeOptions={moduleCodeOptions}
        semesterOptions={semesterOptions}
        examTypeOptions={resourceType !== "Notes" ? examTypeOptions : null}
        resourceType={resourceType}
        userId={user.id}
      />
    </main>
  );
}
