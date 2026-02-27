import { ApiUtils } from "@/lib/api-response";
import { postSchema } from "@/schemas/post.schema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest } from "next/server";
import { PostService } from "@/services/post.service";
import { logger } from "@/lib/logger";
import { revalidatePath } from "next/cache";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "anonymous";
    const rl = await rateLimit(`get_post_detail_${ip}`, { limit: 100, windowMs: 10000 });
    if (!rl.success) return ApiUtils.error("Too Many Requests", 429);

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
    const ip = req.headers.get("x-forwarded-for") || "anonymous";
    const rl = await rateLimit(`delete_post_${ip}`, { limit: 5, windowMs: 60000 });
    if (!rl.success) return ApiUtils.error("Too many deletion attempts.", 429);

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
    const ip = req.headers.get("x-forwarded-for") || "anonymous";
    const rl = await rateLimit(`patch_post_${ip}`, { limit: 10, windowMs: 60000 });
    if (!rl.success) return ApiUtils.error("Too many update attempts.", 429);

    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return ApiUtils.error("Unauthorized. Admin role required.", 403);
    }

    const { id } = await params;
    const body = await req.json();
    const { version, ...rest } = body;

    const validatedData = postSchema.safeParse(rest);
    if (!validatedData.success) {
      return ApiUtils.error(validatedData.error.issues[0].message, 400);
    }

    try {
      const post = await PostService.updatePost(id, validatedData.data, version);

      revalidatePath("/");
      revalidatePath("/posts");
      revalidatePath(`/post/${id}`);

      return ApiUtils.success(post);
    } catch (err: any) {
       if (err.message.includes("CONFLICT")) {
         return ApiUtils.error("This post was updated by another administrator. Please refresh and try again.", 409);
       }
       throw err;
    }
  } catch (error) {
    return ApiUtils.serverError(error);
  }
}
