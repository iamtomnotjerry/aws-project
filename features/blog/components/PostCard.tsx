"use client";

import { PostWithAuthor } from "@/types";
import { FeaturedPostCard } from "./FeaturedPostCard";
import { StandardPostCard } from "./StandardPostCard";

interface PostCardProps {
  post: PostWithAuthor;
  featured?: boolean;
}

export const PostCard = ({ post, featured = false }: PostCardProps) => {
  if (featured) {
    return <FeaturedPostCard post={post} />;
  }

  return <StandardPostCard post={post} />;
};
