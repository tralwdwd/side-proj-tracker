import { User, initDB } from "@/lib/db";
import { getUserFromRequest, hashPassword } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request) {
  const userId = await getUserFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { email, username, password } = await request.json();

  const user = await User.findByPk(userId as string | undefined);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const hashedPassword = password ? await hashPassword(password) : user.toJSON().password;

  await user.update({
    email: email ?? user.toJSON().email,
    username: username ?? user.toJSON().username,
    password: hashedPassword,
  });

  return NextResponse.json({ message: "User updated" });
}
