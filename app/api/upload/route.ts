import { ApiUtils } from "@/lib/api-response";
import { s3Client } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return ApiUtils.error("Unauthorized. Please sign in.", 401);
    }

    const { filename, contentType } = await request.json();

    if (!filename || !contentType) {
      return ApiUtils.error("Filename and contentType are required", 400);
    }

    const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!ALLOWED_TYPES.includes(contentType)) {
      return ApiUtils.error("Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.", 400);
    }

    const key = `uploads/${session.user.email}/${Date.now()}-${filename}`;
    const bucketName = process.env.AWS_S3_BUCKET_NAME;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: contentType,
    });

    // Generate a presigned URL that expires in 60 seconds
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });

    return ApiUtils.success({
      uploadUrl: signedUrl,
      publicUrl: `https://${bucketName}.s3.${process.env.AWS_REGION || "ap-southeast-2"}.amazonaws.com/${key}`,
    });
  } catch (error) {
    return ApiUtils.serverError(error);
  }
}
