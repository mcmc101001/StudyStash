import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { SubmitType } from "@/components/ContributeForm";
import { ExamType } from "@prisma/client";

export interface addPDFType {
    name: string;
    acadYear: string;
    semester: string;
    moduleCode: string;
    examType: ExamType;
    userID: string;
    submitType: SubmitType;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("API CALL ADDPDF!")
  if (req.method != "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
      res.status(401).json({ message: "You must be logged in." });
      return;
  }
  try {
    let { name, acadYear, semester, userID, moduleCode, examType, submitType } = req.body as addPDFType;
    if (submitType === "Cheatsheet") {
      const PDFentry = await prisma.cheatsheet.create({
        data: {
          acadYear: acadYear,
          semester: semester,
          userId: userID,
          moduleCode: moduleCode,
          type: examType,
          name: name,
        }
      })
      res.status(200).json({ PDFentry });
    }
    else if (submitType === "Past Papers") {
      const PDFentry = await prisma.questionPaper.create({
        data: {
          acadYear: acadYear,
          semester: semester,
          userId: userID,
          moduleCode: moduleCode,
          type: examType,
          name: name,
        }
      })
      res.status(200).json({ PDFentry });
    }
    else if (submitType === "Notes") {
      const PDFentry = await prisma.notes.create({
        data: {
          acadYear: acadYear,
          semester: semester,
          userId: userID,
          moduleCode: moduleCode,
          name: name,
        }
      })
      res.status(200).json({ PDFentry });
    }
    else {
      res.status(400).json({ message: "Invalid request" });
    }
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
  }
}