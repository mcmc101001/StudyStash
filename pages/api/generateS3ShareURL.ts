import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createPresignedShareUrl } from "@/lib/aws_s3_sdk";
import z from "zod";

const generateS3ShareURLSchema = z.object({
  // userId: z.string(),
  resourceId: z.string(),
});

export type generateS3ShareURLType = z.infer<typeof generateS3ShareURLSchema>;

function isValidBody(body: any): body is generateS3ShareURLType {
  const { success } = generateS3ShareURLSchema.safeParse(body);
  return success;
}

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
  // if (!session) {
  //   res.status(401).json({ message: "You must be logged in." });
  //   return;
  // }
  if (!isValidBody(req.body)) {
    return res.status(400).json({ message: "Invalid request body" });
  }
  // if (session.user.id !== req.body.userId) {
  //   res.status(401).json({ message: "You are not authorized." });
  //   return;
  // }

  console.log("reload");

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
