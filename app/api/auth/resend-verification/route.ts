import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { ApiUtils } from "@/lib/api-response";
import { sendVerificationEmail } from "@/lib/resend";
import crypto from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return ApiUtils.error("Unauthorized", 401);
    }

    const email = session.user.email;

    // 1. Check if user is already verified
    // 1. Check for PendingUser first (New flow)
    const pendingUser = await prisma.pendingUser.findUnique({
      where: { email },
    });

    if (pendingUser) {
      const token = crypto.randomUUID();
      const expires = new Date(Date.now() + 3600000); // 1 hour

      await prisma.pendingUser.update({
        where: { email },
        data: { token, expires },
      });

      await sendVerificationEmail(email, token);
      return ApiUtils.success(null, "A new verification link has been sent to your email.");
    }

    // 2. Fallback for already verified users or old flow
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return ApiUtils.error("Email not found", 404);
    }

    if (user.emailVerified) {
      return ApiUtils.error("Email is already verified", 400);
    }
    
    // Create traditional verification token for legacy flow
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
