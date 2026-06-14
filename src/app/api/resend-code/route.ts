import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { sendVerificationEmail } from "@/helper/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username } = await request.json();
    const decodedUserName = decodeURIComponent(username);
    const user = await UserModel.findOne({ username: decodedUserName });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 },
      );
    }

    if (user.isVerified) {
      return Response.json(
        {
          success: false,
          message: "Account is already verified",
        },
        { status: 400 },
      );
    }

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.verifyCode = verifyCode;
    user.verifyCodeExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    await user.save();

    const emailResponse = await sendVerificationEmail(
      user.email,
      user.username,
      verifyCode,
    );

    if (!emailResponse.success) {
      console.log(`\n======================================\n[TESTING RESEND CODE] User: ${user.username}, Code: ${verifyCode}\n======================================\n`);
      return Response.json(
        {
          success: true,
          message: "Verification code regenerated",
        },
        { status: 200 },
      );
    }

    return Response.json(
      {
        success: true,
        message: "Verification code sent to your email successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error resending verification code", error);
    return Response.json(
      {
        success: false,
        message: "Error while resending verification code",
      },
      { status: 500 },
    );
  }
}
