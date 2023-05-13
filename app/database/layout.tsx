import ModuleSearcher from "@/components/ModuleSearcher";
import { getModuleList } from "@/lib/nusmods";

export default async function DataBaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const modules = await getModuleList();
  let moduleCodes = modules.map((mod) => mod.moduleCode);

  return (
    <div className="flex flex-row">
      <ModuleSearcher moduleCodes={moduleCodes} />
      <main className="box-border flex h-screen w-full flex-col overflow-hidden p-8 pr-16">
        {children}
      </main>
    </div>
  );
}
