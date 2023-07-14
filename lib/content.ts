import { Icon } from "@/components/Icons";
import {
  ExamType,
  ResourceReportType,
  SolutionReportType,
  CommentReportType,
  ResourceStatus,
  SemesterType,
} from "@prisma/client";
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

export interface ResourceStatusProps {
  name: ResourceStatus;
  icon: Icon;
}

export const ResourceStatusOptions: ResourceStatusProps[] = [
  {
    name: "Todo",
    icon: "Calendar",
  },
  {
    name: "Completed",
    icon: "CheckCircle",
  },
  {
    name: "Saved",
    icon: "Bookmark",
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
    buttonName: "Resizable view",
    tabName: "Comments",
    assignedCategory: ["Notes", "Cheatsheets"],
    href: "comments",
  },
];

export interface ResourceFiltersSorts {
  filterModuleCode?: string | undefined;
  filterCategory?: ResourceTypeURL | undefined;
  filterSemester?: SemesterType | undefined;
  filterAcadYear?: string | undefined;
  filterExamType?: ExamType | undefined;
  filterStatus?: ResourceStatus | "Visited" | undefined;
  sort?: string | undefined;
}

export const sortOptions = [
  { value: "date", label: "Most recent" },
  { value: "date_flip", label: "Oldest" },
  { value: "rating", label: "Highest Rating" },
  { value: "rating_flip", label: "Lowest Rating" },
];

export type sortValue = "date" | "date_flip" | "rating" | "rating_flip";

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

export const semesterOptions: { value: SemesterType; label: string }[] = [
  { value: "semester1", label: "Semester 1" },
  { value: "semester2", label: "Semester 2" },
  { value: "specialTerm1", label: "Special Term 1" },
  { value: "specialTerm2", label: "Special Term 2" },
];

export const categoryOptions: { value: ResourceTypeURL; label: string }[] = [
  { value: "cheatsheets", label: "Cheatsheets" },
  { value: "past_papers", label: "Past Papers" },
  { value: "notes", label: "Notes" },
];

export const statusOptions: { value: ResourceStatus; label: ResourceStatus }[] =
  [
    { value: "Saved", label: "Saved" },
    { value: "Todo", label: "Todo" },
    { value: "Completed", label: "Completed" },
  ];

export type DashboardTabType = "Saved" | "Todo" | "Completed" | "Visited";

export const DashboardStatusArr: DashboardTabType[] = [
  "Saved",
  "Todo",
  "Completed",
  "Visited",
];

export const reportSectionOptions = ["resource", "solution", "comment"];

export const resourceReportOptions: {
  value: ResourceReportType;
  label: string;
}[] = [
  { value: "inappropriateFilename", label: "Inappropriate filename" },
  { value: "inappropriateUsername", label: "Inappropriate username" },
  { value: "incorrectModule", label: "Incorrect module" },
  { value: "incorrectSemester", label: "Incorrect semester" },
  { value: "incorrectAcadYear", label: "Incorrect academic year" },
];

export const papersAdditionalReportOptions: {
  value: ResourceReportType;
  label: string;
}[] = [{ value: "incorrectExamType", label: "Incorrect exam type" }];

export const solutionReportOptions: {
  value: SolutionReportType;
  label: string;
}[] = [
  { value: "inappropriateFilename", label: "Inappropriate filename" },
  { value: "inappropriateUsername", label: "Inappropriate username" },
  { value: "incorrectQuestionPaper", label: "Incorrect question paper" },
];

export const commentReportOptions: {
  value: CommentReportType;
  label: string;
}[] = [
  { value: "inappropriateUsername", label: "Inappropriate username" },
  { value: "spam", label: "Spam" },
  { value: "harassment", label: "Harassment" },
];

export const resolvedOptions: { value: string; label: string }[] = [
  { value: "Unresolved", label: "Unresolved" },
  { value: "Resolved", label: "Resolved" },
];

export const CommentReportEnum = z.enum([
  "cheatsheetCommentReport",
  "questionPaperCommentReport",
  "notesCommentReport",
  "solutionCommentReport",
  "cheatsheetReplyReport",
  "questionPaperReplyReport",
  "notesReplyReport",
  "solutionReplyReport",
]);
export type CommentReportCategory = z.infer<typeof CommentReportEnum>;
