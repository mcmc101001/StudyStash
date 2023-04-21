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

// Return array of past 8 academic years for form selection.
export function getAcadYearOptions() {
  const currentDate = new Date();
  let acadYear:number;
  if (currentDate.getMonth() < 6) {
    acadYear = currentDate.getFullYear();
  }
  else {
    acadYear = currentDate.getFullYear() + 1 ;
  }
  let acadYearArray:Array<string> = [];
  for (let i = 0; i < 8; i++) {
    let currentAcadYear = acadYear - i;
    let currentAcadYearString = `${currentAcadYear-1}-${currentAcadYear}`;
    acadYearArray.push(currentAcadYearString);
  }
  return acadYearArray;
}

// Extract academic year in form "YYYY-YYYY" based on whether month is before June.
export function getAcadYear() {
  const currentDate = new Date();
  let acadYear:string;
  if (currentDate.getMonth() < 6) {
    acadYear = `${currentDate.getFullYear() - 1}-${currentDate.getFullYear()}`;
  }
  else {
    acadYear = `${currentDate.getFullYear()}-${currentDate.getFullYear() + 1}`;
  }
  return acadYear;
}

// Fetch module list from NUSMods API
export async function getModuleList() {
  let acadYear = getAcadYear();
  const res = await fetch(`https://api.nusmods.com/v2/${acadYear}/moduleList.json`, {
    method: 'GET',
  })
  const data = await res.json()
  return data as Array<Module>;
}

// Fetch specific module information from NUSMods API based on module code
export async function getSpecificModuleInfo(moduleCode: string) {
  let acadYear = getAcadYear();
  const res = await fetch(`https://api.nusmods.com/v2/${acadYear}/modules/${moduleCode}.json`, {
    method: 'GET',
  })
  const data = await res.json()
  return data as ModuleInformation;
}