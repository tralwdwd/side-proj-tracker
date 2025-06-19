import { NextRequest, NextResponse } from "next/server";
import { initDB, Project, Note } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const projectId = (await params).id
    const userId = await getUserFromRequest(request);
      if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const project = await Project.findOne({where: {id: projectId, userId}})
    
    if(!project) {
        return NextResponse.json({error: "Project Not Found or Not owned by user."}, {status: 404})
    }
    const notes = await Note.findAll({where: {projectId}})

    return NextResponse.json({message: "Notes Found", notes}, {status: 200})
}