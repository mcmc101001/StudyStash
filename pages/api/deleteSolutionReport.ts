import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import z from "zod";

const deleteSolutionReportSchema = z.object({
  reportId: z.string(),
});

export type deleteSolutionReportType = z.infer<
  typeof deleteSolutionReportSchema
>;

function isValidBody(body: any): body is deleteSolutionReportType {
  const { success } = deleteSolutionReportSchema.safeParse(body);
  return success;
}

export default async function deleteSolutionReport(
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

  try {
    let report = await prisma.solutionReport.delete({
      where: {
        id: req.body.reportId,
      },
    });
    res.status(200).json({ report });
  } catch (error) {
    res.status(500).json({ message: "Report deletion failed" });
  }
}
