import { ApiUtils } from "@/lib/api-response";
import { signupSchema } from "@/schemas/auth.schema";
import { AuthService } from "@/services/auth.service";
import { logger } from "@/lib/logger";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = signupSchema.safeParse(body);

    if (!result.success) {
      return ApiUtils.error(result.error.issues[0].message, 400);
    }

    const { email, name, password } = result.data;

    try {
      await AuthService.signupUser({ email, name, password });
      return ApiUtils.success(null, "Please check your email to verify your account.");
    } catch (e: unknown) {
      if (e instanceof Error && e.message === "User already exists") {
        return ApiUtils.error("Email is already registered", 400);
      }
      throw e;
    }
  } catch (error) {
    logger.error("Signup error", error, { route: "POST /api/auth/signup" });
    return ApiUtils.serverError(error);
  }
}
