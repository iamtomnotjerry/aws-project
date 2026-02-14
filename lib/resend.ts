import { Resend } from 'resend';

// Khởi tạo Lazy: Nếu chưa có Key (lúc Build) thì chưa tạo client để tránh crash.
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export const sendVerificationEmail = async (email: string, token: string) => {
  if (!resend) {
    console.warn("Email service chưa được khởi tạo. Hãy cấu hình RESEND_API_KEY trên AWS.");
    return; 
  }

  const confirmLink = `${process.env.NEXTAUTH_URL}/api/auth/verify?token=${token}`;

  await resend.emails.send({
    from: 'Bao\'s Blog <no-reply@studymate.io.vn>',
    to: email,
    subject: 'Confirm your email - Bao\'s Blog',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <h2 style="color: #2563eb;">Welcome to Bao's Blog!</h2>
        <p>Thank you for signing up. Please confirm your email address to unlock all features.</p>
        <div style="margin: 30px 0;">
          <a href="${confirmLink}" 
             style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            Verify Email Address
          </a>
        </div>
        <p style="font-size: 0.875rem; color: #666;">
          If you didn't create an account, you can safely ignore this email.
        </p>
      </div>
    `
  });
};
