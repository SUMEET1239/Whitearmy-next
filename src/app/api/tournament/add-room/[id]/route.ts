import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { connectDB } from "@/lib/mongodb";
import Tournament from "@/model/tournament";
import User from "@/model/user";

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

    // Sirf leader/admin hi room add kar sakta hai
    if (admin.role !== "leader" && admin.role !== "admin") {
      return NextResponse.json(
        { message: "Only Leader/Admin can add room" },
        { status: 403 },
      );
    }

    const { id } = await params;

    const { roomId, roomPass } = await req.json();

    if (!roomId || !roomPass) {
      return NextResponse.json(
        { message: "Room ID and Password are required" },
        { status: 400 },
      );
    }

    const tournament = await Tournament.findById(id);

    if (!tournament) {
      return NextResponse.json(
        { message: "Tournament not found" },
        { status: 404 },
      );
    }

    tournament.roomId = roomId;
    tournament.roomPass = roomPass;

    await tournament.save();

    return NextResponse.json({
      message: "Room details added successfully",
      tournament,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
