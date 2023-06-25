import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { CommentReportType } from "@prisma/client";
import z from "zod";

const addCommentReportSchema = z.object({
  category: z.string(),
  reporterId: z.string(),
  commentId: z.string(),
  reportType: z.nativeEnum(CommentReportType),
});

export type addCommentReportType = z.infer<typeof addCommentReportSchema>;

function isValidBody(body: any): body is addCommentReportType {
  const { success } = addCommentReportSchema.safeParse(body);
  return success;
}

export default async function addCommentReport(
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
  if (session.user.id !== req.body.reporterId) {
    res.status(401).json({ message: "You are not authorized." });
    return;
  }

  let checkRepeat;
  if (req.body.category === "cheatsheetCommentReport") {
    checkRepeat = await prisma.cheatsheetCommentReport.findFirst({
      where: {
        userId: req.body.reporterId,
        commentId: req.body.commentId,
        type: req.body.reportType,
        resolved: false,
      },
    });
  } else if (req.body.category === "questionPaperCommentReport") {
    checkRepeat = await prisma.questionPaperCommentReport.findFirst({
      where: {
        userId: req.body.reporterId,
        commentId: req.body.commentId,
        type: req.body.reportType,
        resolved: false,
      },
    });
  } else if (req.body.category === "notesCommentReport") {
    checkRepeat = await prisma.notesCommentReport.findFirst({
      where: {
        userId: req.body.reporterId,
        commentId: req.body.commentId,
        type: req.body.reportType,
        resolved: false,
      },
    });
  } else if (req.body.category === "solutionCommentReport") {
    checkRepeat = await prisma.solutionCommentReport.findFirst({
      where: {
        userId: req.body.reporterId,
        commentId: req.body.commentId,
        type: req.body.reportType,
        resolved: false,
      },
    });
  } else if (req.body.category === "cheatsheetReplyReport") {
    checkRepeat = await prisma.cheatsheetReplyReport.findFirst({
      where: {
        userId: req.body.reporterId,
        commentId: req.body.commentId,
        type: req.body.reportType,
        resolved: false,
      },
    });
  } else if (req.body.category === "questionPaperReplyReport") {
    checkRepeat = await prisma.questionPaperReplyReport.findFirst({
      where: {
        userId: req.body.reporterId,
        commentId: req.body.commentId,
        type: req.body.reportType,
        resolved: false,
      },
    });
  } else if (req.body.category === "notesReplyReport") {
    checkRepeat = await prisma.notesReplyReport.findFirst({
      where: {
        userId: req.body.reporterId,
        commentId: req.body.commentId,
        type: req.body.reportType,
        resolved: false,
      },
    });
  } else if (req.body.category === "solutionReplyReport") {
    checkRepeat = await prisma.solutionReplyReport.findFirst({
      where: {
        userId: req.body.reporterId,
        commentId: req.body.commentId,
        type: req.body.reportType,
        resolved: false,
      },
    });
  } else {
    return res.status(400).json({ message: "Invalid category" });
  }
  if (checkRepeat !== null) {
    return res.status(419).json({ message: "Repeated report." });
  }

  try {
    let { category, reporterId, commentId, reportType } = req.body;

    let report;
    if (category === "cheatsheetCommentReport") {
      report = await prisma.cheatsheetCommentReport.create({
        data: {
          userId: reporterId,
          type: reportType,
          commentId: commentId,
        },
      });
    } else if (category === "questionPaperCommentReport") {
      report = await prisma.questionPaperCommentReport.create({
        data: {
          userId: reporterId,
          type: reportType,
          commentId: commentId,
        },
      });
    } else if (category === "notesCommentReport") {
      report = await prisma.notesCommentReport.create({
        data: {
          userId: reporterId,
          type: reportType,
          commentId: commentId,
        },
      });
    } else if (category === "solutionCommentReport") {
      report = await prisma.solutionCommentReport.create({
        data: {
          userId: reporterId,
          type: reportType,
          commentId: commentId,
        },
      });
    } else if (category === "cheatsheetReplyReport") {
      report = await prisma.cheatsheetReplyReport.create({
        data: {
          userId: reporterId,
          type: reportType,
          commentId: commentId,
        },
      });
    } else if (category === "questionPaperReplyReport") {
      report = await prisma.questionPaperReplyReport.create({
        data: {
          userId: reporterId,
          type: reportType,
          commentId: commentId,
        },
      });
    } else if (category === "notesReplyReport") {
      report = await prisma.notesReplyReport.create({
        data: {
          userId: reporterId,
          type: reportType,
          commentId: commentId,
        },
      });
    } else if (category === "solutionReplyReport") {
      report = await prisma.solutionReplyReport.create({
        data: {
          userId: reporterId,
          type: reportType,
          commentId: commentId,
        },
      });
    } else {
      return res.status(400).json({ message: "Invalid category" });
    }
    res.status(200).json({ report });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
}
