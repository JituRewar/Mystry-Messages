import { sendMail } from "@/helpers/mail";
import { getVerificationEmailTemplate } from "@/emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

/**
 * Reusable function to send a verification email (OTP) to the user.
 * Uses the custom Gmail SMTP transporter and professional HTML template under the hood.
 * 
 * @param email - Recipient's email address
 * @param username - Recipient's username
 * @param verifyCode - The 6-digit OTP code to verify
 * @returns Promise<ApiResponse>
 */
export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string,
): Promise<ApiResponse> {
  try {
    // Generate the professional HTML template
    const emailHtml = getVerificationEmailTemplate(username, verifyCode);
    
    // Dispatch the email using the reusable Nodemailer mail helper
    const emailResponse = await sendMail({
      to: email,
      subject: "Mystery Message || Verification Code",
      html: emailHtml,
    });

    if (!emailResponse.success) {
      console.error("Verification email dispatch failed:", emailResponse.message);
      return { 
        success: false, 
        message: emailResponse.message || "Failed to send verification email" 
      };
    }

    return { 
      success: true, 
      message: "Verification email sent successfully" 
    };
  } catch (emailError) {
    console.error("Error in sendVerificationEmail wrapper:", emailError);
    return { 
      success: false, 
      message: "Failed to send verification email due to an internal server error" 
    };
  }
}
