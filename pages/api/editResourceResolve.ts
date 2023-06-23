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
import { ResourceEnum, ResourceType } from "@/lib/content";
import z from "zod";

const editResourceResolvedSchema = z.object({
  // userId: z.string(),
  category: ResourceEnum,
  reportId: z.string(),
  setResolved: z.boolean(),
});

export type editResourceResolvedType = z.infer<
  typeof editResourceResolvedSchema
>;

function isValidBody(body: any): body is editResourceResolvedType {
  const { success } = editResourceResolvedSchema.safeParse(body);
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
  // if (session.user.id !== req.body.userId) {
  //   res.status(401).json({ message: "You are not authorized." });
  //   return;
  // }

  try {
    let { category, reportId, setResolved } = req.body;
    let report: CheatsheetReport | QuestionPaperReport | NotesReport;
    if (category === "Cheatsheets") {
      let temp = await prisma.cheatsheetReport.update({
        where: {
          id: reportId,
        },
        data: {
          resolved: setResolved,
        },
      });

      if (temp) {
        report = temp;
      } else {
        return res.status(400).json({ message: "Invalid report id" });
      }
    } else if (category === "Past Papers") {
      let temp = await prisma.questionPaperReport.update({
        where: {
          id: reportId,
        },
        data: {
          resolved: setResolved,
        },
      });

      if (temp) {
        report = temp;
      } else {
        return res.status(400).json({ message: "Invalid report id" });
      }
    } else if (category === "Notes") {
      let temp = await prisma.notesReport.update({
        where: {
          id: reportId,
        },
        data: {
          resolved: setResolved,
        },
      });

      if (temp) {
        report = temp;
      } else {
        return res.status(400).json({ message: "Invalid report id" });
      }
    } else {
      return res.status(400).json({ message: "Invalid category" });
    }

    res.status(200).json({ report });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
}
