import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import User from "@/model/user";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const { id } = await params;

    const user = await User.findById(id).select("transactions");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const transactions = [...(user.transactions || [])].sort(
      (a: any, b: any) =>
        new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
