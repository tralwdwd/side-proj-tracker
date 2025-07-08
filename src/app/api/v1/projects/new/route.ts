import { NextRequest, NextResponse } from "next/server";
import { initDB, Project } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(request: NextRequest) {
    const userId = await getUserFromRequest(request);
      if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {name, description} = await request.json();


    const project = await Project.create({name, description, userId})

    return NextResponse.json({message: "Project created", project}, {status: 201})
}