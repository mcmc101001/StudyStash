import ContributeForm from "@/components/ContributeForm";
import { getAcadYearOptions, getModuleList } from "@/lib/nusmods";

export default async function CheatsheetPage() {
  const acadYearList = getAcadYearOptions();
  const acadYearOptions = acadYearList.map((acadYear) => {
    return { value: acadYear, label: acadYear }
  })
  const moduleList = await getModuleList();
  const moduleCodeOptions = moduleList.map((module) => {
    return { value: module.moduleCode, label: module.moduleCode }
  })

  return (
    <main className="p-20 h-screen flex flex-1 flex-row gap-20">
      <ContributeForm acadYearOptions={acadYearOptions} moduleCodeList={moduleCodeOptions} />
    </main>
  )
}