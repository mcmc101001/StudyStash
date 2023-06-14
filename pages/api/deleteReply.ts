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

const deleteReplySchema = z.object({
  category: ResourceSolutionEnum,
  userId: z.string(),
  replyId: z.string(),
});

export type deleteReplyType = z.infer<typeof deleteReplySchema>;

function isValidBody(body: any): body is deleteReplyType {
  const { success } = deleteReplySchema.safeParse(body);
  return success;
}

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
  if (!isValidBody(req.body)) {
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
      // reply = await prisma.cheatsheetReply.update({
      //   where: {
      //     id: replyId,
      //   },
      //   data: {
      //     content: "This comment has been deleted.",
      //   },
      // });
      let validateReply = await prisma.cheatsheetReply.findUnique({
        where: {
          id: replyId,
        },
      });
      if (validateReply?.userId !== userId) {
        return res.status(401).json({ message: "You are not authorized." });
      }
      reply = await prisma.cheatsheetReply.delete({
        where: {
          id: replyId,
        },
      });
    } else if (category === "Past Papers") {
      // reply = await prisma.questionPaperReply.update({
      //   where: {
      //     id: replyId,
      //   },
      //   data: {
      //     content: "This comment has been deleted.",
      //   },
      // });
      let validateReply = await prisma.questionPaperReply.findUnique({
        where: {
          id: replyId,
        },
      });
      if (validateReply?.userId !== userId) {
        return res.status(401).json({ message: "You are not authorized." });
      }
      reply = await prisma.questionPaperReply.delete({
        where: {
          id: replyId,
        },
      });
    } else if (category === "Notes") {
      // reply = await prisma.notesReply.update({
      //   where: {
      //     id: replyId,
      //   },
      //   data: {
      //     content: "This comment has been deleted.",
      //   },
      // });
      let validateReply = await prisma.notesReply.findUnique({
        where: {
          id: replyId,
        },
      });
      if (validateReply?.userId !== userId) {
        return res.status(401).json({ message: "You are not authorized." });
      }
      reply = await prisma.notesReply.delete({
        where: {
          id: replyId,
        },
      });
    } else if (category === "Solutions") {
      // reply = await prisma.solutionReply.update({
      //   where: {
      //     id: replyId,
      //   },
      //   data: {
      //     content: "This comment has been deleted.",
      //   },
      // });
      let validateReply = await prisma.solutionReply.findUnique({
        where: {
          id: replyId,
        },
      });
      if (validateReply?.userId !== userId) {
        return res.status(401).json({ message: "You are not authorized." });
      }
      reply = await prisma.solutionReply.delete({
        where: {
          id: replyId,
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
