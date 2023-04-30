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
      <main className="m-8 mr-16 flex w-full flex-col">{children}</main>
    </div>
  );
}
