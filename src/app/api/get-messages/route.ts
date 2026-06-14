import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 },
    );
  }
  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    const foundUser = await UserModel.findById(userId);

    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "user not found",
        },
        { status: 404 },
      );
    }

    // Sort messages by creation date descending
    const sortedMessages = [...foundUser.messages].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return Response.json(
      {
        success: true,
        messages: sortedMessages,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("failed to get messages of user",error);
    return Response.json(
      {
        success: false,
        message: "failed to get messages of user",
      },
      { status: 500 },
    );
  }
}
