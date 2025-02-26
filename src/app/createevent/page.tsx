"use client";
import { InviteGuestsStep } from "../components/invite-guest-step";
import { DestinationAndDateStep } from "../components/event-date-step";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { FormEvent, useState } from "react";
import { InviteGuestsModal } from "../components/invite-guests-modal";
import { DateRange } from "react-day-picker";
import { ConfirmTripModal } from "../components/confirm-event-modal";

export default function Home() {
  const [isGuestsInputOpen, setIsGuestsInputOpen] = useState(false);
  const [isGuestsModalOpen, setIsGuestsModalOpen] = useState(false);
  const [isConfirmTripModalOpen, setIsConfirmTripModalOpen] = useState(false);
  const [emailsToInvite, setEmailsToInvite] = useState([
    "diego@rocketseat.com.br",
    "john@acme.com",
  ]);
  const [destination, setDestination] = useState("");

  const [eventStartAndEndDates, setEventStartAndEndDates] = useState<
    DateRange | undefined
  >();

  function openGuestsInput() {
    setIsGuestsInputOpen(true);
  }

  function closeGuestsInput() {
    setIsGuestsInputOpen(false);
  }

  function openGuestsModal() {
    setIsGuestsModalOpen(true);
  }

  function closeGuestsModal() {
    setIsGuestsModalOpen(false);
  }

  function openConfirmTripModal() {
    setIsConfirmTripModalOpen(true);
  }

  function closeConfirmTripModal() {
    setIsConfirmTripModalOpen(false);
  }

  function addNewEmailToInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const email = data.get("email")?.toString();

    if (!email) {
      return;
    }

    if (emailsToInvite.includes(email)) {
      return;
    }

    setEmailsToInvite([...emailsToInvite, email]);

    event.currentTarget.reset();
  }

  function removeEmailFromInvites(emailToRemove: string) {
    const newEmailList = emailsToInvite.filter(
      (email) => email !== emailToRemove
    );

    setEmailsToInvite(newEmailList);
  }

  async function createTrip(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!destination) {
      return;
    }

    if (!eventStartAndEndDates?.from || !eventStartAndEndDates?.to) {
      return;
    }

    if (emailsToInvite.length === 0) {
      return;
    }
  }

  const { data: session } = useSession(); // Obtendo os dados da sessão

  // Verifica se há uma sessão ativa e pega o nome do usuário
  const userName = session?.user?.name || "Usuário"; // Caso o nome não esteja disponível, exibe "Usuário"

  return (
    <div className="h-screen flex items-center justify-center bg-pattern bg-no-repeat bg-center">
      <div className="max-w-3xl w-full flex items-center justify-evenly flex-col px-6 text-center space-y-10">
        <Image
          src="/eventrue-logo.png"
          width={500}
          height={50}
          alt="Eventrue logo"
        />
        {/* Exibindo o nome do usuário dinamicamente */}
        <h1 className="text-xl">Bem-vindo, {userName}!</h1>
        <h2 className="text-xl">Vamos criar um evento?</h2>

        <div className="space-y-4">
          <DestinationAndDateStep
            closeGuestsInput={closeGuestsInput}
            isGuestsInputOpen={isGuestsInputOpen}
            openGuestsInput={openGuestsInput}
            setDestination={setDestination}
            setEventStartAndEndDates={setEventStartAndEndDates}
            eventStartAndEndDates={eventStartAndEndDates}
          />
          {isGuestsInputOpen && (
            <InviteGuestsStep
              emailsToInvite={emailsToInvite}
              openConfirmTripModal={openConfirmTripModal}
              openGuestsModal={openGuestsModal}
            />
          )}
        </div>
        {isGuestsModalOpen && (
          <InviteGuestsModal
            emailsToInvite={emailsToInvite}
            addNewEmailToInvite={addNewEmailToInvite}
            closeGuestsModal={closeGuestsModal}
            removeEmailFromInvites={removeEmailFromInvites}
          />
        )}

        {isConfirmTripModalOpen && (
          <ConfirmTripModal
            closeConfirmTripModal={closeConfirmTripModal}
            createTrip={createTrip}
          >
            <p className="text-sm text-zinc-400">
              Para concluir a criação da viagem para{" "}
              <span className="text-zinc-100 font-bold uppercase">
                {destination}
              </span>
              , <span className="font-semibold text-zinc-100"></span> preencha
              seus dados abaixo:
            </p>
          </ConfirmTripModal>
        )}
      </div>
    </div>
  );
}
