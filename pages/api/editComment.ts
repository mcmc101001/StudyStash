import { authOptions } from "@/lib/auth";
import { ResourceSolutionEnum } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import {
  CheatsheetComment,
  NotesComment,
  QuestionPaperComment,
  SolutionComment,
} from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import z from "zod";

const editCommentSchema = z.object({
  category: ResourceSolutionEnum,
  userId: z.string(),
  commentId: z.string(),
  content: z.string(),
});

export type editCommentType = z.infer<typeof editCommentSchema>;

function isValidBody(body: any): body is editCommentType {
  const { success } = editCommentSchema.safeParse(body);
  return success;
}

export default async function editComment(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }
  if (!isValidBody(req.body)) {
    return res.status(400).json({ message: "Invalid request body" });
  }
  if (session.user.id !== req.body.userId) {
    res.status(401).json({ message: "You are not authorized." });
    return;
  }
  try {
    let { category, commentId, userId, content } = req.body;
    let comment:
      | CheatsheetComment
      | QuestionPaperComment
      | NotesComment
      | SolutionComment;
    if (category === "Cheatsheets") {
      let validateComment = await prisma.cheatsheetComment.findFirst({
        where: {
          id: commentId,
        },
      });
      if (validateComment?.userId !== userId) {
        return res.status(401).json({ message: "You are not authorized." });
      }
      comment = await prisma.cheatsheetComment.update({
        where: {
          id: commentId,
        },
        data: {
          content: content,
        },
      });
    } else if (category === "Past Papers") {
      let validateComment = await prisma.questionPaperComment.findFirst({
        where: {
          id: commentId,
        },
      });
      if (validateComment?.userId !== userId) {
        return res.status(401).json({ message: "You are not authorized." });
      }
      comment = await prisma.questionPaperComment.update({
        where: {
          id: commentId,
        },
        data: {
          content: content,
        },
      });
    } else if (category === "Notes") {
      let validateComment = await prisma.notesComment.findFirst({
        where: {
          id: commentId,
        },
      });
      if (validateComment?.userId !== userId) {
        return res.status(401).json({ message: "You are not authorized." });
      }
      comment = await prisma.notesComment.update({
        where: {
          id: commentId,
        },
        data: {
          content: content,
        },
      });
    } else if (category === "Solutions") {
      let validateComment = await prisma.solutionComment.findFirst({
        where: {
          id: commentId,
        },
      });
      if (validateComment?.userId !== userId) {
        return res.status(401).json({ message: "You are not authorized." });
      }
      comment = await prisma.solutionComment.update({
        where: {
          id: commentId,
        },
        data: {
          content: content,
        },
      });
    } else {
      return res.status(400).json({ message: "Invalid category" });
    }
    res.status(200).json({ comment });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
}
