
export type Role = "USER" | "ADMIN";

export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: Role;
  emailVerified?: Date | string | null;
}

export interface Post {
  id: string;
  title: string;
  content?: string | null;
  coverImage?: string | null;
  published: boolean;
  authorId?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface PostWithAuthor extends Post {
  author?: User | null;
}

export interface PaginatedPosts {
  posts: PostWithAuthor[];
  nextCursor: string | null;
}
