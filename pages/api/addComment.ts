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

const addCommentSchema = z.object({
  category: ResourceSolutionEnum,
  userId: z.string(),
  resourceId: z.string(),
  content: z.string(),
});

export type addCommentType = z.infer<typeof addCommentSchema>;

function isValidBody(body: any): body is addCommentType {
  const { success } = addCommentSchema.safeParse(body);
  return success;
}

export default async function addComment(
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
    let { category, resourceId, userId, content } = req.body;
    let comment:
      | CheatsheetComment
      | QuestionPaperComment
      | NotesComment
      | SolutionComment;
    if (category === "Cheatsheets") {
      comment = await prisma.cheatsheetComment.create({
        data: {
          content: content,
          resourceId: resourceId,
          userId: userId,
        },
      });
    } else if (category === "Past Papers") {
      comment = await prisma.questionPaperComment.create({
        data: {
          content: content,
          resourceId: resourceId,
          userId: userId,
        },
      });
    } else if (category === "Notes") {
      comment = await prisma.notesComment.create({
        data: {
          content: content,
          resourceId: resourceId,
          userId: userId,
        },
      });
    } else if (category === "Solutions") {
      comment = await prisma.solutionComment.create({
        data: {
          content: content,
          resourceId: resourceId,
          userId: userId,
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
