"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react"; 
import { EyeIcon, Lock, UserRound } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import EventrueLogo from "./eventrue-logo.png"


const loginSchema = z.object({
  email: z
    .string()
    .email("Formato de email inválido")
    .nonempty("Email é obrigatório"),
  password: z
    .string()
    .min(6, "A senha deve ter no mínimo 6 caracteres")
    .nonempty("Senha é obrigatória"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Home() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });


  const onSubmit = async (data: LoginFormData) => {

    const response = await signIn("credentials", {
      redirect: false, 
      email: data.email,
      password: data.password,
    });

    if (response?.error) {
      alert("Erro ao fazer login: " + response.error);
    } else {
 
      alert("Login bem-sucedido!");
      window.location.href = "/events"; 
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="flex justify-center flex-col items-center h-full gap-10">
        <Image src={EventrueLogo} alt="Eventrue logo"/>
        <h1 className="text-3xl font-bold">Faça seu login</h1>

        {/* Formulário */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col p-16 gap-5 bg-zinc-900 rounded-xl"
        >
          <label htmlFor="" className="font-bold text-4xl text-center">
            Log in
          </label>

          {/* Campo de Email */}
          <div className="relative">
            <span className="absolute left-2 top-5">
              <UserRound className="text-zinc-800" />
            </span>
            <input
              className={`w-80 bg-white text-zinc-950 py-5 px-12 rounded-xl ${
                errors.email ? "border-red-500" : ""
              }`}
              type="email"
              placeholder="Email"
              {...register("email")}
            />
          </div>
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}

          {/* Campo de Senha */}
          <div className="relative">
            <span className="absolute bottom-5 left-3">
              <Lock className="text-zinc-800" />
            </span>
            <input
              className={`w-80 bg-white text-zinc-950 py-5 px-12 rounded-xl ${
                errors.password ? "border-red-500" : ""
              }`}
              placeholder="Senha"
              type={isPasswordVisible ? "text" : "password"}
              {...register("password")}
            />
          </div>
            {errors.password && (
              <span className="text-red-500 text-sm">
                {errors.password.message}
              </span>
            )}
            <button
              type="button"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              <EyeIcon className="text-zinc-800 absolute top-5 right-3 cursor-pointer" />
            </button>

          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-primary rounded-lg p-7 font-medium text-secondary text-xl h-11 flex items-center justify-center"
            >
              Fazer Login
            </button>
          </div>
        </form>

        <div className="mt-4 p-4 rounded-2xl shadow-lg w-96 bg-zinc-900 flex flex-col items-center">
          <Link href="/register">
            <button className="bg-primary rounded-lg px-5 py-2 font-medium text-secondary text-xl flex items-center justify-center">
              Criar conta
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
