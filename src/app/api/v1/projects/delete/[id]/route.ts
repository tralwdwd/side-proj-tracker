import { Project, initDB } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id
    const userId = await getUserFromRequest(request);
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const project = await Project.findOne({where:{id, userId}});
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    await project.destroy();

    return NextResponse.json({ message: "Project deleted" });

}
