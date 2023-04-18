import { getSpecificModuleInfo } from "@/lib/nusmods";


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

export default async function Layout ({ params, children }: { params: { moduleCode: string }, children: React.ReactNode }) {
  const moduleInfo = await getSpecificModuleInfo(params.moduleCode);

  return (
    <>
      <h1 className="text-slate-800 dark:text-slate-200 text-4xl font-bold">{moduleInfo.moduleCode}</h1>
      <h2 className="text-slate-700 dark:text-slate-300 text-2xl font-semibold">{moduleInfo.title}</h2>
      {children}
    </>
  );
};

