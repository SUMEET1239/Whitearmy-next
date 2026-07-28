import { sendEmail } from "@/lib/sendEmail";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/mongodb";
import User from "@/model/user";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 },
      );
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Welcome Email

    await sendEmail(
      user.email,
      "Welcome to WhiteArmy 🔥",
      `
      <div style="font-family:Arial,sans-serif">

        <h2>
          Welcome ${user.name} 🎮
        </h2>

        <p>
          Your WhiteArmy account has been created successfully.
        </p>

        <p>
          You can now join gaming tournaments,
          compete with players and win rewards 🏆
        </p>

        <br/>

        <h3>
          🔥 WhiteArmy Gaming
        </h3>

      </div>
      `,
    );

    return NextResponse.json(
      {
        message: "Registration successful",
        user,
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
