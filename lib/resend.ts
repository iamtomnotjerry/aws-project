import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${process.env.NEXTAUTH_URL}/api/auth/verify?token=${token}`;

  await resend.emails.send({
    from: 'Bao\'s Blog <onboarding@resend.dev>',
    to: email,
    subject: 'Confirm your email - Bao\'s Blog',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <h2 style="color: #2563eb;">Welcome to Bao's Blog!</h2>
        <p>Thank you for signing up. Please confirm your email address to unlock all features, including the ability to write stories and manage your profile.</p>
        <div style="margin: 30px 0;">
          <a href="${confirmLink}" 
             style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; rounded: 8px; font-weight: bold; display: inline-block;">
            Verify Email Address
          </a>
        </div>
        <p style="font-size: 0.875rem; color: #666;">
          If you didn't create an account, you can safely ignore this email.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 0.75rem; color: #999;">
          &copy; 2026 Bao's Blog. All rights reserved.
        </p>
      </div>
    `
  });
};
