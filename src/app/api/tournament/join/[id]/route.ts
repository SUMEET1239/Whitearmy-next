import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { connectDB } from "@/lib/mongodb";
import Tournament from "@/model/tournament";
import User from "@/model/user";
import { sendEmail } from "@/lib/sendEmail";

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

    const { id } = await params;

    const user = await User.findById(decoded.id);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const tournament = await Tournament.findById(id);

    if (!tournament) {
      return NextResponse.json(
        { message: "Tournament not found" },
        { status: 404 },
      );
    }

    if (
      tournament.players.some(
        (playerId: any) => playerId.toString() === user._id.toString(),
      )
    ) {
      return NextResponse.json({ message: "Already Joined" }, { status: 400 });
    }

    if (
      tournament.maxPlayers > 0 &&
      tournament.players.length >= tournament.maxPlayers
    ) {
      return NextResponse.json({ message: "Tournament Full" }, { status: 400 });
    }

    if (user.wallet < tournament.entryFee) {
      return NextResponse.json(
        { message: "Insufficient Wallet Balance" },
        { status: 400 },
      );
    }

    user.wallet -= tournament.entryFee;

    user.transactions.push({
      type: "debit",
      amount: tournament.entryFee,
      reason: `Joined ${tournament.title}`,
      date: new Date(),
    });

    await user.save();

    tournament.players.push(user._id);

    await tournament.save();

    // Email notification to player

    await sendEmail(
      user.email,
      "Tournament Joined Successfully 🔥",
      `
      <div style="font-family:Arial;padding:20px">

        <h2>🔥 WhiteArmy Gaming</h2>

        <p>Hello ${user.name},</p>

        <p>
          You have successfully joined the tournament.
        </p>

        <h3>${tournament.title}</h3>

        <p>🎮 Game: ${tournament.game}</p>

        <p>📅 Date: ${tournament.date}</p>

        <p>
          💰 Entry Fee Paid: ₹${tournament.entryFee}
        </p>

        <p>
          👥 Players:
          ${tournament.players.length}/${tournament.maxPlayers}
        </p>

        <br/>

        <p>
          Get ready and show your skills! 🎮🔥
        </p>

        <b>
          WhiteArmy Gaming
        </b>

      </div>
      `,
    );

    return NextResponse.json({
      message: "Tournament Joined Successfully",
      wallet: user.wallet,
      tournament,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
