import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import z from "zod";

const updateProfileSchema = z.object({
  userId: z.string(),
  username: z.string().max(30),
  bio: z.string().max(255),
});

export type updateProfileType = z.infer<typeof updateProfileSchema>;

function isValidBody(body: any): body is updateProfileType {
  const { success } = updateProfileSchema.safeParse(body);
  return success;
}

export default async function updateProfile(
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
    let { userId, username, bio } = req.body;
    const update = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name: username,
        bio: bio,
      },
    });
    res.status(200).json({ update });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
}
