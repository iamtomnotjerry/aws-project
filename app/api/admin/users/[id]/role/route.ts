import { ApiUtils } from "@/lib/api-response";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UserService } from "@/services/user.service";
import { NextRequest } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "anonymous";
    const rl = await rateLimit(`admin_toggle_role_${ip}`, { limit: 10, windowMs: 60000 });
    if (!rl.success) return ApiUtils.error("Too many role changes. Slow down.", 429);

    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return ApiUtils.error("Unauthorized", 403);
    }

    const { id } = await params;
    const body = await req.json();
    const { version } = body;

    if (version === undefined) {
      return ApiUtils.error("Version is required for optimistic locking", 400);
    }

    try {
      const user = await UserService.toggleUserRole(id, version);
      return ApiUtils.success(user, "User role updated");
    } catch (err: any) {
      if (err.message.includes("CONFLICT")) {
        return ApiUtils.error("Conflict: This user was modified by another administrator.", 409);
      }
      throw err;
    }
  } catch (error) {
    return ApiUtils.serverError(error);
  }
}
