import { ApiUtils } from "@/lib/api-response";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UserService } from "@/services/user.service";
import { NextRequest } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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
