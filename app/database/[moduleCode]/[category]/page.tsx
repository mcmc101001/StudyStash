import { ResourceType } from "@/components/ContributeForm";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Cheatsheet } from "@prisma/client";
import { ResourceTypeURL } from "@/components/ModuleList";

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


export default async function Page ({ params }: { params: { moduleCode: string, category: ResourceTypeURL } }) {
  
  let resources;
  let category:ResourceType;
  if (params.category === "cheatsheet") {
    category = "Cheatsheet";
    resources = await prisma.cheatsheet.findMany({
      where: {
        moduleCode: params.moduleCode
      }
    })
  }
  else if (params.category === "past_papers") {
    category = "Past Papers";
    resources = await prisma.questionPaper.findMany({
      where: {
        moduleCode: params.moduleCode
      }
    })
  }
  else if (params.category === "notes") {
    category = "Notes";
    resources = await prisma.notes.findMany({
      where: {
        moduleCode: params.moduleCode
      }
    })
  }
  else {
    redirect("/404");
  }
  

  return (
    <>
      { resources.length !== 0 ? 
        resources.map((resource) => <h1>{resource.id}</h1>) : 
        <h1> No resources found </h1> 
      }
    </>
  );
};

