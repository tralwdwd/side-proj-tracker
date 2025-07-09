export const runtime = 'nodejs'; 
import { NextRequest, NextResponse } from "next/server";
import { initDB, Project, Note } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string, noteid: string }> }) {
    const projectId = (await params).id
    const noteId = (await params).noteid
    const userId = await getUserFromRequest(request);
      if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const project = await Project.findOne({where: {id: projectId, userId}})
    
    if(!project) {
        return NextResponse.json({error: "Project Not Found or Not owned by user."}, {status: 404})
    }
    const note = await Note.findByPk(noteId)
    if(!project) {
        return NextResponse.json({error: "Note Not Found."}, {status: 404})
    }
    await note.destroy()
    return NextResponse.json({message: "Note deleted"}, {status: 200})
}
