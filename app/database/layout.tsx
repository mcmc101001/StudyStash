import ModuleSearcher from "@/components/ModuleSearcher";

export type Module = {
  moduleCode: string;
  title: string;
  semester: Array<number>;
}

async function getModuleList() {
  const res = await fetch('https://api.nusmods.com/v2/2022-2023/moduleList.json', {
    method: 'GET',
  })
  const data = await res.json()
  return data as Array<Module>;
}

export default async function DataBaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const modules = await getModuleList();
  let module_codes = modules.map((mod) => mod.moduleCode);

  return (
    <div className="flex flex-row">
        <ModuleSearcher module_codes={module_codes} />
        {children}
    </div>
  );
}
