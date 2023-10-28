import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import {
  Cheatsheet,
  ExamType,
  Notes,
  QuestionPaper,
  SemesterType,
} from "@prisma/client";
import { ResourceEnum } from "@/lib/content";
import { isValidBody } from "@/lib/utils";
import z from "zod";

const addPDFSchema = z.object({
  name: z.string(),
  acadYear: z.string(),
  semester: z.nativeEnum(SemesterType),
  moduleCode: z.string(),
  examType: z.nativeEnum(ExamType).optional(),
  userId: z.string(),
  solutionIncluded: z.boolean().optional(),
  resourceType: ResourceEnum,
});

export type addPDFType = z.infer<typeof addPDFSchema>;

export default async function addPDF(
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
  if (!isValidBody(req.body, addPDFSchema)) {
    return res.status(400).json({ message: "Invalid request body" });
  }
  if (session.user.id !== req.body.userId) {
    res.status(401).json({ message: "You are not authorized." });
    return;
  }
  try {
    let {
      name,
      acadYear,
      semester,
      userId,
      moduleCode,
      examType,
      resourceType,
      solutionIncluded,
    } = req.body;
    let PDFentry: Cheatsheet | QuestionPaper | Notes;
    if (resourceType === "Cheatsheets") {
      if (examType === undefined) {
        res.status(400).json({ message: "Invalid request" });
      } else {
        PDFentry = await prisma.cheatsheet.create({
          data: {
            acadYear: acadYear,
            semester: semester,
            userId: userId,
            moduleCode: moduleCode,
            type: examType,
            name: name,
          },
        });
        res.status(200).json({ PDFentry });
      }
    } else if (resourceType === "Past Papers") {
      if (examType === undefined) {
        res.status(400).json({ message: "Invalid request" });
      } else {
        PDFentry = await prisma.questionPaper.create({
          data: {
            acadYear: acadYear,
            semester: semester,
            userId: userId,
            moduleCode: moduleCode,
            type: examType,
            name: name,
            solutionIncluded: solutionIncluded,
          },
        });
        res.status(200).json({ PDFentry });
      }
    } else if (resourceType === "Notes") {
      PDFentry = await prisma.notes.create({
        data: {
          acadYear: acadYear,
          semester: semester,
          userId: userId,
          moduleCode: moduleCode,
          name: name,
        },
      });
      res.status(200).json({ PDFentry });
    } else {
      res.status(400).json({ message: "Invalid request" });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
}
