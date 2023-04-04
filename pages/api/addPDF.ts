import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { S3RequestPresigner } from "@aws-sdk/s3-request-presigner";
import { Hash } from "@aws-sdk/hash-node";
import { HttpRequest } from "@aws-sdk/protocol-http";
import { parseUrl } from "@aws-sdk/url-parser";
import { formatUrl } from "@aws-sdk/util-format-url";


const createPresignedUrlWithoutClient = async (params: {
    region: string;
    bucket: string;
    key: string;
}) => {
    const url = parseUrl(
        `https://${params.bucket}.s3.${params.region}.amazonaws.com/${params.key}`
    );
    const presigner = new S3RequestPresigner({
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
        },
        region: params.region,
        sha256: Hash.bind(null, "sha256"),
    });

    const signedUrlObject = await presigner.presign(
        new HttpRequest({ ...url, method: "PUT" })
    );

    signedUrlObject.headers["Content-Type"] = "application/pdf";
    console.log(signedUrlObject);

    return formatUrl(signedUrlObject);
};

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
        let { name, type } = req.body;

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