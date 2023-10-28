import { authOptions } from "@/lib/auth";
import { ResourceSolutionEnum } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import {
  CheatsheetReply,
  NotesReply,
  QuestionPaperReply,
  SolutionReply,
} from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import z from "zod";
import { isValidBody } from "@/lib/utils";

const addReplySchema = z.object({
  category: ResourceSolutionEnum,
  userId: z.string(),
  commentId: z.string(),
  content: z.string(),
});

export type addReplyType = z.infer<typeof addReplySchema>;

export default async function addReply(
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
  if (!isValidBody(req.body, addReplySchema)) {
    return res.status(400).json({ message: "Invalid request body" });
  }
  if (session.user.id !== req.body.userId) {
    res.status(401).json({ message: "You are not authorized." });
    return;
  }
  try {
    let { category, userId, commentId, content } = req.body;
    let reply:
      | CheatsheetReply
      | QuestionPaperReply
      | NotesReply
      | SolutionReply;
    if (category === "Cheatsheets") {
      reply = await prisma.cheatsheetReply.create({
        data: {
          content: content,
          userId: userId,
          commentId: commentId,
        },
      });
    } else if (category === "Past Papers") {
      reply = await prisma.questionPaperReply.create({
        data: {
          content: content,
          userId: userId,
          commentId: commentId,
        },
      });
    } else if (category === "Notes") {
      reply = await prisma.notesReply.create({
        data: {
          content: content,
          userId: userId,
          commentId: commentId,
        },
      });
    } else if (category === "Solutions") {
      reply = await prisma.solutionReply.create({
        data: {
          content: content,
          userId: userId,
          commentId: commentId,
        },
      });
    } else {
      return res.status(400).json({ message: "Invalid category" });
    }
    res.status(200).json({ reply });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
}
