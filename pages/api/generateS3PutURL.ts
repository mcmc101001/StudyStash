import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createPresignedUploadUrl } from "@/lib/aws_s3_sdk";
import z from "zod";

const generateS3PutURLSchema = z.object({
  userId: z.string(),
  name: z.string(),
});

export type generateS3PutURLType = z.infer<typeof generateS3PutURLSchema>;

function isValidBody(body: any): body is generateS3PutURLType {
  const { success } = generateS3PutURLSchema.safeParse(body);
  return success;
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

export default async function generateS3PutURL(
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
    let { name } = req.body;

    const url = await createPresignedUploadUrl({
      region: process.env.AWS_REGION as string,
      bucket: process.env.AWS_BUCKET_NAME as string,
      key: name,
    });

    res.status(200).json({ url });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
}
