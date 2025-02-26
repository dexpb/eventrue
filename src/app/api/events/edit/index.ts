import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db";

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id, title, description, startTime, endTime } = await req.json();

  // Verifica se o usuário é o criador do evento
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event || event.creatorId !== session.user.id) {
    return NextResponse.json({ error: "Apenas o criador pode editar este evento" }, { status: 403 });
  }

  const updatedEvent = await prisma.event.update({
    where: { id },
    data: { title, description, startTime: new Date(startTime), endTime: new Date(endTime) },
  });

  return NextResponse.json(updatedEvent);
}
