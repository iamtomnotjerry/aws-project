import { ApiUtils } from "@/lib/api-response";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest } from "next/server";
import { AuthService } from "@/services/auth.service";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return ApiUtils.error("Unauthorized", 403);
    }

    const count = await AuthService.cleanupExpiredPendingUsers();

    return ApiUtils.success({ count }, `Successfully cleaned up ${count} expired records`);
  } catch (error) {
    return ApiUtils.serverError(error);
  }
}
