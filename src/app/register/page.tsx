"use client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

// Importando React Hook Form e Zod
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Definindo o esquema de validação com Zod
const registerSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  email: z.string().email("Formato de email inválido").nonempty("Email é obrigatório"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres").nonempty("Senha é obrigatória"),
  confirmPassword: z.string().min(6, "A confirmação de senha deve ter no mínimo 6 caracteres").nonempty("Confirmação de senha é obrigatória"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {
  // Usando React Hook Form com Zod
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  // Função chamada ao submeter o formulário
  const onSubmit = async (data: RegisterFormData) => {
    // Envia os dados para o backend
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      // Usuário criado com sucesso, você pode redirecionar ou mostrar uma mensagem
      console.log("Conta criada com sucesso", result);
      alert("Conta criada com sucesso!");
      // Redireciona para a página de login ou onde preferir
      window.location.href = "/login"; // Exemplo de redirecionamento
    } else {
      // Mostra o erro caso não tenha dado certo
      console.log("Erro:", result.error);
      alert(result.error || "Erro desconhecido ao criar a conta.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="flex justify-center flex-col items-center h-full gap-10">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col p-16 gap-10 bg-zinc-900 rounded-xl">
          <label htmlFor="" className="font-bold text-4xl text-center">Criar conta</label>
          
          {/* Campo Nome */}
          <input
            className={`w-80 bg-white text-zinc-950 py-5 px-5 rounded-xl ${errors.name ? "border-red-500" : ""}`}
            type="text"
            placeholder="Digite seu nome"
            {...register("name")}
          />
          {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}

          {/* Campo Email */}
          <input
            className={`w-80 bg-white text-zinc-950 py-5 px-5 rounded-xl ${errors.email ? "border-red-500" : ""}`}
            type="email"
            placeholder="Digite seu email"
            {...register("email")}
          />
          {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}

          {/* Campo Senha */}
          <input
            className={`w-80 bg-white text-zinc-950 py-5 px-5 rounded-xl ${errors.password ? "border-red-500" : ""}`}
            type="password"
            placeholder="Digite sua senha"
            {...register("password")}
          />
          {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}

          {/* Campo Confirmar Senha */}
          <input
            className={`w-80 bg-white text-zinc-950 py-5 px-5 rounded-xl ${errors.confirmPassword ? "border-red-500" : ""}`}
            type="password"
            placeholder="Confirme sua senha"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && <span className="text-red-500 text-sm">{errors.confirmPassword.message}</span>}

          <div className="flex items-center flex-col gap-10 justify-center">
            <Link href="/">
              <button className="bg-zinc-800 rounded-lg px-5 py-2 font-medium text-primary text-xl flex items-center justify-center">
                Cancelar
              </button>
            </Link>
            <button
              type="submit"
              className="bg-primary rounded-lg gap-2 px-7 py-2 font-medium text-secondary text-xl flex items-center justify-center"
            >
              Criar conta
              <ArrowRight className="size-6" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
