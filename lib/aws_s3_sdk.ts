import { S3RequestPresigner } from "@aws-sdk/s3-request-presigner";
import { Hash } from "@aws-sdk/hash-node";
import { HttpRequest } from "@aws-sdk/protocol-http";
import { parseUrl } from "@aws-sdk/url-parser";
import { formatUrl } from "@aws-sdk/util-format-url";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

// Instantiate an S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
  sha256: Hash.bind(null, "sha256"),
});

// Generate presigned URL where a PUT request can be used to insert a file into S3
export const createPresignedUploadUrl = async (params: {
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

// Generate presigned URL where a PUT request can be used to share a file from S3
// deprecated, currently we use AWS CloudFront to serve the files
export const createPresignedShareUrl = async (params: {
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

  const signedUrlObject = await presigner.presign(new HttpRequest(url));

  return formatUrl(signedUrlObject);
};

// Delete object
export const deleteS3ObjectLib = async (key: string) => {
  try {
    const deleteParams = { Bucket: process.env.AWS_BUCKET_NAME, Key: key };
    const deleteCommand = new DeleteObjectCommand(deleteParams);
    const deleteResponse = await s3.send(deleteCommand);
  } catch (error) {
    console.log(error);
  }
};
