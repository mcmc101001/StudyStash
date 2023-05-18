import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import z from "zod";

const addSolutionPDFSchema = z.object({
  name: z.string(),
  userId: z.string(),
  questionPaperId: z.string(),
});

export type addSolutionPDFType = z.infer<typeof addSolutionPDFSchema>;

function isValidBody(body: any): body is addSolutionPDFType {
  const { success } = addSolutionPDFSchema.safeParse(body);
  return success;
}

export default async function addSolutionPDF(
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
    console.log(req.body);
    return res.status(400).json({ message: "Invalid request body" });
  }
  if (session.user.id !== req.body.userId) {
    res.status(401).json({ message: "You are not authorized." });
    return;
  }
  try {
    let { name, userId, questionPaperId } = req.body;
    const questionPaper = await prisma.questionPaper.findUnique({
      where: {
        id: questionPaperId,
      },
    });
    console.log(questionPaper);
    // If no question paper
    if (!questionPaper) {
      res.status(400).json({ message: "Invalid request" });
      return;
    }
    const SolutionEntry = await prisma.solution.create({
      data: {
        name: name,
        questionPaperId: questionPaperId,
        userId: userId,
      },
    });
    res.status(200).json({ SolutionEntry });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
}
