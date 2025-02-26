import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    console.log("📩 Recebendo request para criar evento...");

    const session = await getServerSession(authOptions);
    console.log("🔍 Sessão retornada:", session);

    if (!session || !session.user) {
      console.error("🚨 Erro: Usuário não autenticado");
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { title, description, startTime, endTime } = await req.json();
    console.log("📋 Dados recebidos:", { title, description, startTime, endTime });

    // Validação de dados
    if (!title || !description || !startTime || !endTime) {
      console.error("🚨 Erro: Dados inválidos");
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        creatorId: session.user.id,
      },
    });

    console.log("✅ Evento criado com sucesso:", event);
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("🔥 Erro ao criar evento:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}