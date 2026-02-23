
export type Role = "USER" | "ADMIN";

export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: Role;
  emailVerified?: Date | string | null;
}

export interface Like {
  id: string;
  postId: string;
  userId: string;
  createdAt: Date | string;
}

export interface Comment {
  id: string;
  content: string;
  postId: string;
  userId: string;
  parentId?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  user: Pick<User, "name" | "image" | "role">;
  replies?: Comment[];
}

export interface Post {
  id: string;
  title: string;
  content?: string | null;
  coverImage?: string | null;
  likes: number;
  published: boolean;
  authorId?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface PostWithAuthor extends Post {
  author?: User | null;
  isLiked?: boolean;
}

export interface PaginatedPosts {
  posts: PostWithAuthor[];
  nextCursor: string | null;
}
