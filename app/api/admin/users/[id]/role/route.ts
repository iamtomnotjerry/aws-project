import { ApiUtils } from "@/lib/api-response";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UserService } from "@/services/user.service";
import { NextRequest } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return ApiUtils.error("Unauthorized", 403);
    }

    const { id } = await params;
    const user = await UserService.toggleUserRole(id);
    
    return ApiUtils.success(user, "User role updated");
  } catch (error) {
    return ApiUtils.serverError(error);
  }
}
