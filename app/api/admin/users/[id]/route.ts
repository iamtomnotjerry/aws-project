import { ApiUtils } from "@/lib/api-response";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UserService } from "@/services/user.service";
import { NextRequest } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "anonymous";
    const rl = await rateLimit(`admin_delete_user_${ip}`, { limit: 10, windowMs: 60000 });
    if (!rl.success) return ApiUtils.error("Too many deletion attempts.", 429);

    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return ApiUtils.error("Unauthorized", 403);
    }

    const { id } = await params;
    
    // Prevent self-deletion
    if (session.user.id === id) {
      return ApiUtils.error("Cannot delete your own account", 400);
    }

    await UserService.deleteUser(id);
    return ApiUtils.success(null, "User deleted permanently");
  } catch (error) {
    return ApiUtils.serverError(error);
  }
}
