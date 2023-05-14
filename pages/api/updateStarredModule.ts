import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import z from "zod";

const updateStarredModuleSchema = z.object({
  moduleCode: z.string(),
  userId: z.string(),
  value: z.boolean(),
});

export type updateStarredModuleType = z.infer<typeof updateStarredModuleSchema>;

function isValidBody(body: any): body is updateStarredModuleType {
  const { success } = updateStarredModuleSchema.safeParse(body);
  return success;
}

export default async function updateStarredModule(
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
    let { userId, moduleCode, value } = req.body;
    let mod;
    if (value !== true && value !== false) {
      res.status(400).json({ message: "Invalid request" });
    }
    if (value === true) {
      mod = await prisma.starredModules.create({
        data: {
          moduleCode: moduleCode,
          userId: userId,
        },
      });
    } else {
      mod = await prisma.starredModules.delete({
        where: {
          userId_moduleCode: {
            userId: userId,
            moduleCode: moduleCode,
          },
        },
      });
    }
    res.status(200).json({ mod });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
}
