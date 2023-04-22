import ResourceTab from "@/components/ResourceTab";
import { getSpecificModuleInfo } from "@/lib/nusmods";
import { ResourceOptions } from "@/lib/content";

// export const generateStaticParams = async () => {
//   const moduleList = await getModuleList();
//   const paths = moduleList.map((module) => {
//     moduleCode: module.moduleCode
//   })

//   return {
//     paths,
//     fallback: false,
//   }
// };

export default async function Layout({
  params,
  children,
}: {
  params: { moduleCode: string };
  children: React.ReactNode;
}) {
  const moduleInfo = await getSpecificModuleInfo(params.moduleCode);

  return (
    <>
      <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-200">
        {moduleInfo.moduleCode}
      </h1>
      <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-300">
        {moduleInfo.title}
      </h2>
      <ResourceTab
        moduleCode={params.moduleCode}
        resourceOptions={ResourceOptions}
      />
      {children}
    </>
  );
}
