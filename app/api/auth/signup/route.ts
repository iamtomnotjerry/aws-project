import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { ApiUtils } from "@/lib/api-response";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/lib/resend";
import crypto from "crypto";
import { signupSchema } from "@/schemas/auth.schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 0. Use Zod validation
    const validatedData = signupSchema.safeParse(body);
    if (!validatedData.success) {
      return ApiUtils.error(validatedData.error.issues[0].message, 400);
    }

    const { email, password, name } = validatedData.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return ApiUtils.error("User already exists", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    
    // 1. & 2. Create User and Token atomically
    const token = crypto.randomUUID();
    const expires = new Date(Date.now() + 3600000); // 1 hour

    const [user] = await prisma.$transaction([
      prisma.user.create({
        data: {
          email,
          name: name || email.split("@")[0],
          password: hashedPassword,
          image: `https://ui-avatars.com/api/?name=${name || "User"}&background=random`,
        } as any,
      }),
      prisma.verificationToken.create({
        data: {
          identifier: email,
          token,
          expires,
        },
      }),
    ]);

    // 3. Send Verification Email
    try {
      await sendVerificationEmail(email, token);
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      return ApiUtils.success(user, "Account created, but verification email failed to send. You can resend it from your profile.", 201);
    }

    return ApiUtils.success(user, "Account created! Please check your email to verify.", 201);
  } catch (error) {
    return ApiUtils.serverError(error);
  }
}
