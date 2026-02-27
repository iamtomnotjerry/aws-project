import { ApiResponse } from "@/lib/api-response";
import { PostInput } from "@/schemas/post.schema";
import { PostWithAuthor, PaginatedPosts } from "@/types";

interface PresignedUrlResponse {
  uploadUrl: string;
  publicUrl: string;
}

/**
 * Service to handle all API communications.
 * Centralizing this ensures scalability and makes it easy to add logging/interceptors.
 */
export const ApiService = {
  posts: {
    getAll: async (limit?: number, cursor?: string): Promise<ApiResponse<PaginatedPosts>> => {
      const params = new URLSearchParams();
      if (limit) params.set("limit", limit.toString());
      if (cursor) params.set("cursor", cursor);
      
      const res = await fetch(`/api/posts?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
      return res.json();
    },
    getOne: async (id: string): Promise<ApiResponse<PostWithAuthor>> => {
      const res = await fetch(`/api/posts/${id}`);
      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
      return res.json();
    },
    create: async (data: PostInput): Promise<ApiResponse<PostWithAuthor>> => {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
      return res.json();
    },
    update: async (id: string, data: PostInput): Promise<ApiResponse<PostWithAuthor>> => {
      const res = await fetch(`/api/posts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
      return res.json();
    },
    delete: async (id: string): Promise<ApiResponse<{ message: string }>> => {
      const res = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
      return res.json();
    },
  },
  upload: {
    getPresignedUrl: async (filename: string, contentType: string): Promise<ApiResponse<PresignedUrlResponse>> => {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename, contentType }),
      });
      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
      return res.json();
    },
    directUpload: async (url: string, file: File): Promise<void> => {
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!res.ok) throw new Error("Failed to upload to S3");
    },
  },
};
