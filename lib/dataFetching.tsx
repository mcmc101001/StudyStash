import {
  ExamType,
  NotesVote,
  Prisma,
  QuestionPaper,
  QuestionPaperDifficulty,
  QuestionPaperVote,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";

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
  moduleCode,
  FilterSemester,
  FilterAcadYear,
  FilterExamType,
  userId,
}: {
  moduleCode: string | undefined;
  FilterSemester: string | undefined;
  FilterAcadYear: string | undefined;
  FilterExamType: ExamType | undefined;
  userId: string | undefined;
}) {
  try {
    const resource = await prisma.cheatsheet.findMany({
      where: {
        ...(moduleCode ? { moduleCode: moduleCode } : {}),
        ...(FilterSemester ? { semester: FilterSemester } : {}),
        ...(FilterAcadYear ? { acadYear: FilterAcadYear } : {}),
        ...(FilterExamType ? { type: FilterExamType } : {}),
        ...(userId ? { userId: userId } : {}),
      },
      include: {
        votes: true,
      },
    });
    return resource;
  } catch (error) {
    return [];
  }
}

export async function getQuestionPapersWithPosts({
  moduleCode,
  FilterSemester,
  FilterAcadYear,
  FilterExamType,
  userId,
}: {
  moduleCode: string | undefined;
  FilterSemester: string | undefined;
  FilterAcadYear: string | undefined;
  FilterExamType: ExamType | undefined;
  userId: string | undefined;
}) {
  try {
    const resource = await prisma.questionPaper.findMany({
      where: {
        ...(moduleCode ? { moduleCode: moduleCode } : {}),
        ...(FilterSemester ? { semester: FilterSemester } : {}),
        ...(FilterAcadYear ? { acadYear: FilterAcadYear } : {}),
        ...(FilterExamType ? { type: FilterExamType } : {}),
        ...(userId ? { userId: userId } : {}),
      },
      include: {
        votes: true,
        difficulties: true,
        _count: {
          select: { difficulties: true },
        },
      },
    });
    return resource;
  } catch (error) {
    return [];
  }
}

export async function getNotesWithPosts({
  moduleCode,
  FilterSemester,
  FilterAcadYear,
  userId,
}: {
  moduleCode: string | undefined;
  FilterSemester: string | undefined;
  FilterAcadYear: string | undefined;
  userId: string | undefined;
}) {
  try {
    const resource = await prisma.notes.findMany({
      where: {
        ...(moduleCode ? { moduleCode: moduleCode } : {}),
        ...(FilterSemester ? { semester: FilterSemester } : {}),
        ...(FilterAcadYear ? { acadYear: FilterAcadYear } : {}),
        ...(userId ? { userId: userId } : {}),
      },
      include: {
        votes: true,
      },
    });
    return resource;
  } catch (error) {
    return [];
  }
}

export async function getSolutionsWithPosts({
  userId,
  questionPaperId,
  moduleCode,
  FilterSemester,
  FilterAcadYear,
  FilterExamType,
}: {
  userId: string | undefined;
  questionPaperId: string | undefined;
  moduleCode: string | undefined;
  FilterSemester: string | undefined;
  FilterAcadYear: string | undefined;
  FilterExamType: ExamType | undefined;
}) {
  try {
    const resource = await prisma.solution.findMany({
      where: {
        questionPaper: {
          ...(moduleCode ? { moduleCode: moduleCode } : {}),
          ...(FilterSemester ? { semester: FilterSemester } : {}),
          ...(FilterAcadYear ? { acadYear: FilterAcadYear } : {}),
          ...(FilterExamType ? { type: FilterExamType } : {}),
        },
        ...(userId ? { userId: userId } : {}),
        ...(questionPaperId ? { questionPaperId: questionPaperId } : {}),
      },
      include: {
        votes: true,
        questionPaper: true,
      },
    });
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
