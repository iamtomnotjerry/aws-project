import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { randomBytes } from "crypto";
import { sendVerificationEmail } from "@/lib/resend";
import { logger } from "@/lib/logger";

// Helper to fire-and-forget or fast-fail network calls
async function fireEmailWithTimeout(email: string, token: string) {
  try {
    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('Email sending timeout')), 3000));
    await Promise.race([sendVerificationEmail(email, token), timeout]);
  } catch (err: unknown) {
    logger.warn(`Email sending to ${email} timed out or failed. Registration continues.`, { error: err instanceof Error ? err.message : String(err) });
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
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

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

    // Fire email in background without blocking the HTTP response indefinitely
    fireEmailWithTimeout(email, token);

    return pendingUser;
  }

  static async resendVerification(email: string) {
    const pendingUser = await prisma.pendingUser.findUnique({ where: { email } });
    if (!pendingUser) {
      throw new Error("No pending registration found");
    }

    const token = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const updatedUser = await prisma.pendingUser.update({
      where: { email },
      data: { token, expires },
    });

    fireEmailWithTimeout(email, token);

    return updatedUser;
  }
}
