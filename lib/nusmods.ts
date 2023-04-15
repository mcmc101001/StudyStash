export type Module = {
  moduleCode: string;
  title: string;
  semester: Array<number>;
}

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

export async function getModuleList() {
  const res = await fetch('https://api.nusmods.com/v2/2022-2023/moduleList.json', {
    method: 'GET',
  })
  const data = await res.json()
  return data as Array<Module>;
}

export async function getSpecificModuleInfo(moduleCode: string) {
  const res = await fetch(`https://api.nusmods.com/v2/2022-2023/modules/${moduleCode}.json`, {
    method: 'GET',
  })
  const data = await res.json()
  return data as ModuleInformation;
}