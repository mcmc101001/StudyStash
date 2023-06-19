import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { SolutionReportType } from "@prisma/client";
import z from "zod";

const addSolutionReportSchema = z.object({
  reporterId: z.string(),
  resourceId: z.string(),
  reportType: z.nativeEnum(SolutionReportType),
});

export type addSolutionReportType = z.infer<typeof addSolutionReportSchema>;

function isValidBody(body: any): body is addSolutionReportType {
  const { success } = addSolutionReportSchema.safeParse(body);
  return success;
}

export default async function addSolutionReport(
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
  if (session.user.id !== req.body.reporterId) {
    res.status(401).json({ message: "You are not authorized." });
    return;
  }

  let checkRepeat = await prisma.solutionReport.findFirst({
    where: {
      userId: req.body.reporterId,
      resourceId: req.body.resourceId,
      type: req.body.reportType,
      resolved: false,
    },
  });
  if (checkRepeat !== null) {
    return res.status(419).json({ message: "Repeated report." });
  }

  try {
    let { reporterId, resourceId, reportType } = req.body;
    let report = await prisma.solutionReport.create({
      data: {
        userId: reporterId,
        type: reportType,
        resourceId: resourceId,
      },
    });
    res.status(200).json({ report });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
}
