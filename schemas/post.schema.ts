import { z } from "zod";

export const postSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  content: z.string().min(1, "Content is required"),
  coverImage: z.string().url("Invalid image URL").nullish(),
  published: z.boolean().optional(),
});

export type PostInput = z.infer<typeof postSchema>;
