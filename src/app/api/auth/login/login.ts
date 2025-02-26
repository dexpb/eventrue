// api/auth/login.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db"; // Supondo que você esteja usando Prisma

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return NextResponse.json({ error: "Usuário não encontrado" }, { status: 400 });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return NextResponse.json({ error: "Senha incorreta" }, { status: 400 });
  }

  // Se as credenciais forem válidas, você pode gerar um token JWT e retorná-lo
  const token = "seu_token_aqui"; // Gerar token JWT aqui

  return NextResponse.json({ message: "Login bem-sucedido!", token });
}
