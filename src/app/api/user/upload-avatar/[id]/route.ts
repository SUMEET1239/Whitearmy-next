import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

import { connectDB } from "@/lib/mongodb";
import User from "@/model/user";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const { id } = await params;

    const formData = await req.formData();

    const file = formData.get("avatar") as File;

    if (!file) {
      return NextResponse.json(
        { message: "No image selected" },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const tempPath = path.join(process.cwd(), file.name);

    await writeFile(tempPath, buffer);

    const uploaded = await cloudinary.uploader.upload(tempPath, {
      folder: "whitearmy/avatar",
    });

    const user = await User.findByIdAndUpdate(
      id,
      {
        avatar: uploaded.secure_url,
      },
      {
        new: true,
      },
    ).select("-password");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Avatar Updated",
      user,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
