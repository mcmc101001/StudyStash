import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createPresignedUrlWithoutClient } from "@/lib/aws_s3_sdk";

export const config = {
    api: {
        bodyParser: {
            sizeLimit: "10mb",
        },
    },
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method != "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const session = await getServerSession(req, res, authOptions);
    if (!session) {
        res.status(401).json({ message: "You must be logged in." });
        return;
    }
    
    try {
        let { name } = req.body;

        const url = await createPresignedUrlWithoutClient({
            region: process.env.AWS_REGION as string,
            bucket: process.env.AWS_BUCKET_NAME as string,
            key: name,
        });

        res.status(200).json({ url });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

