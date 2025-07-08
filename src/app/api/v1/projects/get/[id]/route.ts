import { NextRequest, NextResponse } from "next/server";
import { initDB, Project } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { Op } from "sequelize";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id

    const userId = await getUserFromRequest(request);
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const project = await Project.findOne({where: {id, userId}})

    if(!project) {
        return NextResponse.json({error: "Project Not Found or Not owned by user."}, {status: 404})
    }

    return NextResponse.json({message: "Project Found", project: project.toJSON()}, {status: 200})

}