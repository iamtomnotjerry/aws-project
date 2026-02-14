import { ApiUtils } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { postSchema } from "@/schemas/post.schema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");
    const limit = parseInt(searchParams.get("limit") || "10");

    const posts = await prisma.post.findMany({
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: "desc" },
      include: { 
        author: {
          select: { name: true, image: true, role: true } as any
        } 
      },
    });

    const nextCursor = posts.length === limit ? posts[posts.length - 1].id : null;

    return ApiUtils.success({ posts, nextCursor });
  } catch (error) {
    return ApiUtils.serverError(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // API Level Protection
    if (!session || (session.user as any).role !== "ADMIN") {
      return ApiUtils.error("Unauthorized. Admin role required.", 403);
    }

    const body = await request.json();
    const validatedData = postSchema.safeParse(body);
    
    if (!validatedData.success) {
      return ApiUtils.error(validatedData.error.issues[0].message, 400);
    }

    const post = await prisma.post.create({
      data: {
        ...validatedData.data,
        published: true,
        authorId: (session.user as any).id,
      } as any,
    });

    return ApiUtils.success(post, "Post created successfully", 201);
  } catch (error) {
    return ApiUtils.serverError(error);
  }
}
