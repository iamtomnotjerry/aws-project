import { ApiUtils } from "@/lib/api-response";
import { s3Client } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILENAME_LENGTH = 200;

function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, "_") // Strip unsafe chars
    .replace(/\.{2,}/g, ".")           // No directory traversal via ..
    .slice(0, MAX_FILENAME_LENGTH);
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return ApiUtils.error("Unauthorized. Please sign in.", 401);
    }

    // Rate limit: 5 uploads per 10 seconds per user
    const rl = await rateLimit(`upload_${session.user.id}`, { limit: 5, windowMs: 10000 });
    if (!rl.success) {
      return ApiUtils.error("Too many upload requests. Please slow down.", 429);
    }

    const { filename, contentType, fileSize } = await request.json();

    if (!filename || typeof filename !== "string") {
      return ApiUtils.error("Filename is required", 400);
    }
    if (!contentType || typeof contentType !== "string") {
      return ApiUtils.error("Content type is required", 400);
    }
    if (!ALLOWED_TYPES.includes(contentType as typeof ALLOWED_TYPES[number])) {
      return ApiUtils.error("Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.", 400);
    }
    if (typeof fileSize === "number" && fileSize > MAX_FILE_SIZE) {
      return ApiUtils.error(`File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`, 400);
    }

    const safeName = sanitizeFilename(filename);
    const key = `uploads/${session.user.id}/${Date.now()}-${safeName}`;
    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    const cloudFrontDomain = process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: contentType,
      ContentLength: MAX_FILE_SIZE, // S3 enforces max upload size
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });

    const finalPublicUrl = cloudFrontDomain
      ? `https://${cloudFrontDomain}/${key}`
      : `https://${bucketName}.s3.${process.env.AWS_REGION || "ap-southeast-2"}.amazonaws.com/${key}`;

    return ApiUtils.success({
      uploadUrl: signedUrl,
      publicUrl: finalPublicUrl,
    });
  } catch (error) {
    return ApiUtils.serverError(error);
  }
}
