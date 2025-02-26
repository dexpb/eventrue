"use client";

import { FormEvent, useState } from "react";
import { Calendar, Tag, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface CreateEventModalProps {
  closeCreateEventModal: () => void;
}

export function CreateEventModal({ closeCreateEventModal }: CreateEventModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function createEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const data = new FormData(event.currentTarget);
    const title = data.get("title")?.toString();
    const description = data.get("description")?.toString();
    const startTime = data.get("startTime")?.toString();
    const endTime = data.get("endTime")?.toString();

    if (!title || !description || !startTime || !endTime) {
      alert("Preencha todos os campos!");
      setLoading(false);
      return;
    }

    try {
      console.log("📤 Enviando dados para API...");
      const response = await fetch("/events", {
        method: "POST",
        body: JSON.stringify({ title, description, startTime, endTime }),
        headers: { "Content-Type": "application/json" },
      });

      console.log("📥 Resposta da API:", response);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao criar evento");
      }

      router.refresh(); // Atualiza a página para refletir mudanças
      closeCreateEventModal(); // Fecha o modal
    } catch (error) {
      console.error("🔥 Erro ao criar evento:", error);
      alert("Erro ao criar evento!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="w-[640px] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Criar Novo Evento</h2>
            <button onClick={closeCreateEventModal}>
              <X className="size-5 text-zinc-400" />
            </button>
          </div>

          <p className="text-sm text-zinc-400">
            Todos convidados podem visualizar os eventos criados.
          </p>
        </div>

        <form onSubmit={createEvent} className="space-y-3">
          <div className="h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
            <Tag className="text-zinc-400 size-5" />
            <input
              name="title"
              placeholder="Nome do evento"
              className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1"
              required
            />
          </div>

          <div className="h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
            <input
              name="description"
              placeholder="Descrição do evento"
              className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1"
              required
            />
          </div>

          <div className="h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
            <Calendar className="text-zinc-400 size-5" />
            <input
              type="datetime-local"
              name="startTime"
              className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1"
              required
            />
          </div>

          <div className="h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
            <Calendar className="text-zinc-400 size-5" />
            <input
              type="datetime-local"
              name="endTime"
              className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white rounded-lg py-3 font-semibold"
          >
            {loading ? "Salvando..." : "Criar Evento"}
          </button>
        </form>
      </div>
    </div>
  );
}
