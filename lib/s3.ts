import { S3Client } from "@aws-sdk/client-s3";

const region = process.env.AWS_REGION || "ap-southeast-2";
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

if (!accessKeyId || !secretAccessKey) {
  console.warn("[S3] AWS credentials not configured. S3 uploads will fail.");
}

export const s3Client = new S3Client({
  region,
  ...(accessKeyId && secretAccessKey
    ? { credentials: { accessKeyId, secretAccessKey } }
    : {}),
});
