import { ApiUtils } from "@/lib/api-response";
import { postSchema } from "@/schemas/post.schema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest } from "next/server";
import { PostService } from "@/services/post.service";
import { logger } from "@/lib/logger";
import { revalidatePath } from "next/cache";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    const post = await PostService.getPostById(id, userId);

    if (!post) return ApiUtils.error("Post not found", 404);

    return ApiUtils.success(post, undefined, 200);
  } catch (error) {
    return ApiUtils.serverError(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return ApiUtils.error("Unauthorized. Admin role required.", 403);
    }

    const { id } = await params;
    await PostService.deletePost(id);
    
    revalidatePath("/");
    revalidatePath("/posts");

    return ApiUtils.success({ message: "Post deleted" });
  } catch (error) {
    return ApiUtils.serverError(error);
  }
}

export async function PATCH(
  req: NextRequest,
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

    const post = await PostService.updatePost(id, validatedData.data);

    revalidatePath("/");
    revalidatePath("/posts");
    revalidatePath(`/post/${id}`);

    return ApiUtils.success(post);
  } catch (error) {
    return ApiUtils.serverError(error);
  }
}
