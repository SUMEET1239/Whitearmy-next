import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
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

    const existingUser = await User.findById(id);

    if (!existingUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const formData = await req.formData();

    const file = formData.get("avatar") as File;

    if (!file) {
      return NextResponse.json(
        { message: "No image selected" },
        { status: 400 },
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { message: "Only image files allowed" },
        { status: 400 },
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { message: "Image must be less than 5MB" },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

    const uploaded = await new Promise<{
      secure_url: string;
    }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "whitearmy/avatar",
        },

        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve({
              secure_url: result!.secure_url,
            });
          }
        },
      );

      streamifier.createReadStream(buffer).pipe(stream);
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

    return NextResponse.json({
      message: "Avatar Updated",
      user,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
