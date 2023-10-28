import { authOptions } from "@/lib/auth";
import { ResourceSolutionEnum } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import z from "zod";
import { isValidBody } from "@/lib/utils";

const updateVoteSchema = z.object({
  resourceId: z.string(),
  userId: z.string(),
  category: ResourceSolutionEnum,
  value: z.union([z.boolean(), z.null()]),
});

export type updateVoteType = z.infer<typeof updateVoteSchema>;

export default async function updateVote(
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
  if (!isValidBody(req.body, updateVoteSchema)) {
    return res.status(400).json({ message: "Invalid request body" });
  }
  if (session.user.id !== req.body.userId) {
    res.status(401).json({ message: "You are not authorized." });
    return;
  }
  try {
    let { resourceId, userId, category, value } = req.body;
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
      if (value !== null) {
        vote = await prisma.questionPaperVote.upsert({
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
        vote = await prisma.questionPaperVote.delete({
          where: {
            userId_resourceId: {
              userId: userId,
              resourceId: resourceId,
            },
          },
        });
      }
      res.status(200).json({ vote });
    } else if (category === "Notes") {
      if (value !== null) {
        vote = await prisma.notesVote.upsert({
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
        vote = await prisma.notesVote.delete({
          where: {
            userId_resourceId: {
              userId: userId,
              resourceId: resourceId,
            },
          },
        });
      }
      res.status(200).json({ vote });
    } else if (category === "Solutions") {
      if (value !== null) {
        vote = await prisma.solutionVote.upsert({
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
        vote = await prisma.solutionVote.delete({
          where: {
            userId_resourceId: {
              userId: userId,
              resourceId: resourceId,
            },
          },
        });
      }
      res.status(200).json({ vote });
    } else {
      res.status(400).json({ message: "Invalid request" });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
}
