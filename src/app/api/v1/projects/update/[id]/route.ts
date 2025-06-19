import { Project, initDB } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request, { params }: { params: Promise<{ id: string }> }) {
    const {name, description, status} = request.json()
    const id = (await params).id
    const userId = await getUserFromRequest(request);
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const project = await Project.findOne({where:{id, userId}});
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    await project.update({
        name,
        description,
        status
    })

    return NextResponse.json({ message: "Project updated" });

}
