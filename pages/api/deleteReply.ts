import { authOptions } from "@/lib/auth";
import { ResourceSolutionEnum } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import {
  CheatsheetReply,
  QuestionPaperReply,
  NotesReply,
  SolutionReply,
} from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import z from "zod";
import { isValidBody } from "@/lib/utils";

const deleteReplySchema = z.object({
  category: ResourceSolutionEnum,
  userId: z.string(),
  replyId: z.string(),
});

export type deleteReplyType = z.infer<typeof deleteReplySchema>;

export default async function deleteReply(
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
  if (!isValidBody(req.body, deleteReplySchema)) {
    return res.status(400).json({ message: "Invalid request body" });
  }
  if (session.user.id !== req.body.userId) {
    res.status(401).json({ message: "You are not authorized." });
    return;
  }
  try {
    let { category, replyId, userId } = req.body;
    let reply:
      | CheatsheetReply
      | QuestionPaperReply
      | NotesReply
      | SolutionReply;
    if (category === "Cheatsheets") {
      let validateReply = await prisma.cheatsheetReply.findUnique({
        where: {
          id: replyId,
        },
      });
      if (validateReply?.userId !== userId) {
        return res.status(401).json({ message: "You are not authorized." });
      }
      reply = await prisma.cheatsheetReply.update({
        where: {
          id: replyId,
        },
        data: {
          isDeleted: true,
        },
      });
    } else if (category === "Past Papers") {
      let validateReply = await prisma.questionPaperReply.findUnique({
        where: {
          id: replyId,
        },
      });
      if (validateReply?.userId !== userId) {
        return res.status(401).json({ message: "You are not authorized." });
      }
      reply = await prisma.questionPaperReply.update({
        where: {
          id: replyId,
        },
        data: {
          isDeleted: true,
        },
      });
    } else if (category === "Notes") {
      let validateReply = await prisma.notesReply.findUnique({
        where: {
          id: replyId,
        },
      });
      if (validateReply?.userId !== userId) {
        return res.status(401).json({ message: "You are not authorized." });
      }
      reply = await prisma.notesReply.update({
        where: {
          id: replyId,
        },
        data: {
          isDeleted: true,
        },
      });
    } else if (category === "Solutions") {
      let validateReply = await prisma.solutionReply.findUnique({
        where: {
          id: replyId,
        },
      });
      if (validateReply?.userId !== userId) {
        return res.status(401).json({ message: "You are not authorized." });
      }
      reply = await prisma.solutionReply.update({
        where: {
          id: replyId,
        },
        data: {
          isDeleted: true,
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
