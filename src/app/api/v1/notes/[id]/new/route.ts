import { NextRequest, NextResponse } from "next/server";
import { initDB, Note, Project } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const projectId = (await params).id
    const userId = await getUserFromRequest(request);
      if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {content} = await request.json();
    const project = await Project.findOne({where: {id: projectId, userId}})
    
    if(!project) {
        return NextResponse.json({error: "Project Not Found or Not owned by user."}, {status: 404})
    }

    const note = await Note.create({content, projectId})

    return NextResponse.json({message: "Note created", note}, {status: 201})
}