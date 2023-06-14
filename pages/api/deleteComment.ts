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

const deleteCommentSchema = z.object({
  category: ResourceSolutionEnum,
  userId: z.string(),
  commentId: z.string(),
});

export type deleteCommentType = z.infer<typeof deleteCommentSchema>;

function isValidBody(body: any): body is deleteCommentType {
  const { success } = deleteCommentSchema.safeParse(body);
  return success;
}

export default async function deleteComment(
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
    let { category, commentId } = req.body;
    let comment:
      | CheatsheetComment
      | QuestionPaperComment
      | NotesComment
      | SolutionComment;
    if (category === "Cheatsheets") {
      // comment = await prisma.cheatsheetComment.update({
      //   where: {
      //     id: commentId,
      //   },
      //   data: {
      //     content: "This comment has been deleted.",
      //   },
      // });
      comment = await prisma.cheatsheetComment.delete({
        where: {
          id: commentId,
        },
      });
    } else if (category === "Past Papers") {
      // comment = await prisma.questionPaperComment.update({
      //   where: {
      //     id: commentId,
      //   },
      //   data: {
      //     content: "This comment has been deleted.",
      //   },
      // });
      comment = await prisma.questionPaperComment.delete({
        where: {
          id: commentId,
        },
      });
    } else if (category === "Notes") {
      // comment = await prisma.notesComment.update({
      //   where: {
      //     id: commentId,
      //   },
      //   data: {
      //     content: "This comment has been deleted.",
      //   },
      // });
      comment = await prisma.notesComment.delete({
        where: {
          id: commentId,
        },
      });
    } else if (category === "Solutions") {
      // comment = await prisma.solutionComment.update({
      //   where: {
      //     id: commentId,
      //   },
      //   data: {
      //     content: "This comment has been deleted.",
      //   },
      // });
      comment = await prisma.solutionComment.delete({
        where: {
          id: commentId,
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
