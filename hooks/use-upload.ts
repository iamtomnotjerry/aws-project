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
      if (!presignedRes.success) throw new Error(presignedRes.error);

      const { uploadUrl, publicUrl } = presignedRes.data;

      // 2. Direct upload to S3
      await ApiService.upload.directUpload(uploadUrl, file);

      return publicUrl;
    } catch (err: any) {
      setError(err.message || "Upload failed");
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { upload, uploading, error };
}
