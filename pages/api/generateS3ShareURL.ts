import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createPresignedShareUrl } from "@/lib/aws_s3_sdk";
import z from "zod";
import { isValidBody } from "@/lib/utils";

const generateS3ShareURLSchema = z.object({
  resourceId: z.string(),
});

export type generateS3ShareURLType = z.infer<typeof generateS3ShareURLSchema>;

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

export default async function generateS3ShareURL(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!isValidBody(req.body, generateS3ShareURLSchema)) {
    return res.status(400).json({ message: "Invalid request body" });
  }

  try {
    let { resourceId } = req.body;

    const url = await createPresignedShareUrl({
      region: process.env.AWS_REGION as string,
      bucket: process.env.AWS_BUCKET_NAME as string,
      key: resourceId,
    });

    res.status(200).json({ url });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
}
