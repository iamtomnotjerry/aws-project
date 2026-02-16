import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import DeleteButton from "@/features/blog/components/DeleteButton";
import { PostDetailClient } from "@/features/blog/components/PostDetailClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Prisma } from "@prisma/client";

type PostWithAuthorPayload = Prisma.PostGetPayload<{ include: { author: true } }>;

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
