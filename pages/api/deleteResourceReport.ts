import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import {
  CheatsheetReport,
  QuestionPaperReport,
  NotesReport,
} from "@prisma/client";
import { ResourceEnum } from "@/lib/content";
import z from "zod";

const deleteResourceReportSchema = z.object({
  category: ResourceEnum,
  reportId: z.string(),
});

export type deleteResourceReportType = z.infer<
  typeof deleteResourceReportSchema
>;

function isValidBody(body: any): body is deleteResourceReportType {
  const { success } = deleteResourceReportSchema.safeParse(body);
  return success;
}

export default async function deleteResourceReport(
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
    let report: CheatsheetReport | QuestionPaperReport | NotesReport;
    if (category === "Cheatsheets") {
      report = await prisma.cheatsheetReport.delete({
        where: {
          id: reportId,
        },
      });
    } else if (category === "Past Papers") {
      report = await prisma.questionPaperReport.delete({
        where: {
          id: reportId,
        },
      });
    } else if (category === "Notes") {
      report = await prisma.notesReport.delete({
        where: {
          id: reportId,
        },
      });
    } else {
      return res.status(400).json({ message: "Invalid category" });
    }

    res.status(200).json({ report });
  } catch (error) {
    res.status(500).json({ message: "Report deletion failed" });
  }
}
