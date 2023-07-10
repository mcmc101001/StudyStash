import {
  ExamType,
  NotesVote,
  Prisma,
  QuestionPaper,
  QuestionPaperDifficulty,
  QuestionPaperVote,
  SemesterType,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { DashboardTabType } from "./content";

export function getRating(
  resources:
    | CheatsheetWithPosts
    | QuestionPaperWithPosts
    | NotesWithPosts
    | SolutionsWithPosts
) {
  const new_resources = resources.map((resource) => {
    const rating = resource.votes.reduce(
      (total: number, vote: NotesVote) => (vote.value ? total + 1 : total - 1),
      0
    );
    return {
      ...resource,
      rating: rating,
    };
  });
  return new_resources;
}

export function getAvgDifficulty(
  resources: (QuestionPaper & {
    _count: {
      difficulties: number;
    };
    votes: QuestionPaperVote[];
    difficulties: QuestionPaperDifficulty[];
    rating: number;
  })[]
) {
  const new_resources = resources.map((resource) => {
    const difficulty = resource.difficulties.reduce(
      (total: number, difficulty: QuestionPaperDifficulty) =>
        total + difficulty.value,
      0
    );
    return {
      ...resource,
      difficulty:
        resource._count.difficulties !== 0
          ? difficulty / resource._count.difficulties
          : 0,
    };
  });
  return new_resources;
}

export async function getCheatsheetsWithPosts({
  resourceIdList,
  moduleCode,
  FilterSemester,
  FilterAcadYear,
  FilterExamType,
  userId,
  statusUserId,
  statusType,
}: {
  resourceIdList: string[] | undefined;
  moduleCode: string | undefined;
  FilterSemester: SemesterType | undefined;
  FilterAcadYear: string | undefined;
  FilterExamType: ExamType | undefined;
  userId: string | undefined;
  statusUserId: string | undefined;
  statusType: DashboardTabType | undefined;
}) {
  try {
    const resource = await prisma.cheatsheet.findMany({
      where: {
        ...(resourceIdList ? { id: { in: resourceIdList } } : {}),
        ...(moduleCode ? { moduleCode: moduleCode } : {}),
        ...(FilterSemester ? { semester: FilterSemester } : {}),
        ...(FilterAcadYear ? { acadYear: FilterAcadYear } : {}),
        ...(FilterExamType ? { type: FilterExamType } : {}),
        ...(userId ? { userId: userId } : {}),
        ...(statusUserId && statusType !== "Visited"
          ? {
              statuses: {
                some: {
                  userId: statusUserId,
                  ...(statusUserId && statusType ? { status: statusType } : {}),
                },
              },
            }
          : {}),
      },
      include: {
        votes: true,
      },
    });

    if (resourceIdList && statusType === "Visited") {
      resource.sort((a, b) => {
        return resourceIdList.indexOf(a.id) - resourceIdList.indexOf(b.id);
      });
    }

    return resource;
  } catch (error) {
    return [];
  }
}

export async function getQuestionPapersWithPosts({
  resourceIdList,
  moduleCode,
  FilterSemester,
  FilterAcadYear,
  FilterExamType,
  userId,
  statusUserId,
  statusType,
}: {
  resourceIdList: string[] | undefined;
  moduleCode: string | undefined;
  FilterSemester: SemesterType | undefined;
  FilterAcadYear: string | undefined;
  FilterExamType: ExamType | undefined;
  userId: string | undefined;
  statusUserId: string | undefined;
  statusType: DashboardTabType | undefined;
}) {
  try {
    const resource = await prisma.questionPaper.findMany({
      where: {
        ...(resourceIdList ? { id: { in: resourceIdList } } : {}),
        ...(moduleCode ? { moduleCode: moduleCode } : {}),
        ...(FilterSemester ? { semester: FilterSemester } : {}),
        ...(FilterAcadYear ? { acadYear: FilterAcadYear } : {}),
        ...(FilterExamType ? { type: FilterExamType } : {}),
        ...(userId ? { userId: userId } : {}),
        ...(statusUserId && statusType !== "Visited"
          ? {
              statuses: {
                some: {
                  userId: statusUserId,
                  ...(statusUserId && statusType ? { status: statusType } : {}),
                },
              },
            }
          : {}),
      },
      include: {
        votes: true,
        difficulties: true,
        _count: {
          select: { difficulties: true },
        },
      },
    });

    if (resourceIdList && statusType === "Visited") {
      resource.sort((a, b) => {
        return resourceIdList.indexOf(a.id) - resourceIdList.indexOf(b.id);
      });
    }

    return resource;
  } catch (error) {
    return [];
  }
}

export async function getNotesWithPosts({
  resourceIdList,
  moduleCode,
  FilterSemester,
  FilterAcadYear,
  userId,
  statusUserId,
  statusType,
}: {
  resourceIdList: string[] | undefined;
  moduleCode: string | undefined;
  FilterSemester: SemesterType | undefined;
  FilterAcadYear: string | undefined;
  userId: string | undefined;
  statusUserId: string | undefined;
  statusType: DashboardTabType | undefined;
}) {
  try {
    const resource = await prisma.notes.findMany({
      where: {
        ...(resourceIdList ? { id: { in: resourceIdList } } : {}),
        ...(moduleCode ? { moduleCode: moduleCode } : {}),
        ...(FilterSemester ? { semester: FilterSemester } : {}),
        ...(FilterAcadYear ? { acadYear: FilterAcadYear } : {}),
        ...(userId ? { userId: userId } : {}),
        ...(statusUserId && statusType !== "Visited"
          ? {
              statuses: {
                some: {
                  userId: statusUserId,
                  ...(statusUserId && statusType ? { status: statusType } : {}),
                },
              },
            }
          : {}),
      },
      include: {
        votes: true,
      },
    });

    if (resourceIdList && statusType === "Visited") {
      resource.sort((a, b) => {
        return resourceIdList.indexOf(a.id) - resourceIdList.indexOf(b.id);
      });
    }

    return resource;
  } catch (error) {
    return [];
  }
}

export async function getSolutionsWithPosts({
  resourceIdList,
  userId,
  questionPaperId,
  moduleCode,
  FilterSemester,
  FilterAcadYear,
  FilterExamType,
  statusUserId,
  statusType,
}: {
  resourceIdList: string[] | undefined;
  userId: string | undefined;
  questionPaperId: string | undefined;
  moduleCode: string | undefined;
  FilterSemester: SemesterType | undefined;
  FilterAcadYear: string | undefined;
  FilterExamType: ExamType | undefined;
  statusUserId: string | undefined;
  statusType: DashboardTabType | undefined;
}) {
  try {
    const resource = await prisma.solution.findMany({
      where: {
        ...(resourceIdList ? { id: { in: resourceIdList } } : {}),
        questionPaper: {
          ...(moduleCode ? { moduleCode: moduleCode } : {}),
          ...(FilterSemester ? { semester: FilterSemester } : {}),
          ...(FilterAcadYear ? { acadYear: FilterAcadYear } : {}),
          ...(FilterExamType ? { type: FilterExamType } : {}),
        },
        ...(statusUserId && statusType !== "Visited"
          ? {
              statuses: {
                some: {
                  userId: statusUserId,
                  ...(statusUserId && statusType ? { status: statusType } : {}),
                },
              },
            }
          : {}),
        ...(userId ? { userId: userId } : {}),
        ...(questionPaperId ? { questionPaperId: questionPaperId } : {}),
      },
      include: {
        votes: true,
        questionPaper: true,
      },
    });

    if (resourceIdList && statusType === "Visited") {
      resource.sort((a, b) => {
        return resourceIdList.indexOf(a.id) - resourceIdList.indexOf(b.id);
      });
    }

    return resource;
  } catch (error) {
    return [];
  }
}

export type SolutionsWithPosts = Prisma.PromiseReturnType<
  typeof getSolutionsWithPosts
>;

export type CheatsheetWithPosts = Prisma.PromiseReturnType<
  typeof getCheatsheetsWithPosts
>;

export type QuestionPaperWithPosts = Prisma.PromiseReturnType<
  typeof getQuestionPapersWithPosts
>;

export type NotesWithPosts = Prisma.PromiseReturnType<typeof getNotesWithPosts>;
