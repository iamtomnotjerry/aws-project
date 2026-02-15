import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import DeleteButton from "@/components/DeleteButton";
import { PostDetailClient } from "@/components/PostDetailClient";
import { PostWithAuthor } from "@/types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function PostDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === "ADMIN";

  const post = await prisma.post.findUnique({
    where: { id },
    include: { author: true },
  }) as PostWithAuthor | null;

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
