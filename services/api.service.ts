import { ApiResponse } from "@/lib/api-response";
import { PostInput } from "@/schemas/post.schema";

/**
 * Service to handle all API communications.
 * Centralizing this ensures scalability and makes it easy to add logging/interceptors.
 */
export const ApiService = {
  posts: {
    getAll: async (limit?: number, cursor?: string): Promise<ApiResponse> => {
      const url = new URL("/api/posts", window.location.origin);
      if (limit) url.searchParams.set("limit", limit.toString());
      if (cursor) url.searchParams.set("cursor", cursor);
      
      const res = await fetch(url.toString());
      return res.json();
    },
    getOne: async (id: string): Promise<ApiResponse> => {
      const res = await fetch(`/api/posts/${id}`);
      return res.json();
    },
    create: async (data: PostInput): Promise<ApiResponse> => {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    update: async (id: string, data: PostInput): Promise<ApiResponse> => {
      const res = await fetch(`/api/posts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    delete: async (id: string): Promise<ApiResponse> => {
      const res = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
      });
      return res.json();
    },
  },
  upload: {
    getPresignedUrl: async (filename: string, contentType: string): Promise<ApiResponse> => {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename, contentType }),
      });
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
