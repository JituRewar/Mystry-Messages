import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helper/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    const existingUSerVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUSerVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "username is already taken",
        },
        { status: 400 },
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exist with this email",
          },
          { status: 400 },
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);

        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date(); // new keyword se object milta hai
      // and object ko update kar sakte hai
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });
      await newUser.save();
    }

    //send verification email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode,
    );

    if (!emailResponse.success) {
      console.log(`\n======================================\n[TESTING VERIFICATION CODE] User: ${username}, Code: ${verifyCode}\n======================================\n`);
      return Response.json(
        {
          success: true,
          message: "User registered. (Email failed to send. Please check server console for verification code)",
        },
        { status: 201 },
      );
    }

    return Response.json(
      {
        success: true,
        message: "User registerd successfully. Please verify your email",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("error while registering user", error);
    return Response.json(
      {
        success: false,
        message: "Error while registering user",
      },
      {
        status: 500,
      },
    );
  }
}
