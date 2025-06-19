import { NextRequest, NextResponse } from "next/server";
import { initDB, Project } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { Op } from "sequelize";

export async function GET(request: NextRequest) {
    const userId = await getUserFromRequest(request);
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projects = await Project.findAll({where:{userId}})

    return NextResponse.json({message: "Projects Found", projects: projects}, {status: 200})

}