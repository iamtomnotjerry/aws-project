import { ApiUtils } from "@/lib/api-response";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PostService } from "@/services/post.service";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return ApiUtils.error("Unauthorized", 403);
    }

    const stats = await PostService.getAdminStats();
    return ApiUtils.success(stats);
  } catch (error) {
    return ApiUtils.serverError(error);
  }
}
