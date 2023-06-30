import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CommentReportType } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { CommentReportEnum } from "@/lib/content";
import z from "zod";

const updateCommentDataSchema = z.object({
  type: z.nativeEnum(CommentReportType),
  category: CommentReportEnum,
  authorId: z.string(),
  commentId: z.string(),
  newData: z.string().optional(),
});

export type updateCommentDataType = z.infer<typeof updateCommentDataSchema>;

function isValidBody(body: any): body is updateCommentDataType {
  const { success } = updateCommentDataSchema.safeParse(body);
  return success;
}

export default async function updateCommentData(
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

  try {
    let report = req.body;
    let comment;

    if (report.type === "inappropriateUsername") {
      comment = await prisma.user.update({
        where: {
          id: report.authorId,
        },
        data: {
          name: report.newData,
        },
      });
    } else if (report.type === "spam" || report.type === "harassment") {
      if (report.category === "cheatsheetCommentReport") {
        comment = await prisma.cheatsheetComment.delete({
          where: {
            id: report.commentId,
          },
        });
      } else if (report.category === "questionPaperCommentReport") {
        comment = await prisma.questionPaperComment.delete({
          where: {
            id: report.commentId,
          },
        });
      } else if (report.category === "notesCommentReport") {
        comment = await prisma.notesComment.delete({
          where: {
            id: report.commentId,
          },
        });
      } else if (report.category === "solutionCommentReport") {
        comment = await prisma.solutionComment.delete({
          where: {
            id: report.commentId,
          },
        });
      } else if (report.category === "cheatsheetReplyReport") {
        comment = await prisma.cheatsheetReply.delete({
          where: {
            id: report.commentId,
          },
        });
      } else if (report.category === "questionPaperReplyReport") {
        comment = await prisma.questionPaperReply.delete({
          where: {
            id: report.commentId,
          },
        });
      } else if (report.category === "notesReplyReport") {
        comment = await prisma.notesReply.delete({
          where: {
            id: report.commentId,
          },
        });
      } else if (report.category === "solutionReplyReport") {
        comment = await prisma.solutionReply.delete({
          where: {
            id: report.commentId,
          },
        });
      } else {
        res.status(400).json({ message: "Invalid report category" });
      }
    } else {
      res.status(400).json({ message: "Invalid report type" });
    }

    res.status(200).json({ comment });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
}
