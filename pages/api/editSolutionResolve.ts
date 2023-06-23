import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { SolutionReportType, SolutionReport } from "@prisma/client";
import { ResourceEnum, ResourceType } from "@/lib/content";
import z from "zod";

const editSolutionResolvedSchema = z.object({
  // userId: z.string(),
  reportId: z.string(),
  setResolved: z.boolean(),
});

export type editSolutionResolvedType = z.infer<
  typeof editSolutionResolvedSchema
>;

function isValidBody(body: any): body is editSolutionResolvedType {
  const { success } = editSolutionResolvedSchema.safeParse(body);
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
    let { reportId, setResolved } = req.body;
    let report = await prisma.solutionReport.update({
      where: {
        id: reportId,
      },
      data: {
        resolved: setResolved,
      },
    });
    res.status(200).json({ report });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
}
