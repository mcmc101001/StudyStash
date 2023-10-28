import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import {
  CheatsheetReport,
  QuestionPaperReport,
  NotesReport,
  ResourceReportType,
} from "@prisma/client";
import { ResourceEnum } from "@/lib/content";
import z from "zod";
import { isValidBody } from "@/lib/utils";

const addResourceReportSchema = z.object({
  category: ResourceEnum,
  reporterId: z.string(),
  resourceId: z.string(),
  reportType: z.nativeEnum(ResourceReportType),
});

export type addResourceReportType = z.infer<typeof addResourceReportSchema>;

export default async function addResourceReport(
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
  if (!isValidBody(req.body, addResourceReportSchema)) {
    return res.status(400).json({ message: "Invalid request body" });
  }
  if (session.user.id !== req.body.reporterId) {
    res.status(401).json({ message: "You are not authorized." });
    return;
  }

  let checkRepeat;
  if (req.body.category === "Cheatsheets") {
    checkRepeat = await prisma.cheatsheetReport.findFirst({
      where: {
        resourceId: req.body.resourceId,
        type: req.body.reportType,
      },
    });
  } else if (req.body.category === "Past Papers") {
    checkRepeat = await prisma.questionPaperReport.findFirst({
      where: {
        resourceId: req.body.resourceId,
        type: req.body.reportType,
      },
    });
  } else if (req.body.category === "Notes") {
    checkRepeat = await prisma.notesReport.findFirst({
      where: {
        resourceId: req.body.resourceId,
        type: req.body.reportType,
      },
    });
  } else {
    return res.status(400).json({ message: "Invalid category" });
  }
  if (checkRepeat !== null) {
    return res.status(200).json({ message: "Repeated report." });
  }

  try {
    let { category, reporterId, resourceId, reportType } = req.body;
    let report: CheatsheetReport | QuestionPaperReport | NotesReport;
    if (category === "Cheatsheets") {
      report = await prisma.cheatsheetReport.create({
        data: {
          userId: reporterId,
          type: reportType,
          resourceId: resourceId,
        },
      });
    } else if (category === "Past Papers") {
      report = await prisma.questionPaperReport.create({
        data: {
          userId: reporterId,
          type: reportType,
          resourceId: resourceId,
        },
      });
    } else if (category === "Notes") {
      report = await prisma.notesReport.create({
        data: {
          userId: reporterId,
          type: reportType,
          resourceId: resourceId,
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
