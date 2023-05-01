import { getRating } from "@/app/database/[moduleCode]/[category]/page";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import ResourceItem from "./ResourceItem";

export default async function UserResources() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/404");
  }
  const cheatsheetsRaw = await prisma.cheatsheet.findMany({
    where: {
      userId: user.id,
    },
    include: {
      votes: true,
    },
  });
  const pastPapersRaw = await prisma.questionPaper.findMany({
    where: {
      userId: user.id,
    },
    include: {
      votes: true,
    },
  });
  const notesRaw = await prisma.notes.findMany({
    where: {
      userId: user.id,
    },
    include: {
      votes: true,
    },
  });

  const cheatsheets = getRating(cheatsheetsRaw);
  const pastPapers = getRating(pastPapersRaw);
  const notes = getRating(notesRaw);

  return (
    <div className="flex flex-row gap-x-4">
      {cheatsheets.length !== 0 ? (
        <div className="flex w-1/2 flex-col gap-y-6">
          {cheatsheets.map((resource) => {
            return (
              /* @ts-expect-error Server Component */
              <ResourceItem
                key={resource.id}
                id={resource.id}
                name={resource.name}
                userId={resource.userId}
                createdAt={resource.createdAt}
                acadYear={resource.acadYear}
                semester={resource.semester}
                rating={resource.rating}
                /* @ts-expect-error Wrong type inference */
                examType={resource.type}
                category="Cheatsheets"
              />
            );
          })}
        </div>
      ) : (
        <div>No cheatsheet found</div>
      )}
    </div>
  );
}
