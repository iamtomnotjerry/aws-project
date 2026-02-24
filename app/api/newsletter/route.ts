import { ApiUtils } from "@/lib/api-response";
import { Resend } from "resend";
import { NextRequest } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

function escapeHtml(str: string): string {
  return str.replace(/[<>&"']/g, (c) =>
    ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;' })[c] ?? c
  );
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "anonymous";
    const rl = await rateLimit(`newsletter_${ip}`, { limit: 3, windowMs: 60000 });
    if (!rl.success) {
      return ApiUtils.error("Too many requests. Please try again later.", 429);
    }

    const { email } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return ApiUtils.error("Invalid email address", 400);
    }

    if (!resend) {
      console.warn("RESEND_API_KEY is missing. Subscription simulation successful.");
      return ApiUtils.success(null, "Thank you for subscribing! (Simulated)");
    }

    const sanitizedEmail = escapeHtml(email);

    await resend.emails.send({
      from: "Newsletter <no-reply@studymate.io.vn>",
      to: "bao.dev.admin@studymate.io.vn",
      subject: "New Subscriber: " + sanitizedEmail,
      html: `<p>Người dùng <strong>${sanitizedEmail}</strong> vừa đăng ký nhận bản tin từ blog của bạn!</p>`,
    });

    return ApiUtils.success(null, "Thank you for subscribing!");
  } catch (error) {
    return ApiUtils.serverError(error);
  }
}
