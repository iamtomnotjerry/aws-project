import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return redirect("/auth/signin?error=MissingToken");
  }

  try {
    const existingToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!existingToken) {
      return redirect("/auth/signin?error=InvalidToken");
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
      await prisma.verificationToken.delete({
        where: { token },
      });
      return redirect("/auth/signin?error=TokenExpired");
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: existingToken.identifier },
    });

    if (!existingUser) {
      return redirect("/auth/signin?error=EmailNotFound");
    }

    // Update user and delete token
    await prisma.user.update({
      where: { id: existingUser.id },
      data: { emailVerified: new Date() },
    });

    await prisma.verificationToken.delete({
      where: { token },
    });

    return redirect("/auth/verify-success");
  } catch (error) {
    console.error("Verification error:", error);
    return redirect("/auth/signin?error=VerificationFailed");
  }
}
