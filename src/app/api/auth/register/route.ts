import { NextResponse } from "next/server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ error: "E-mail já cadastrado" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });
  
  return NextResponse.json({ 
    message: "Usuário cadastrado com sucesso!", 
    user: { id: user.id, name: user.name, email: user.email } // Não retorna a senha!
  });
  
}
