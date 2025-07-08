import { User, initDB } from "@/lib/db";
import { hashPassword, signToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { email, username, password } = await request.json();

  if (!email || !password || !username) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const existing = await User.findOne({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "User already exists" }, { status: 409 });
  }

  const hashed = await hashPassword(password);
  const user = await User.create({ email, username, password: hashed });

  const token = await signToken({ userId: user.toJSON().id });

  const response = NextResponse.json({ message: "User created", user: { id: user.toJSON().id, email, username } }, { status: 201 });

  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    sameSite: "lax",
  });

  return response;
}
