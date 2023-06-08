import { Icon } from "@/components/Icons";
import { ExamType } from "@prisma/client";
import { z } from "zod";

export const ResourceEnum = z.enum(["Cheatsheets", "Past Papers", "Notes"]);
export type ResourceType = z.infer<typeof ResourceEnum>;

export const ResourceSolutionEnum = z.enum([
  "Cheatsheets",
  "Past Papers",
  "Notes",
  "Solutions",
]);
export type ResourceSolutionType = z.infer<typeof ResourceSolutionEnum>;

export const ResourceEnumURL = z.enum(["cheatsheets", "past_papers", "notes"]);
export type ResourceTypeURL = z.infer<typeof ResourceEnumURL>;

export const ResourceSolutionEnumURL = z.enum([
  "cheatsheets",
  "past_papers",
  "notes",
  "solutions",
]);
export type ResourceSolutionTypeURL = z.infer<typeof ResourceSolutionEnumURL>;

export interface ResourceOptionsProps {
  name: ResourceSolutionType;
  href: ResourceSolutionTypeURL;
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

export const ResourceSolutionOptions: ResourceOptionsProps[] = [
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
  {
    name: "Solutions",
    href: "solutions",
    icon: "FileSignature",
  },
];

export const solutionTabEnum = z.enum([
  "Solutions",
  "Comments",
  "Submit solution",
]);

export type solutionTabType = z.infer<typeof solutionTabEnum>;

export const solutionTabURLEnum = z.enum([
  "solutions",
  "comments",
  "contribute",
]);
export type solutionTabURLType = z.infer<typeof solutionTabURLEnum>;

export interface solutionOptionsProps {
  buttonName: string;
  tabName: solutionTabType;
  assignedCategory: ResourceSolutionType[];
  href: solutionTabURLType;
}

export const solutionTabOptions: solutionOptionsProps[] = [
  {
    buttonName: "View Solutions",
    tabName: "Solutions",
    assignedCategory: ["Past Papers"],
    href: "solutions",
  },
  {
    buttonName: "View Question Paper/Comments",
    tabName: "Solutions",
    assignedCategory: ["Solutions"],
    href: "solutions",
  },
  {
    buttonName: "View Comments",
    tabName: "Comments",
    assignedCategory: ["Past Papers", "Notes", "Cheatsheets"],
    href: "comments",
  },
  {
    buttonName: "Submit solution",
    tabName: "Submit solution",
    assignedCategory: ["Past Papers"],
    href: "contribute",
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
  { value: "date", label: "Most recent" },
  { value: "date_flip", label: "Oldest" },
  { value: "rating", label: "Highest Rating" },
  { value: "rating_flip", label: "Lowest Rating" },
];

export const papersAdditionalSortOptions = [
  { value: "difficulty", label: "Highest Difficulty" },
  { value: "difficulty_flip", label: "Lowest Difficulty" },
];

export const examTypeOptions: { value: ExamType; label: ExamType }[] = [
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
