import { getSpecificModuleInfo } from "@/lib/nusmods";
import { ResourceType } from "@/components/ContributeForm";
import { redirect } from "next/navigation";

export async function generateStaticParams() {
  const paths = [
    {resourceType: "cheatsheet"},
    {resourceType: "past_papers"},
    {resourceType: "notes"},
  ]
  return {
    paths,
    fallback: false, // Paths not returned will result in 404
  }
}

export default async function Page ({ params }: { params: { moduleCode: string, category: string } }) {
  const moduleInfo = await getSpecificModuleInfo(params.moduleCode);
  
  let category:ResourceType;
  if (params.category === "cheatsheet") {
    category = "Cheatsheet";
  }
  else if (params.category === "past_papers") {
    category = "Past Papers";
  }
  else if (params.category === "notes") {
    category = "Notes";
  }
  else {
    redirect("/404");
  }
  

  return (
    <>
      <h1 className="text-slate-800 dark:text-slate-200 text-4xl font-bold">{moduleInfo.moduleCode}</h1>
    </>
  );
};

