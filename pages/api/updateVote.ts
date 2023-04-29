import { authOptions } from "@/lib/auth";
import { ResourceType } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

export interface updateVoteType {
  resourceId: string;
  userId: string;
  category: ResourceType;
  value: boolean | null;
}

export default async function updateVote(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }
  try {
    let { resourceId, userId, category, value } = req.body as updateVoteType;
    let vote;
    if (category === "Cheatsheets") {
      if (value !== null) {
        vote = await prisma.cheatsheetVote.upsert({
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
      } else {
        vote = await prisma.cheatsheetVote.delete({
          where: {
            userId_resourceId: {
              userId: userId,
              resourceId: resourceId,
            },
          },
        });
      }
      res.status(200).json({ vote });
    } else if (category === "Past Papers") {
      res.status(200).json({ message: "Vote updated!" });
    } else if (category === "Notes") {
      res.status(200).json({ message: "Vote updated!" });
    } else {
      res.status(400).json({ message: "Invalid request" });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
}
