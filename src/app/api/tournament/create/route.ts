import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { connectDB } from "@/lib/mongodb";
import Tournament from "@/model/tournament";
import User from "@/model/user";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };

    const user = await User.findById(decoded.id);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Sirf admin/leader tournament create kar sakta hai
    if (user.role !== "leader") {
      return NextResponse.json(
        { message: "Only leader can create tournament" },
        { status: 403 },
      );
    }

    const { title, game, date, entryFee, prizePool, maxPlayers } =
      await req.json();

    if (!title || !game || !date) {
      return NextResponse.json(
        { message: "Title, game and date are required" },
        { status: 400 },
      );
    }

    const tournament = await Tournament.create({
      title,
      game,
      date,
      entryFee: Number(entryFee) || 0,
      prizePool: Number(prizePool) || 0,
      maxPlayers: Number(maxPlayers) || 0,
      createdBy: user._id,
    });

    return NextResponse.json(
      {
        message: "Tournament created successfully",
        tournament,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
