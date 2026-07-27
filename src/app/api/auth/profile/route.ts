import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { connectDB } from "@/lib/mongodb";
import User from "@/model/user";
import Player from "@/model/player";

export async function GET(req: Request) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);

    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const { userId, uid, gameName, rank, role, level } = body;

    let player = await Player.findOne({ userId });

    if (player) {
      player.uid = uid;
      player.gameName = gameName;
      player.rank = rank;
      player.role = role;
      player.level = level;

      await player.save();
    } else {
      player = await Player.create({
        userId,
        uid,
        gameName,
        rank,
        role,
        level,
      });
    }

    return NextResponse.json(player);
  } catch (error) {
    console.error(error);

    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
