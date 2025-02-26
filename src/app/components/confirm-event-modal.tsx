import { X } from "lucide-react";
import { FormEvent, ReactNode } from "react";

interface ConfirmTripModalProps {
  closeConfirmTripModal: () => void;
 
  createTrip: (event: FormEvent<HTMLFormElement>) => void;
  children?: ReactNode;
}
export function ConfirmTripModal({
  children,
  closeConfirmTripModal,
  createTrip,
}: ConfirmTripModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="w-[640px] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="font-lg font-semibold">
              Confirmar criação de viagem
            </h2>
            <button>
              <X
                className="size-5 text-zinc-400"
                onClick={closeConfirmTripModal}
              />
            </button>
          </div>
          {children}
        </div>

        <form onSubmit={createTrip} className="space-y-3">
          <div className="flex items-center flex-col gap-10">

          <button type="button" onClick={closeConfirmTripModal}>
            Cancelar
          </button>
          <button type="submit">Confirmar criação da viagem</button>
          </div>
        </form>
      </div>
    </div>
  );
}
