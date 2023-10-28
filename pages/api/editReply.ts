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

const editReplySchema = z.object({
  category: ResourceSolutionEnum,
  userId: z.string(),
  replyId: z.string(),
  content: z.string(),
});

export type editReplyType = z.infer<typeof editReplySchema>;

export default async function editReply(
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
  if (!isValidBody(req.body, editReplySchema)) {
    return res.status(400).json({ message: "Invalid request body" });
  }
  if (session.user.id !== req.body.userId) {
    res.status(401).json({ message: "You are not authorized." });
    return;
  }
  try {
    let { category, replyId, userId, content } = req.body;
    let reply:
      | CheatsheetReply
      | QuestionPaperReply
      | NotesReply
      | SolutionReply;
    if (category === "Cheatsheets") {
      let validateComment = await prisma.cheatsheetReply.findFirst({
        where: {
          id: replyId,
        },
      });
      if (validateComment?.userId !== userId) {
        return res.status(401).json({ message: "You are not authorized." });
      }
      reply = await prisma.cheatsheetReply.update({
        where: {
          id: replyId,
        },
        data: {
          content: content,
          isEdited: true,
        },
      });
    } else if (category === "Past Papers") {
      let validateComment = await prisma.questionPaperReply.findFirst({
        where: {
          id: replyId,
        },
      });
      if (validateComment?.userId !== userId) {
        return res.status(401).json({ message: "You are not authorized." });
      }
      reply = await prisma.questionPaperReply.update({
        where: {
          id: replyId,
        },
        data: {
          content: content,
          isEdited: true,
        },
      });
    } else if (category === "Notes") {
      let validateComment = await prisma.notesReply.findFirst({
        where: {
          id: replyId,
        },
      });
      if (validateComment?.userId !== userId) {
        return res.status(401).json({ message: "You are not authorized." });
      }
      reply = await prisma.notesReply.update({
        where: {
          id: replyId,
        },
        data: {
          content: content,
          isEdited: true,
        },
      });
    } else if (category === "Solutions") {
      let validateComment = await prisma.solutionReply.findFirst({
        where: {
          id: replyId,
        },
      });
      if (validateComment?.userId !== userId) {
        return res.status(401).json({ message: "You are not authorized." });
      }
      reply = await prisma.solutionReply.update({
        where: {
          id: replyId,
        },
        data: {
          content: content,
          isEdited: true,
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
