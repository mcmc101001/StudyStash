import { FC } from "react";

export type ModuleInformation = Readonly<{
    // Basic info
    moduleCode: string;
    title: string;
  
    // Additional info
    description?: string;
    moduleCredit: string;
    department: string;
    faculty: string;
  
    // Requsites
    prerequisite?: string;
    corequisite?: string;
    preclusion?: string;
  }>;

async function getSpecificModuleInfo(moduleCode: string) {
    const res = await fetch(`https://api.nusmods.com/v2/2022-2023/modules/${moduleCode}.json`, {
      method: 'GET',
    })
    const data = await res.json()
    return data as ModuleInformation;
  }

export default async function Page ({ params }: { params: { moduleCode: string } }) {
  const moduleInfo = await getSpecificModuleInfo(params.moduleCode);

  return (
    <main className="m-8 flex flex-col">
      <h1 className="text-slate-800 dark:text-slate-200 text-4xl font-bold">{moduleInfo.moduleCode}</h1>
      <h2 className="text-slate-700 dark:text-slate-300 text-2xl font-semibold">{moduleInfo.title}</h2>
    </main>
  );
};

