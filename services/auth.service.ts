import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { randomBytes } from "crypto";
import { sendVerificationEmail } from "@/lib/resend";
import { logger } from "@/lib/logger";

async function fireEmailWithTimeout(email: string, token: string) {
  try {
    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('Email sending timeout')), 3000));
    await Promise.race([sendVerificationEmail(email, token), timeout]);
  } catch (err: unknown) {
    logger.warn(`Email sending to ${email} timed out or failed.`, { error: err instanceof Error ? err.message : String(err) });
  }
}

export class AuthService {
  static async signupUser({ email, name, password }: { email: string; name?: string; password?: string }) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = password ? await hash(password, 12) : null;
    const token = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); 

    const finalName = name || email.split("@")[0];
    const finalPassword = hashedPassword || "";

    const pendingUser = await prisma.pendingUser.upsert({
      where: { email },
      update: {
        name: finalName,
        password: finalPassword,
        token,
        expires,
      },
      create: {
        email,
        name: finalName,
        password: finalPassword,
        token,
        expires,
      },
    });

    fireEmailWithTimeout(email, token);
    return pendingUser;
  }

  static async verifyToken(token: string) {
    const pendingUser = await prisma.pendingUser.findUnique({ where: { token } });
    
    if (!pendingUser) {
      // Legacy flow support if needed, but primarily we check PendingUser
      return null;
    }

    if (new Date(pendingUser.expires) < new Date()) {
      await prisma.pendingUser.delete({ where: { token } });
      throw new Error("Token expired");
    }

    try {
      const user = await prisma.$transaction(async (tx) => {
        const created = await tx.user.create({
          data: {
            email: pendingUser.email,
            name: pendingUser.name,
            password: pendingUser.password,
            emailVerified: new Date(),
            image: `https://ui-avatars.com/api/?name=${encodeURIComponent(pendingUser.name || "User")}&background=random`,
          },
        });
        await tx.pendingUser.delete({ where: { token } });
        return created;
      });
      return user;
    } catch (err: unknown) {
      if (err !== null && typeof err === 'object' && 'code' in err && err.code === "P2002") {
        throw new Error("Email already taken");
      }
      throw err;
    }
  }

  static async cleanupExpiredPendingUsers() {
    const result = await prisma.pendingUser.deleteMany({
      where: { expires: { lt: new Date() } }
    });
    logger.info("Cleaned up expired pending users", { count: result.count });
    return result.count;
  }
}
