import { useState } from "react";
import { ApiService } from "@/services/api.service";

/**
 * Hook to manage S3 file uploads professionally.
 */
export function useS3Upload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File): Promise<string | null> => {
    setUploading(true);
    setError(null);
    try {
      // 1. Get presigned URL
      const presignedRes = await ApiService.upload.getPresignedUrl(file.name, file.type);
      if (!presignedRes.success || !presignedRes.data) throw new Error(presignedRes.error || "Failed to get upload URL");

      const { uploadUrl, publicUrl } = presignedRes.data;

      // 2. Direct upload to S3
      await ApiService.upload.directUpload(uploadUrl, file);

      return publicUrl;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setError(message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { upload, uploading, error };
}
