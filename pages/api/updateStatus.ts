import { authOptions } from "@/lib/auth";
import { ResourceSolutionEnum } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { ResourceStatus } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import z from "zod";
import { isValidBody } from "@/lib/utils";

const updateStatusSchema = z.object({
  category: ResourceSolutionEnum,
  resourceId: z.string(),
  userId: z.string(),
  status: z.union([z.nativeEnum(ResourceStatus), z.null()]),
});

export type updateStatusType = z.infer<typeof updateStatusSchema>;

export default async function updateStatus(
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
  if (!isValidBody(req.body, updateStatusSchema)) {
    return res.status(400).json({ message: "Invalid request body" });
  }
  if (session.user.id !== req.body.userId) {
    res.status(401).json({ message: "You are not authorized." });
    return;
  }
  try {
    let { category, resourceId, userId, status } = req.body;
    let vote;
    if (status !== null) {
      if (category === "Cheatsheets") {
        vote = await prisma.cheatsheetStatus.upsert({
          where: {
            userId_resourceId: {
              userId: userId,
              resourceId: resourceId,
            },
          },
          update: {
            status: status,
          },
          create: {
            status: status,
            userId: userId,
            resourceId: resourceId,
          },
        });
      } else if (category === "Past Papers") {
        vote = await prisma.questionPaperStatus.upsert({
          where: {
            userId_resourceId: {
              userId: userId,
              resourceId: resourceId,
            },
          },
          update: {
            status: status,
          },
          create: {
            status: status,
            userId: userId,
            resourceId: resourceId,
          },
        });
      } else if (category === "Notes") {
        vote = await prisma.notesStatus.upsert({
          where: {
            userId_resourceId: {
              userId: userId,
              resourceId: resourceId,
            },
          },
          update: {
            status: status,
          },
          create: {
            status: status,
            userId: userId,
            resourceId: resourceId,
          },
        });
      } else if (category === "Solutions") {
        vote = await prisma.solutionStatus.upsert({
          where: {
            userId_resourceId: {
              userId: userId,
              resourceId: resourceId,
            },
          },
          update: {
            status: status,
          },
          create: {
            status: status,
            userId: userId,
            resourceId: resourceId,
          },
        });
      }
    } else if (status === null) {
      if (category === "Cheatsheets") {
        vote = await prisma.cheatsheetStatus.delete({
          where: {
            userId_resourceId: {
              userId: userId,
              resourceId: resourceId,
            },
          },
        });
      } else if (category === "Past Papers") {
        vote = await prisma.questionPaperStatus.delete({
          where: {
            userId_resourceId: {
              userId: userId,
              resourceId: resourceId,
            },
          },
        });
      } else if (category === "Notes") {
        vote = await prisma.notesStatus.delete({
          where: {
            userId_resourceId: {
              userId: userId,
              resourceId: resourceId,
            },
          },
        });
      } else if (category === "Solutions") {
        vote = await prisma.solutionStatus.delete({
          where: {
            userId_resourceId: {
              userId: userId,
              resourceId: resourceId,
            },
          },
        });
      }
    } else {
      res.status(400).json({ message: "Invalid value" });
    }
    res.status(200).json({ vote });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
}
