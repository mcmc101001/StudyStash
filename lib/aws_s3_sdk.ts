import { S3RequestPresigner } from "@aws-sdk/s3-request-presigner";
import { Hash } from "@aws-sdk/hash-node";
import { HttpRequest } from "@aws-sdk/protocol-http";
import { parseUrl } from "@aws-sdk/url-parser";
import { formatUrl } from "@aws-sdk/util-format-url";

// Generate presigned URL where a PUT request can be used to insert a file into S3
export const createPresignedUrlWithoutClient = async (params: {
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

    return formatUrl(signedUrlObject);
};