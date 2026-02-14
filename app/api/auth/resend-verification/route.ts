import { prisma } from "@/lib/prisma";
import { ApiUtils } from "@/lib/api-response";
import { sendVerificationEmail } from "@/lib/resend";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = body?.email;

    if (!email || typeof email !== "string") {
      return ApiUtils.error("Email is required", 400);
    }

    // 1. Check for PendingUser (new verify-then-create flow)
    const pendingUser = await (prisma as any).pendingUser.findUnique({
      where: { email },
    });

    if (pendingUser) {
      const token = crypto.randomUUID();
      const expires = new Date(Date.now() + 3600000); // 1 hour

      await (prisma as any).pendingUser.update({
        where: { email },
        data: { token, expires },
      });

      await sendVerificationEmail(email, token);
      return ApiUtils.success(null, "A new verification link has been sent to your email.");
    }

    // 2. Check if user exists and is already verified
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal whether the email exists
      return ApiUtils.success(null, "If an account exists, a verification link has been sent.");
    }

    if (user.emailVerified) {
      return ApiUtils.error("Email is already verified", 400);
    }

    // 3. Legacy flow — user exists but not verified
    const token = crypto.randomUUID();
    const expires = new Date(Date.now() + 3600000);

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    await sendVerificationEmail(email, token);
    return ApiUtils.success(null, "Verification email resent successfully.");
  } catch (error) {
    return ApiUtils.serverError(error);
  }
}
