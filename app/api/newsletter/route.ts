import { ApiUtils } from "@/lib/api-response";
import { Resend } from "resend";
import { NextRequest } from "next/server";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return ApiUtils.error("Email không hợp lệ", 400);
    }

    if (!resend) {
      console.warn("RESEND_API_KEY is missing. Subscription simulation successful.");
      return ApiUtils.success(null, "Cảm ơn bạn đã đăng ký! (Simulated)");
    }

    // In a real scenario, you'd add them to a contact list or send a welcome email.
    // For now, we'll send a notification to the admin (you) about the new subscriber.
    await resend.emails.send({
      from: "Newsletter <no-reply@studymate.io.vn>",
      to: "bao.dev.admin@studymate.io.vn", // Or the user's email
      subject: "New Subscriber: " + email,
      html: `<p>Người dùng <strong>${email}</strong> vừa đăng ký nhận bản tin từ blog của bạn!</p>`,
    });

    return ApiUtils.success(null, "Cảm ơn bạn đã đăng ký nhận bản tin!");
  } catch (error) {
    return ApiUtils.serverError(error);
  }
}
