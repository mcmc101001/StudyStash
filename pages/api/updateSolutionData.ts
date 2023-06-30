import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SolutionReportType } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import z from "zod";

const updateSolutionDataSchema = z.object({
  type: z.nativeEnum(SolutionReportType),
  uploaderId: z.string(),
  resourceId: z.string(),
  newData: z.string().optional(),
});

export type updateSolutionDataType = z.infer<typeof updateSolutionDataSchema>;

function isValidBody(body: any): body is updateSolutionDataType {
  const { success } = updateSolutionDataSchema.safeParse(body);
  return success;
}

export default async function updateSolutionData(
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
    let report = req.body;
    let solution;

    if (report.type === "inappropriateFilename") {
      solution = await prisma.solution.update({
        where: {
          id: report.resourceId,
        },
        data: {
          name: report.newData,
        },
      });
    } else if (report.type === "inappropriateUsername") {
      solution = await prisma.user.update({
        where: {
          id: report.uploaderId,
        },
        data: {
          name: report.newData,
        },
      });
    } else if (report.type === "incorrectQuestionPaper") {
      solution = await prisma.solution.update({
        where: {
          id: report.resourceId,
        },
        data: {
          questionPaperId: report.newData,
        },
      });
    } else {
      res.status(400).json({ message: "Invalid report type" });
    }

    res.status(200).json({ solution });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
}
