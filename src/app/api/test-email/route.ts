import { NextResponse } from "next/server";
import { sendVerificationEmail } from "@/helper/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

/**
 * GET handler to run a test email dispatch using the Gmail SMTP configuration.
 * Call this route in your browser or postman via:
 * http://localhost:3000/api/test-email?to=your-email@example.com&username=desired_username
 * 
 * @param request - Request object containing query searchParams
 * @returns JSON response signaling email delivery status
 */
export async function GET(request: Request) {
  try {
    // Parse the target email address and optional username from query parameters
    const { searchParams } = new URL(request.url);
    const toEmail = searchParams.get("to");
    let username = searchParams.get("username");

    if (!toEmail) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing 'to' query parameter. Usage: /api/test-email?to=recipient@example.com&username=optional_username",
        },
        { status: 400 }
      );
    }

    // Connect to database to query the user if username wasn't explicitly provided in the query params
    if (!username) {
      try {
        await dbConnect();
        const user = await UserModel.findOne({ email: toEmail });
        if (user) {
          username = user.username;
        }
      } catch (dbError) {
        console.error("[Test Route] Database query failed:", dbError);
      }
    }

    // Fallback if no username is found in query params or database
    const finalUsername = username || "Mystery User";
    const testOtp = Math.floor(100000 + Math.random() * 900000).toString();

    console.log(`[Test Route] Attempting to send test verification email to: ${toEmail} for username: ${finalUsername}`);
    
    // Invoke the sendVerificationEmail helper
    const result = await sendVerificationEmail(toEmail, finalUsername, testOtp);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Verification email successfully dispatched to: ${toEmail}`,
        details: {
          username: finalUsername,
          verificationCode: testOtp,
        },
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: result.message || "Failed to send verification email.",
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("[Test Route] Unexpected exception:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected internal server error occurred while sending the test email.",
        error: error.message || String(error),
      },
      { status: 500 }
    );
  }
}
