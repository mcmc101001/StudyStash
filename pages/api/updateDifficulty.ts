import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

export interface updateDifficultyType {
  resourceId: string;
  userId: string;
  value: number;
}

export default async function updateDifficulty(
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
  try {
    let { resourceId, userId, value } = req.body as updateDifficultyType;
    let vote;
    if (Number.isInteger(value) && value >= 1 && value <= 5) {
      vote = await prisma.questionPaperDifficulty.upsert({
        where: {
          userId_resourceId: {
            userId: userId,
            resourceId: resourceId,
          },
        },
        update: {
          value: value,
        },
        create: {
          value: value,
          resourceId: resourceId,
          userId: userId,
        },
      });
    } else if (value === 0) {
      vote = await prisma.questionPaperDifficulty.delete({
        where: {
          userId_resourceId: {
            userId: userId,
            resourceId: resourceId,
          },
        },
      });
    } else {
      res.status(400).json({ message: "Invalid value" });
    }
    res.status(200).json({ vote });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
}
