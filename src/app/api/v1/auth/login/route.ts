import { User, initDB } from "@/lib/db";
import { verifyPassword, signToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import { cookies } from 'next/headers'

export async function POST(request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const user = await User.findOne({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }
  const isValid = await verifyPassword(password, user.toJSON().password);
  if (!isValid) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const token = await signToken({ userId: user.toJSON().id });

  const response = NextResponse.json({ message: "Login successful", user: { id: user.toJSON().id, email: user.toJSON().email, username: user.toJSON().username } });

  response.cookies.set("token", token, {
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    secure: true,
    sameSite: "lax",
    httpOnly: true
  })

  return response;
}
