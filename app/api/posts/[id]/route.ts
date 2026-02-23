import { ApiUtils } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { postSchema } from "@/schemas/post.schema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    // Use parallel queries for better performance and type safety
    const [postData, likesCount] = await Promise.all([
      (prisma as any).post.findUnique({
        where: { id },
        include: { 
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              role: true,
              emailVerified: true
            }
          },
          // Use type-safe lookup if possible, otherwise bypass stale types
          ...(userId ? {
            likes: {
              where: { userId }
            }
          } : {})
        } as any,
      }),
      (prisma as any).like.count({
        where: { postId: id }
      })
    ]);
    
    if (!postData) return ApiUtils.error("Post not found", 404);

    // Explicitly cast to any or define return type if Prisma types are missing relations
    // But since we want Best Practice,    // Transform with explicit type safety
    const transformedPost = {
      ...postData,
      likes: likesCount,
      isLiked: !!((postData as any).likes && (postData as any).likes.length > 0)
    };
    
    return ApiUtils.success(transformedPost);
  } catch (error) {
    return ApiUtils.serverError(error);
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return ApiUtils.error("Unauthorized. Admin role required.", 403);
    }

    const { id } = await params;
    await prisma.post.delete({
      where: { id },
    });
    return ApiUtils.success({ message: "Post deleted" });
  } catch (error) {
    return ApiUtils.serverError(error);
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return ApiUtils.error("Unauthorized. Admin role required.", 403);
    }

    const { id } = await params;
    const body = await req.json();

    const validatedData = postSchema.safeParse(body);
    if (!validatedData.success) {
      return ApiUtils.error(validatedData.error.issues[0].message, 400);
    }

    const post = await prisma.post.update({
      where: { id },
      data: {
        ...validatedData.data,
      },
    });

    return ApiUtils.success(post);
  } catch (error) {
    return ApiUtils.serverError(error);
  }
}
