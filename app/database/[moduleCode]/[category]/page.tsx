import { ResourceType } from "@/components/ContributeForm";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ResourceTypeURL } from "@/components/ModuleList";
import ResourceItem from "@/components/ResourceItem";
import { Cheatsheet } from "@prisma/client";

export async function generateStaticParams() {
  const paths = [
    {resourceType: "cheatsheets"},
    {resourceType: "notes"},
    {resourceType: "past_papers"},
  ]
  return {
    paths,
    fallback: false, // Paths not returned will result in 404
  }
}


export default async function Page ({ params }: { params: { moduleCode: string, category: ResourceTypeURL } }) {
  
  let resources;
  let category:ResourceType;
  if (params.category === "cheatsheets") {
    category = "Cheatsheets";
    resources = await prisma.cheatsheet.findMany({
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
  else if (params.category === "past_papers") {
    category = "Past Papers";
    resources = await prisma.questionPaper.findMany({
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
      { resources.length !== 0 ? (
          <table className="text-slate-200">
            <thead>
              <tr>
                <th>Name</th>
                <th>User</th>
                <th>Uploaded at</th>
                <th>Semester</th>
                { category !== "Notes" ? <th>Exam Type</th> : <></>}
              </tr>
            </thead>
            <tbody>
              { resources.map((resource) => {
                return (
                  <ResourceItem 
                    key={resource.id} 
                    name={resource.name} 
                    userId={resource.userId} 
                    createdAt={resource.createdAt} 
                    acadYear={resource.acadYear} 
                    semester={resource.semester}
                    // @ts-expect-error Wrong type inference
                    examType={ (category !== "Notes") ? resource.type : null}
                    category={category}
                  />
                )
              })}
            </tbody>
          </table>
        ) : 
        <h1> No resources found </h1> 
      }
    </>
  );
};

