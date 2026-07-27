import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Player from "@/model/player";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const { id } = await params;

    const player = await Player.findOne({ userId: id }).populate(
      "userId",
      "name email avatar wallet wins points",
    );

    if (!player) {
      return NextResponse.json(
        { message: "Player not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(player);
  } catch (error) {
    console.error(error);

    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
