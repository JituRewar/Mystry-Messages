import nodemailer from "nodemailer";

// Ensure environment variables are loaded in production/development
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

if (!emailUser || !emailPass) {
  console.warn(
    "Warning: EMAIL_USER or EMAIL_PASS environment variables are not defined. Email dispatch might fail."
  );
}

// Configure the Gmail SMTP transporter
// Note: 'service: "gmail"' automatically handles host, port, and security defaults
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: emailUser,
    pass: emailPass,
  },
});

// Define type interface for sendMail function parameters
export interface SendMailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

/**
 * Reusable utility to send emails via Gmail SMTP transporter.
 * Uses async/await and includes error handling.
 * 
 * @param options - Destructured properties containing to, subject, html body, and optional text fallback
 * @returns A promise resolving to an object indicating success or failure status
 */
export async function sendMail({ to, subject, html, text }: SendMailOptions) {
  try {
    const info = await transporter.sendMail({
      from: `"Mystery Message" <${emailUser}>`,
      to,
      subject,
      text: text || html.replace(/<[^>]*>/g, ""), // Strips HTML to create a plaintext fallback if text is not provided
      html,
    });

    return {
      success: true,
      message: "Email sent successfully",
      messageId: info.messageId,
    };
  } catch (error: any) {
    console.error("Nodemailer Error: Failed to send email via Gmail SMTP.", error);
    return {
      success: false,
      message: error.message || "Failed to send email via SMTP.",
    };
  }
}
