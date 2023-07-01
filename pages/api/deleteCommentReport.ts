import { authOptions } from "@/lib/auth";
import { CommentReportEnum } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import z from "zod";

const deleteCommentReportSchema = z.object({
  category: CommentReportEnum,
  reportId: z.string(),
});

export type deleteCommentReportType = z.infer<typeof deleteCommentReportSchema>;

function isValidBody(body: any): body is deleteCommentReportType {
  const { success } = deleteCommentReportSchema.safeParse(body);
  return success;
}

export default async function deleteCommentReport(
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
  } else {
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });
    if (!user || !user.verified) {
      res.status(401).json({ message: "Invalid user credentials." });
      return;
    }
  }
  if (!isValidBody(req.body)) {
    return res.status(400).json({ message: "Invalid request body" });
  }

  try {
    let { category, reportId } = req.body;

    let report;
    if (category === "cheatsheetCommentReport") {
      report = await prisma.cheatsheetCommentReport.delete({
        where: {
          id: reportId,
        },
      });
    } else if (category === "questionPaperCommentReport") {
      report = await prisma.questionPaperCommentReport.delete({
        where: {
          id: reportId,
        },
      });
    } else if (category === "notesCommentReport") {
      report = await prisma.notesCommentReport.delete({
        where: {
          id: reportId,
        },
      });
    } else if (category === "solutionCommentReport") {
      report = await prisma.solutionCommentReport.delete({
        where: {
          id: reportId,
        },
      });
    } else if (category === "cheatsheetReplyReport") {
      report = await prisma.cheatsheetReplyReport.delete({
        where: {
          id: reportId,
        },
      });
    } else if (category === "questionPaperReplyReport") {
      report = await prisma.questionPaperReplyReport.delete({
        where: {
          id: reportId,
        },
      });
    } else if (category === "notesReplyReport") {
      report = await prisma.notesReplyReport.delete({
        where: {
          id: reportId,
        },
      });
    } else if (category === "solutionReplyReport") {
      report = await prisma.solutionReplyReport.delete({
        where: {
          id: reportId,
        },
      });
    } else {
      res.status(400).json({ message: "Invalid report category" });
    }

    res.status(200).json({ report });
  } catch (error) {
    res.status(500).json({ message: "Report deletion failed" });
  }
}
