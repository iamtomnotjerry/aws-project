import { S3Client, PutBucketCorsCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();

const run = async () => {
  try {
    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    const region = process.env.AWS_REGION || "ap-southeast-2";

    const s3 = new S3Client({
      region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      }
    });

    const command = new PutBucketCorsCommand({
      Bucket: bucketName,
      CORSConfiguration: {
        CORSRules: [
          {
            AllowedHeaders: ["*"],
            AllowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
            AllowedOrigins: ["*"],
            ExposeHeaders: ["ETag"],
            MaxAgeSeconds: 3000
          }
        ]
      }
    });

    await s3.send(command);
    console.log("✅ Cấu hình CORS thành công cho S3 Bucket:", bucketName);
  } catch (error) {
    console.error("❌ Lỗi cấu hình S3 CORS:", error);
  }
};

run();
