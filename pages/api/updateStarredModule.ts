import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

export interface updateStarredModuleType {
  moduleCode: string;
  userId: string;
  value: boolean;
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
  try {
    let { userId, moduleCode, value } = req.body as updateStarredModuleType;
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
