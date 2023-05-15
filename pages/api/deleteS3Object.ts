import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { deleteS3ObjectLib } from "@/lib/aws_s3_sdk";
import z from "zod";

const deleteS3ObjectSchema = z.object({
  userId: z.string(),
  id: z.string(),
});

export type deleteS3ObjectType = z.infer<typeof deleteS3ObjectSchema>;

function isValidBody(body: any): body is deleteS3ObjectType {
  const { success } = deleteS3ObjectSchema.safeParse(body);
  return success;
}

export default async function deleteS3Object(
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
    let { id } = req.body;

    const response = await deleteS3ObjectLib(id);

    res.status(200).json({ response });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
}
