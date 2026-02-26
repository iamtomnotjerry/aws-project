import { PostService } from "@/services/post.service";
import { notFound } from "next/navigation";
import DeleteButton from "@/features/blog/components/DeleteButton";
import { PostDetailClient } from "@/features/blog/components/PostDetailClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { Metadata } from "next";
import { cache } from "react";

// Memoize post data fetching across generateMetadata and the Page component
// to prevent double-hitting the database for the same request.
const getPost = cache(async (id: string, userId?: string) => {
  return await PostService.getPostById(id, userId);
});

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) return {};

  const SITE_URL = process.env.NEXTAUTH_URL || "https://studymate.io.vn";
  const description = post.content
    ? post.content.replace(/<[^>]*>/g, "").slice(0, 160)
    : "Read this article on Bao's Blog";

  const ogImageUrl = new URL(`${SITE_URL}/api/og`);
  ogImageUrl.searchParams.set("title", post.title);
  if (post.author?.name) ogImageUrl.searchParams.set("author", post.author.name);
  if (post.coverImage) ogImageUrl.searchParams.set("cover", post.coverImage);

  return {
    title: `${post.title} | Bao's Blog`,
    description,
    openGraph: {
      title: post.title,
      description,
      type: "article",
      url: `${SITE_URL}/post/${id}`,
      images: [{ url: ogImageUrl.toString(), width: 1200, height: 630, alt: post.title }],
      publishedTime: new Date(post.createdAt).toISOString(),
    },
  };
}

export default async function PostDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === "ADMIN";
  const userId = session?.user?.id;

  const post = await getPost(id, userId);

  if (!post) {
    notFound();
  }

  return (
    <PostDetailClient 
      post={post} 
      isAdmin={isAdmin} 
      DeleteButton={<DeleteButton id={post.id} />} 
    />
  );
}
