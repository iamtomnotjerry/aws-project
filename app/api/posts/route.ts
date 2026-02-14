import { ApiUtils } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { postSchema } from "@/schemas/post.schema";

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: { author: true },
    });
    return ApiUtils.success(posts);
  } catch (error) {
    return ApiUtils.serverError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = postSchema.safeParse(body);
    
    if (!validatedData.success) {
      return ApiUtils.error(validatedData.error.issues[0].message, 400);
    }

    const post = await prisma.post.create({
      data: {
        ...validatedData.data,
        published: true,
      },
    });

    return ApiUtils.success(post, 201);
  } catch (error) {
    return ApiUtils.serverError(error);
  }
}
