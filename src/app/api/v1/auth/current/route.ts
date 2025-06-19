import { User, initDB } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request) {
  const userId = await getUserFromRequest(request);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await User.findByPk(userId, {
    attributes: ["id", "email", "username"], // exclude password
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ user });
}
