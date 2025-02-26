import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db";

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);

  // Verificando se a sessão está presente e se o usuário está autenticado
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Usuário não autenticado" }, { status: 401 });
  }

  const { eventId } = await req.json();

  if (!eventId) {
    return NextResponse.json({ error: "ID do evento é obrigatório" }, { status: 400 });
  }

  // Buscando o evento a ser excluído
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    return NextResponse.json({ error: "Evento não encontrado" }, { status: 404 });
  }

  // Verificando se o usuário autenticado é o criador do evento
  if (event.creatorId !== session.user.id) {
    return NextResponse.json({ error: "Você não tem permissão para excluir este evento" }, { status: 403 });
  }

  // Deletando o evento
  await prisma.event.delete({
    where: { id: eventId },
  });

  return NextResponse.json({ message: "Evento excluído com sucesso" });
}
