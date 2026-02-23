import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import DeleteButton from "@/features/blog/components/DeleteButton";
import { PostDetailClient } from "@/features/blog/components/PostDetailClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { Metadata } from "next";

const SITE_URL = process.env.NEXTAUTH_URL || "https://studymate.io.vn";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.png`;

// Generates dynamic metadata for each post (SEO, OpenGraph, Twitter Card)
export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id },
    select: { title: true, content: true, coverImage: true, author: { select: { name: true } }, createdAt: true },
  });

  if (!post) return {};

  const description = post.content
    ? post.content.replace(/<[^>]*>/g, "").slice(0, 160)
    : "Đọc bài viết trên Bao's Blog";

  const ogImageUrl = new URL(`${SITE_URL}/api/og`);
  ogImageUrl.searchParams.set("title", post.title);
  if (post.author?.name) ogImageUrl.searchParams.set("author", post.author.name);
  if (post.coverImage) ogImageUrl.searchParams.set("cover", post.coverImage);
  const ogImage = ogImageUrl.toString();

  return {
    title: `${post.title} | Bao's Blog`,
    description,
    openGraph: {
      title: post.title,
      description,
      type: "article",
      url: `${SITE_URL}/post/${id}`,
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
      publishedTime: post.createdAt.toISOString(),
      authors: post.author?.name ? [post.author.name] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: `${SITE_URL}/post/${id}`,
    },
  };
}

type PostWithAuthorPayload = { id: string; title: string; content: string | null; coverImage: string | null; published: boolean; authorId: string | null; likesCount: number; commentsCount: number; createdAt: Date; updatedAt: Date; author: { id: string; name: string | null; email: string | null; image: string | null; role: string; emailVerified: Date | null; password: string | null; } | null; };


export default async function PostDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === "ADMIN";

  const post: PostWithAuthorPayload | null = await prisma.post.findUnique({
    where: { id },
    include: { author: true },
  });

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
