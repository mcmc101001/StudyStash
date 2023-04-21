import ModuleSearcher from "@/components/ModuleSearcher";
import { getModuleList } from "@/lib/nusmods";

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
        <main className="m-8 w-full flex flex-col">
          {children}  
        </main>    
    </div>
  );
}
