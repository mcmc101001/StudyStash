import { Icon } from "@/components/Icons";
import { ExamType } from "@prisma/client";
import { z } from "zod";

export const ResourceEnum = z.enum(["Cheatsheets", "Past Papers", "Notes"]);
export type ResourceType = z.infer<typeof ResourceEnum>;

export const ResourceEnumURL = z.enum(["cheatsheets", "past_papers", "notes"]);
export type ResourceTypeURL = z.infer<typeof ResourceEnumURL>;

export interface ResourceOptionsProps {
  name: ResourceType;
  href: ResourceTypeURL;
  icon: Icon;
}

export const ResourceOptions: ResourceOptionsProps[] = [
  {
    name: "Cheatsheets",
    href: "cheatsheets",
    icon: "Calculator",
  },
  {
    name: "Past Papers",
    href: "past_papers",
    icon: "Files",
  },
  {
    name: "Notes",
    href: "notes",
    icon: "FileSignature",
  },
];

export interface ResourceFiltersSorts {
  filterModuleCode?: string | undefined;
  filterCategory?: ResourceTypeURL | undefined;
  filterSemester?: string | undefined;
  filterAcadYear?: string | undefined;
  filterExamType?: ExamType | undefined;
  sort?: string | undefined;
}

export const sortOptions = [
  { value: "rating", label: "Highest Rating" },
  { value: "rating_flip", label: "Lowest Rating" },
  { value: "date", label: "Most recent" },
  { value: "date_flip", label: "Oldest" },
];

export const examTypeOptions = [
  { value: "Midterm", label: "Midterm" },
  { value: "Final", label: "Final" },
  { value: "Quiz", label: "Quiz" },
  { value: "Assignment", label: "Assignment" },
  { value: "PE", label: "PE" },
  { value: "Other", label: "Other" },
];

export const semesterOptions = [
  { value: "1", label: "Semester 1" },
  { value: "2", label: "Semester 2" },
];
