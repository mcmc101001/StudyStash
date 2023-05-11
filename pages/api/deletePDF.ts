import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { ResourceEnum } from "@/lib/content";
import z from "zod";

const deletePDFSchema = z.object({
  id: z.string(),
  category: ResourceEnum,
});

export type deletePDFType = z.infer<typeof deletePDFSchema>;

function isValidBody(body: any): body is deletePDFType {
  const { success } = deletePDFSchema.safeParse(body);
  return success;
}

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
  if (!isValidBody(req.body)) {
    return res.status(400).json({ message: "Invalid request body" });
  }
  try {
    let { id, category } = req.body;
    // ensure authenticated user is the owner of the PDF
    if (category === "Cheatsheets") {
      const PDFentry = await prisma.cheatsheet.deleteMany({
        where: {
          id: id,
          userId: session.user.id,
        },
      });
      res.status(200).json({ PDFentry });
    } else if (category === "Past Papers") {
      const PDFentry = await prisma.questionPaper.deleteMany({
        where: {
          id: id,
          userId: session.user.id,
        },
      });
      res.status(200).json({ PDFentry });
    } else if (category === "Notes") {
      const PDFentry = await prisma.notes.deleteMany({
        where: {
          id: id,
          userId: session.user.id,
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
