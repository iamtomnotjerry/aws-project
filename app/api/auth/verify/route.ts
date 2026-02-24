import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { logger } from "@/lib/logger";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return redirect("/auth/signin?error=MissingToken");
  }

  try {
    // 1. Find PendingUser by token
    const pendingUser = await prisma.pendingUser.findUnique({
      where: { token },
    });

    if (!pendingUser) {
      // Fallback for legacy flow via VerificationToken
      const existingToken = await prisma.verificationToken.findUnique({
        where: { token },
      });

      if (!existingToken) {
        return redirect("/auth/signin?error=InvalidToken");
      }

      const hasExpired = new Date(existingToken.expires) < new Date();
      if (hasExpired) {
        await prisma.verificationToken.delete({ where: { token } });
        return redirect("/auth/signin?error=TokenExpired");
      }

      const user = await prisma.user.findUnique({
        where: { email: existingToken.identifier },
      });

      if (!user) return redirect("/auth/signin?error=UserNotFound");

      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });

      await prisma.verificationToken.delete({ where: { token } });
      return redirect("/auth/verify-success");
    }

    // 2. Handle PendingUser Flow
    const hasExpired = new Date(pendingUser.expires) < new Date();
    if (hasExpired) {
      await prisma.pendingUser.delete({ where: { token } });
      return redirect("/auth/signin?error=TokenExpired");
    }

    // Promote PendingUser to User — rely on unique constraint instead of TOCTOU check
    try {
      await prisma.$transaction([
        prisma.user.create({
          data: {
            email: pendingUser.email,
            name: pendingUser.name,
            password: pendingUser.password,
            emailVerified: new Date(),
            image: `https://ui-avatars.com/api/?name=${encodeURIComponent(pendingUser.name || "User")}&background=random`,
          },
        }),
        prisma.pendingUser.delete({
          where: { token },
        }),
      ]);
    } catch (txError: unknown) {
      // P2002 = unique constraint violation → email was taken during pending period
      if (txError instanceof Error && "code" in txError && (txError as { code: string }).code === "P2002") {
        await prisma.pendingUser.delete({ where: { token } }).catch(() => {});
        return redirect("/auth/signin?error=EmailAlreadyTaken");
      }
      throw txError;
    }

    return redirect("/auth/verify-success");
  } catch (error) {
    // Next.js redirect() works by throwing — re-throw it
    if (isRedirectError(error)) {
      throw error;
    }
    logger.error("Verification error", error);
    return redirect("/auth/signin?error=VerificationFailed");
  }
}
