import { getSpecificModuleInfo } from "@/lib/nusmods";
import { FC } from "react";

export default async function Page ({ params }: { params: { moduleCode: string } }) {
  const moduleInfo = await getSpecificModuleInfo(params.moduleCode);

  return (
    <>
      <h1 className="text-slate-800 dark:text-slate-200 text-4xl font-bold">{moduleInfo.moduleCode}</h1>
      <h2 className="text-slate-700 dark:text-slate-300 text-2xl font-semibold">{moduleInfo.title}</h2>
    </>
  );
};

