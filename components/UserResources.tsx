import { getRating } from "@/app/database/[moduleCode]/[category]/page";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import ResourceItem from "@/components/ResourceItem";

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
      _count: { select: { difficulties: true } },
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
    <div className="flex">
      <div className="w-1/4">
        <h1>Cheatsheets</h1>
        {cheatsheets.length !== 0 ? (
          <div className="flex flex-col gap-y-6">
            {cheatsheets.map((resource) => {
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
                  /* @ts-expect-error Wrong type inference */
                  examType={resource.type}
                  category="Cheatsheets"
                  deletable={true}
                />
              );
            })}
          </div>
        ) : (
          <div>No cheatsheet found</div>
        )}
      </div>
      <div className="w-1/3">
        <h1>Past papers</h1>
        {pastPapers.length !== 0 ? (
          <div className="flex flex-col gap-y-6">
            {pastPapers.map((resource) => {
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
                  /* @ts-expect-error Wrong type inference */
                  examType={resource.type}
                  /* @ts-expect-error Wrong type inference */
                  difficultyCount={resource?._count.difficulties}
                  category="Past Papers"
                  deletable={true}
                />
              );
            })}
          </div>
        ) : (
          <div>No past papers found</div>
        )}
      </div>
      <div className="w-1/4">
        <h1>Notes</h1>
        {notes.length !== 0 ? (
          <div className="flex flex-col gap-y-6">
            {notes.map((resource) => {
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
                  /* @ts-expect-error Wrong type inference */
                  examType={resource.type}
                  category="Notes"
                  deletable={true}
                />
              );
            })}
          </div>
        ) : (
          <div>No notes found</div>
        )}
      </div>
    </div>
  );
}
