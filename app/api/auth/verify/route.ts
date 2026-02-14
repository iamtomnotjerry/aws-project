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
    // 1. Find PendingUser by token
    const pendingUser = await prisma.pendingUser.findUnique({
      where: { token },
    });

    if (!pendingUser) {
      // Fallback for old flow or check VerificationToken for other purposes
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

    // Check if email was taken by another user during the pending period
    const emailTaken = await prisma.user.findUnique({
      where: { email: pendingUser.email },
    });

    if (emailTaken) {
      await prisma.pendingUser.delete({ where: { token } });
      return redirect("/auth/signin?error=EmailAlreadyTaken");
    }

    // Promote PendingUser to User
    await prisma.$transaction([
      prisma.user.create({
        data: {
          email: pendingUser.email,
          name: pendingUser.name,
          password: pendingUser.password,
          emailVerified: new Date(),
          image: `https://ui-avatars.com/api/?name=${pendingUser.name || "User"}&background=random`,
        } as any,
      }),
      prisma.pendingUser.delete({
        where: { token },
      }),
    ]);

    return redirect("/auth/verify-success");
  } catch (error) {
    console.error("Verification error:", error);
    return redirect("/auth/signin?error=VerificationFailed");
  }
}
