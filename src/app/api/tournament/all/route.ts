import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Tournament from "@/model/tournament";

export async function GET() {
  try {
    await connectDB();
    const tournaments = await Tournament.find()
      .populate("createdBy", "name email")
      .populate("players", "name avatar")
      .populate("winners.playerId", "name avatar")
      .sort({ date: 1 });

    return NextResponse.json(tournaments, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
