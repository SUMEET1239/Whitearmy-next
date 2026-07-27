import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Player from "@/model/player";

export async function GET() {
  try {
    await connectDB();

    const players = await Player.find()
      .populate("userId", "name avatar wins")
      .sort({ points: -1 });

    return NextResponse.json(players);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to fetch players" },
      { status: 500 },
    );
  }
}
