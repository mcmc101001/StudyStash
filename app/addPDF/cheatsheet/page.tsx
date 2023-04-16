import ContributeForm from "@/components/ContributeForm";
import PDFUploader from "@/components/PDFUploader";
import { getAcadYearOptions, getModuleList } from "@/lib/nusmods";

/* from prisma schema
enum ExamType {
  Midterm
  Final
  Quiz
  Assignment
  PE
  Other
}
*/

// Bad implementation, copy from prisma schema, but I can't seem to import it
const examTypeOptions = [
  {value: "Midterm", label: "Midterm"},
  {value: "Final", label: "Final"},
  {value: "Quiz", label: "Quiz"},
  {value: "Assignment", label: "Assignment"},
  {value: "PE", label: "PE"},
  {value: "Other", label: "Other"},
]

const semesterOptions = [
  {value: "1", label: "Semester 1"},
  {value: "2", label: "Semester 2"},
]

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
    <main className="p-20 h-screen w-full flex flex-1 flex-col gap-10">
      <h1 className="text-slate-800 dark:text-slate-200 text-4xl font-bold">Submit cheatsheet</h1>
      <div className="flex flex-row items-center justify-around">
        <ContributeForm 
          acadYearOptions={acadYearOptions} 
          moduleCodeOptions={moduleCodeOptions} 
          semesterOptions={semesterOptions}
          examTypeOptions={examTypeOptions}
          submitType="cheatsheet"
        />
        <PDFUploader />
      </div>
    </main>
  )
}