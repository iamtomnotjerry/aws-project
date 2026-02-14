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
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return ApiUtils.error("User not found", 404);
    }

    if (user.emailVerified) {
      return ApiUtils.error("Email already verified", 400);
    }

    // 2. Generate New Token
    const token = crypto.randomUUID();
    const expires = new Date(Date.now() + 3600000); // 1 hour

    // Clean up old tokens for this email first
    await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    });

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    // 3. Send Email
    await sendVerificationEmail(email, token);

    return ApiUtils.success(null, "Verification email resent successfully!");
  } catch (error) {
    return ApiUtils.serverError(error);
  }
}
