import { authOptions } from "@/lib/auth";
import { ResourceSolutionEnum } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import z from "zod";

const updateCommentVoteSchema = z.object({
  commentId: z.string(),
  userId: z.string(),
  category: ResourceSolutionEnum,
  value: z.union([z.boolean(), z.null()]),
});

export type updateCommentVoteType = z.infer<typeof updateCommentVoteSchema>;

function isValidBody(body: any): body is updateCommentVoteType {
  const { success } = updateCommentVoteSchema.safeParse(body);
  return success;
}

export default async function updateCommentVote(
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
  if (session.user.id !== req.body.userId) {
    res.status(401).json({ message: "You are not authorized." });
    return;
  }
  try {
    let { commentId, userId, category, value } = req.body;
    let vote;
    if (category === "Cheatsheets") {
      if (value !== null) {
        vote = await prisma.cheatsheetCommentVote.upsert({
          where: {
            userId_commentId: {
              userId: userId,
              commentId: commentId,
            },
          },
          update: {
            value: value,
          },
          create: {
            value: value,
            commentId: commentId,
            userId: userId,
          },
        });
      } else {
        vote = await prisma.cheatsheetCommentVote.delete({
          where: {
            userId_commentId: {
              userId: userId,
              commentId: commentId,
            },
          },
        });
      }
      res.status(200).json({ vote });
    } else if (category === "Past Papers") {
      if (value !== null) {
        vote = await prisma.questionPaperCommentVote.upsert({
          where: {
            userId_commentId: {
              userId: userId,
              commentId: commentId,
            },
          },
          update: {
            value: value,
          },
          create: {
            value: value,
            commentId: commentId,
            userId: userId,
          },
        });
      } else {
        vote = await prisma.questionPaperCommentVote.delete({
          where: {
            userId_commentId: {
              userId: userId,
              commentId: commentId,
            },
          },
        });
      }
      res.status(200).json({ vote });
    } else if (category === "Notes") {
      if (value !== null) {
        vote = await prisma.notesCommentVote.upsert({
          where: {
            userId_commentId: {
              userId: userId,
              commentId: commentId,
            },
          },
          update: {
            value: value,
          },
          create: {
            value: value,
            commentId: commentId,
            userId: userId,
          },
        });
      } else {
        vote = await prisma.notesCommentVote.delete({
          where: {
            userId_commentId: {
              userId: userId,
              commentId: commentId,
            },
          },
        });
      }
      res.status(200).json({ vote });
    } else if (category === "Solutions") {
      if (value !== null) {
        vote = await prisma.solutionCommentVote.upsert({
          where: {
            userId_commentId: {
              userId: userId,
              commentId: commentId,
            },
          },
          update: {
            value: value,
          },
          create: {
            value: value,
            commentId: commentId,
            userId: userId,
          },
        });
      } else {
        vote = await prisma.solutionCommentVote.delete({
          where: {
            userId_commentId: {
              userId: userId,
              commentId: commentId,
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
