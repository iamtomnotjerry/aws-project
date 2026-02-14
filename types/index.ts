
export type Role = "USER" | "ADMIN";

export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: Role;
  emailVerified?: Date | null;
}

export interface Post {
  id: string;
  title: string;
  content?: string | null;
  coverImage?: string | null;
  published: boolean;
  authorId?: string | null;
  author?: User | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface PaginatedPosts {
  posts: Post[];
  nextCursor: string | null;
}
