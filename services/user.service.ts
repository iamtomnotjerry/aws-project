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
   * Toggle user role (ADMIN <-> USER).
   */
  static async toggleUserRole(id: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new Error("User not found");

    const newRole = user.role === Role.ADMIN ? Role.USER : Role.ADMIN;
    
    const updated = await prisma.user.update({
      where: { id },
      data: { role: newRole },
    });

    logger.info("User role updated", { userId: id, newRole });
    return updated;
  }

  /**
   * Delete a user account permanently.
   */
  static async deleteUser(id: string) {
    await prisma.user.delete({ where: { id } });
    logger.info("User deleted permanently", { userId: id });
  }
}
