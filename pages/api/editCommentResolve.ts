import { authOptions } from "@/lib/auth";
import { CommentReportEnum } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import z from "zod";

const editCommentResolvedSchema = z.object({
  category: CommentReportEnum,
  reportId: z.string(),
  setResolved: z.boolean(),
});

export type editCommentResolvedType = z.infer<typeof editCommentResolvedSchema>;

function isValidBody(body: any): body is editCommentResolvedType {
  const { success } = editCommentResolvedSchema.safeParse(body);
  return success;
}

export default async function addReport(
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
    let { category, reportId, setResolved } = req.body;

    let report;
    if (category === "cheatsheetCommentReport") {
      report = await prisma.cheatsheetCommentReport.update({
        where: {
          id: reportId,
        },
        data: {
          resolved: setResolved,
        },
      });
    } else if (category === "questionPaperCommentReport") {
      report = await prisma.questionPaperCommentReport.update({
        where: {
          id: reportId,
        },
        data: {
          resolved: setResolved,
        },
      });
    } else if (category === "notesCommentReport") {
      report = await prisma.notesCommentReport.update({
        where: {
          id: reportId,
        },
        data: {
          resolved: setResolved,
        },
      });
    } else if (category === "solutionCommentReport") {
      report = await prisma.solutionCommentReport.update({
        where: {
          id: reportId,
        },
        data: {
          resolved: setResolved,
        },
      });
    } else if (category === "cheatsheetReplyReport") {
      report = await prisma.cheatsheetReplyReport.update({
        where: {
          id: reportId,
        },
        data: {
          resolved: setResolved,
        },
      });
    } else if (category === "questionPaperReplyReport") {
      report = await prisma.questionPaperReplyReport.update({
        where: {
          id: reportId,
        },
        data: {
          resolved: setResolved,
        },
      });
    } else if (category === "notesReplyReport") {
      report = await prisma.notesReplyReport.update({
        where: {
          id: reportId,
        },
        data: {
          resolved: setResolved,
        },
      });
    } else if (category === "solutionReplyReport") {
      report = await prisma.solutionReplyReport.update({
        where: {
          id: reportId,
        },
        data: {
          resolved: setResolved,
        },
      });
    } else {
      res.status(400).json({ message: "Invalid report category" });
    }

    res.status(200).json({ report });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
}
