import { User, initDB } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function DELETE(request) {
  const userId = await getUserFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await User.findByPk(userId as string | undefined);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  await user.destroy();

  const response = NextResponse.json({ message: "User deleted" });

  // Clear token cookie
  response.cookies.set("token", "", {
    maxAge: -1,
    path: "/",
  });

  return response;
}
