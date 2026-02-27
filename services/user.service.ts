import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { Role } from "@prisma/client";

export class UserService {
  /**
   * Fetch all users for admin management.
   */
  static async getAdminUsers(limit: number, cursor?: string | null) {
    const users = await prisma.user.findMany({
      take: limit,
      skip: cursor ? 1 : 0,
      ...(cursor && { cursor: { id: cursor } }),
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        _count: {
          select: {
            posts: true,
            comments: true,
            likes: true,
          },
        },
      },
    });

    return {
      users,
      nextCursor: users.length === limit ? users[users.length - 1].id : null,
    };
  }

  /**
   * Toggle user role (ADMIN <-> USER) with optimistic locking.
   */
  static async toggleUserRole(id: string, currentVersion: number) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new Error("User not found");

    const newRole = user.role === Role.ADMIN ? Role.USER : Role.ADMIN;
    
    const result = await prisma.user.updateMany({
      where: { id, version: currentVersion },
      data: { 
        role: newRole,
        version: { increment: 1 }
      },
    });

    if (result.count === 0) {
      throw new Error("CONFLICT: User role was modified by another administrator");
    }

    // Invalidate next.js cache for any potential SSR pages using user data
    const { revalidatePath } = await import("next/cache");
    revalidatePath("/admin/users");

    logger.info("User role updated with optimistic lock", { userId: id, newRole, version: currentVersion + 1 });
    return { id, role: newRole, version: currentVersion + 1 };
  }

  /**
   * Delete a user account permanently.
   */
  static async deleteUser(id: string) {
    await prisma.user.delete({ where: { id } });
    
    // Invalidate admin dashboard paths
    const { revalidatePath } = await import("next/cache");
    revalidatePath("/admin/users");
    revalidatePath("/admin"); // Re-trigger stats re-fetch

    logger.info("User deleted permanently and caches invalidated", { userId: id });
  }
}
