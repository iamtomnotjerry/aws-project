import { ApiUtils } from "@/lib/api-response";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UserService } from "@/services/user.service";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return ApiUtils.error("Unauthorized", 403);
    }

    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");
    const limit = parseInt(searchParams.get("limit") || "20");

    const result = await UserService.getAdminUsers(limit, cursor);
    return ApiUtils.success(result);
  } catch (error) {
    return ApiUtils.serverError(error);
  }
}
