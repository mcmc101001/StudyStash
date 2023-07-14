import ResourceTab from "@/components/resource/ResourceTab";
import { getSpecificModuleInfo } from "@/lib/nusmods";
import { ResourceOptions } from "@/lib/content";
import { getCurrentUser } from "@/lib/session";
import ModuleStar from "@/components/ModuleStar";
import { prisma } from "@/lib/prisma";
import ContributeButton from "@/components/ContributeButton";

export default async function Layout({
  params: { moduleCode },
  children,
}: {
  params: { moduleCode: string };
  children: React.ReactNode;
}) {
  const moduleInfo = await getSpecificModuleInfo(moduleCode);
  const user = await getCurrentUser();

  let starred = null;
  if (user) {
    starred = await prisma.starredModules.findUnique({
      where: {
        userId_moduleCode: {
          userId: user.id,
          moduleCode: moduleCode,
        },
      },
    });
  }

  return (
    // set to be div for framer motion to work
    <div className="h-full">
      <div className="flex w-full flex-row items-center justify-between">
        <div>
          <h1 className="flex flex-row items-center justify-start gap-x-2 text-4xl font-bold text-slate-800 dark:text-slate-200">
            {moduleInfo ? moduleInfo.moduleCode : moduleCode}
            <span>
              {user && moduleInfo && (
                <ModuleStar
                  moduleCode={moduleCode}
                  userId={user.id}
                  starred={!!starred}
                />
              )}
            </span>
          </h1>
          <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-300">
            {moduleInfo ? moduleInfo.title : "Module Title cannot be found"}
          </h2>
        </div>
        <ContributeButton userId={user?.id} />
      </div>
      <ResourceTab moduleCode={moduleCode} resourceOptions={ResourceOptions} />
      {children}
    </div>
  );
}
