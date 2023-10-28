import { authOptions } from "@/lib/auth";
import { ResourceSolutionEnum } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import z from "zod";
import { isValidBody } from "@/lib/utils";

const updateReplyVoteSchema = z.object({
  replyId: z.string(),
  userId: z.string(),
  category: ResourceSolutionEnum,
  value: z.union([z.boolean(), z.null()]),
});

export type updateReplyVoteType = z.infer<typeof updateReplyVoteSchema>;

export default async function updateReplyVote(
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
  if (!isValidBody(req.body, updateReplyVoteSchema)) {
    return res.status(400).json({ message: "Invalid request body" });
  }
  if (session.user.id !== req.body.userId) {
    res.status(401).json({ message: "You are not authorized." });
    return;
  }
  try {
    let { replyId, userId, category, value } = req.body;
    let vote;
    if (category === "Cheatsheets") {
      if (value !== null) {
        vote = await prisma.cheatsheetReplyVote.upsert({
          where: {
            userId_replyId: {
              userId: userId,
              replyId: replyId,
            },
          },
          update: {
            value: value,
          },
          create: {
            value: value,
            replyId: replyId,
            userId: userId,
          },
        });
      } else {
        vote = await prisma.cheatsheetReplyVote.delete({
          where: {
            userId_replyId: {
              userId: userId,
              replyId: replyId,
            },
          },
        });
      }
      res.status(200).json({ vote });
    } else if (category === "Past Papers") {
      if (value !== null) {
        vote = await prisma.questionPaperReplyVote.upsert({
          where: {
            userId_replyId: {
              userId: userId,
              replyId: replyId,
            },
          },
          update: {
            value: value,
          },
          create: {
            value: value,
            replyId: replyId,
            userId: userId,
          },
        });
      } else {
        vote = await prisma.questionPaperReplyVote.delete({
          where: {
            userId_replyId: {
              userId: userId,
              replyId: replyId,
            },
          },
        });
      }
      res.status(200).json({ vote });
    } else if (category === "Notes") {
      if (value !== null) {
        vote = await prisma.notesReplyVote.upsert({
          where: {
            userId_replyId: {
              userId: userId,
              replyId: replyId,
            },
          },
          update: {
            value: value,
          },
          create: {
            value: value,
            replyId: replyId,
            userId: userId,
          },
        });
      } else {
        vote = await prisma.notesReplyVote.delete({
          where: {
            userId_replyId: {
              userId: userId,
              replyId: replyId,
            },
          },
        });
      }
      res.status(200).json({ vote });
    } else if (category === "Solutions") {
      if (value !== null) {
        vote = await prisma.solutionReplyVote.upsert({
          where: {
            userId_replyId: {
              userId: userId,
              replyId: replyId,
            },
          },
          update: {
            value: value,
          },
          create: {
            value: value,
            replyId: replyId,
            userId: userId,
          },
        });
      } else {
        vote = await prisma.solutionReplyVote.delete({
          where: {
            userId_replyId: {
              userId: userId,
              replyId: replyId,
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
