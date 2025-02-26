import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Usuário não autenticado" }, { status: 401 });
    }

    const events = await prisma.event.findMany({
      where: {
        OR: [
          { creatorId: session.user.id },
          { invited: { some: { id: session.user.id } } },
        ],
      },
      include: { creator: true, invited: true },
    });

    return NextResponse.json(events);
  } catch (error: unknown) {
    // Verificando se o erro é um objeto Error para acessar a mensagem
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    // Caso o erro não seja uma instância de Error
    return NextResponse.json({ error: "Erro desconhecido" }, { status: 500 });
  }
}
