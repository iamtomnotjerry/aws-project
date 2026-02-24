import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { randomBytes } from "crypto";
import { sendVerificationEmail } from "@/lib/resend";

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

    await sendVerificationEmail(email, token);

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

    await sendVerificationEmail(email, token);

    return updatedUser;
  }
}
