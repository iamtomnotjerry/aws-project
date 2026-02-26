import { ApiUtils } from "@/lib/api-response";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { logger } from "@/lib/logger";
import { AuthService } from "@/services/auth.service";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return redirect("/auth/signin?error=MissingToken");
  }

  try {
    const user = await AuthService.verifyToken(token);
    
    if (!user) {
      return redirect("/auth/signin?error=InvalidToken");
    }

    return redirect("/auth/verify-success");
  } catch (error: any) {
    if (isRedirectError(error)) throw error;
    
    if (error.message === "Token expired") return redirect("/auth/signin?error=TokenExpired");
    if (error.message === "Email already taken") return redirect("/auth/signin?error=EmailAlreadyTaken");

    logger.error("Verification error", error);
    return redirect("/auth/signin?error=VerificationFailed");
  }
}
