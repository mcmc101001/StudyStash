import { ResourceTypeURL } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { Cheatsheet, Notes, QuestionPaper } from "@prisma/client";
import { redirect } from "next/navigation";

export default async function ResourcePage({
  params,
  children,
}: {
  params: { resourceId: string; category: ResourceTypeURL };
  children: React.ReactNode;
}) {
  let resource: Cheatsheet | QuestionPaper | Notes | null;
  if (params.category === "cheatsheets") {
    resource = await prisma.cheatsheet.findUnique({
      where: { id: params.resourceId },
    });
  } else if (params.category === "past_papers") {
    resource = await prisma.questionPaper.findUnique({
      where: { id: params.resourceId },
    });
  } else if (params.category === "notes") {
    resource = await prisma.notes.findUnique({
      where: { id: params.resourceId },
    });
  } else {
    redirect("/404");
  }
  if (!resource) {
    redirect("/404");
  }

  return (
    <>
      <div className="m-20 w-1/2">hello</div>
      <div className="m-20 w-1/2">{children}</div>
    </>
  );
}
