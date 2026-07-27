import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

import { connectDB } from "@/lib/mongodb";
import User from "@/model/user";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      amount,
    } = await req.json();

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !userId
    ) {
      return NextResponse.json(
        { message: "Missing payment details" },
        { status: 400 },
      );
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { message: "Invalid payment signature" },
        { status: 400 },
      );
    }

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Wallet update
    user.wallet += Number(amount);

    // Transaction History
    user.transactions.push({
      type: "credit",
      amount: Number(amount),
      reason: "Wallet Recharge",
      date: new Date(),
    });

    await user.save();

    return NextResponse.json({
      success: true,
      message: "Payment Verified Successfully",
      wallet: user.wallet,
      user,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Payment Verification Failed" },
      { status: 500 },
    );
  }
}
