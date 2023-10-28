import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { ResourceSolutionEnum } from "@/lib/content";
import z from "zod";
import { isValidBody } from "@/lib/utils";

const deletePDFSchema = z.object({
  userId: z.string(),
  id: z.string(),
  category: ResourceSolutionEnum,
});

export type deletePDFType = z.infer<typeof deletePDFSchema>;

export default async function deletePDF(
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
  if (!isValidBody(req.body, deletePDFSchema)) {
    return res.status(400).json({ message: "Invalid request body" });
  }
  if (session.user.id !== req.body.userId) {
    res.status(401).json({ message: "You are not authorized." });
    return;
  }
  try {
    let { id, category, userId } = req.body;
    // ensure authenticated user is the owner of the PDF
    if (category === "Cheatsheets") {
      let validateResource = await prisma.cheatsheet.findUnique({
        where: {
          id: id,
        },
      });
      if (validateResource?.userId !== userId) {
        return res.status(401).json({ message: "You are not authorized." });
      }
      const PDFentry = await prisma.cheatsheet.delete({
        where: {
          id: id,
        },
      });
      res.status(200).json({ PDFentry });
    } else if (category === "Past Papers") {
      let validateResource = await prisma.questionPaper.findUnique({
        where: {
          id: id,
        },
      });
      if (validateResource?.userId !== userId) {
        return res.status(401).json({ message: "You are not authorized." });
      }
      const PDFentry = await prisma.questionPaper.delete({
        where: {
          id: id,
        },
      });
      res.status(200).json({ PDFentry });
    } else if (category === "Notes") {
      let validateResource = await prisma.notes.findUnique({
        where: {
          id: id,
        },
      });
      if (validateResource?.userId !== userId) {
        return res.status(401).json({ message: "You are not authorized." });
      }
      const PDFentry = await prisma.notes.delete({
        where: {
          id: id,
        },
      });
      res.status(200).json({ PDFentry });
    } else if (category === "Solutions") {
      let validateResource = await prisma.solution.findUnique({
        where: {
          id: id,
        },
      });
      if (validateResource?.userId !== userId) {
        return res.status(401).json({ message: "You are not authorized." });
      }
      const PDFentry = await prisma.solution.delete({
        where: {
          id: id,
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
