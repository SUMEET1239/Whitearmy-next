import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { connectDB } from "@/lib/mongodb";
import Tournament from "@/model/tournament";
import User from "@/model/user";
import Player from "@/model/player";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
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

    const admin = await User.findById(decoded.id);

    if (!admin) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (admin.role !== "leader" && admin.role !== "admin") {
      return NextResponse.json(
        { message: "Only Leader/Admin can declare result" },
        { status: 403 },
      );
    }

    const { id } = await params;

    const { winners } = await req.json();

    const tournament = await Tournament.findById(id);

    if (!tournament) {
      return NextResponse.json(
        { message: "Tournament not found" },
        { status: 404 },
      );
    }

    if (tournament.resultDeclared) {
      return NextResponse.json(
        { message: "Result already declared" },
        { status: 400 },
      );
    }

    tournament.winners = winners;
    tournament.resultDeclared = true;

    await tournament.save();

    // Update Players + Users
    for (const winner of winners) {
      const player = await Player.findById(winner.playerId);

      if (!player) continue;

      const user = await User.findById(player.userId);

      if (!user) continue;

      if (winner.position === 1) {
        player.points += 100;
        user.points += 100;

        player.wins = (player.wins || 0) + 1;
        user.wins = (user.wins || 0) + 1;
      }

      if (winner.position === 2) {
        player.points += 60;
        user.points += 60;
      }

      if (winner.position === 3) {
        player.points += 30;
        user.points += 30;
      }

      await player.save();
      await user.save();
    }

    return NextResponse.json({
      message: "Result Declared Successfully",
      tournament,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
