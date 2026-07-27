import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Player from "@/model/player";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { userId, uid, gameName, rank, role, level } = await req.json();

    const player = await Player.findOneAndUpdate(
      { userId },
      {
        userId,
        uid,
        gameName,
        rank,
        role,
        level: Number(level),
      },
      {
        new: true,
        upsert: true,
      },
    );

    return NextResponse.json(player);
  } catch (error) {
    console.error(error);

    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
