"use client"
import { Calendar, CheckCircle2, CircleDashed, ListCollapse, MapPin, Plus, Settings2, UserCog } from "lucide-react"
import { type FormEvent, useEffect, useState, useCallback } from "react"
import { CreateEventModal } from "./create-event-modal"
import { ConfirmTripModal } from "../components/confirm-event-modal"
import { useSession } from "next-auth/react"

interface Event {
  id: string
  title: string
  description: string
  startTime: string
  endTime: string
}

export default function TripDetailsPage() {
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false)
  const [isConfirmTripModalOpen, setIsConfirmTripModalOpen] = useState(false)
  const [events, setEvents] = useState<Event[]>([])
  const { data: session } = useSession() // Getting session data

  // Get user name from session or default to "User"
  const userName = session?.user?.name || "User"

  // Move fetchEvents outside useEffect so it can be called from other functions
  const fetchEvents = useCallback(async () => {
    try {
      console.log("🔄 Fetching events...")
      const response = await fetch("/api/events/list") // Make sure this route is correct
      const data = await response.json()
      console.log("📋 Events received:", data)
      setEvents(data)
    } catch (error) {
      console.error("🔥 Error fetching events:", error)
    }
  }, [])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  function openCreateEventModal() {
    setIsCreateEventModalOpen(true)
  }

  function closeCreateEventModal() {
    setIsCreateEventModalOpen(false)
  }

  function openConfirmTripModal() {
    setIsConfirmTripModalOpen(true)
  }

  function closeConfirmTripModal() {
    setIsConfirmTripModalOpen(false)
  }

  async function createTrip(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // Logic to create the trip
    // After creating the trip, close the confirmation modal
    closeConfirmTripModal()
    // Update the events list
    await fetchEvents()
  }

  return (
    <div className="max-w-6xl px-6 py-10 mx-auto space-y-8">
      <div className="h-16 bg-zinc-900 px-4 rounded-xl flex items-center shadow-shape gap-3">
        <div className="flex items-center gap-2 flex-1">
          <MapPin className="size-5 text-zinc-400" />
          <input
            type="text"
            placeholder="Your events"
            className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1"
          />
        </div>

        <button className="flex items-center gap-2 text-left w-[240px]">
          <Calendar className="size-5 text-zinc-400" />
          <h1>Welcome, {userName}</h1>
          <span className="text-lg text-zinc-400 w-40 flex-1">All</span>
        </button>

        <div className="w-px h-6 bg-zinc-800" />

        <button className="bg-zinc-800 rounded-lg w-20 py-2 font-medium text-white flex items-center justify-center">
          <Settings2 className="size-5" />
        </button>
      </div>

      <main className="flex gap-16 px-4">
        <div className="flex-1 space-y-6">
          <div className="flex justify-between">
            <h1 className="text-[32px] font-semibold">Events</h1>
            <button
              className="bg-primary rounded-lg px-6 py-2 font-medium gap-2 text-xl text-secondary flex items-center justify-center"
              onClick={openCreateEventModal}
            >
              <Plus className="size-5" />
              Create event
            </button>
          </div>

          <div className="flex items-center justify-between gap-10">
            <h2 className="text-3xl text-zinc-400">Day 17 - 23</h2>
            <ListCollapse className="size-10" />
          </div>

          {/* Display events dynamically */}
          <div className="space-y-4">
            {events.length > 0 ? (
              events.map((event) => (
                <div key={event.id} className="p-4 bg-zinc-800 rounded-lg shadow-md">
                  <h2 className="text-xl font-bold">{event.title}</h2>
                  <p className="text-zinc-400">{event.description}</p>
                  <p className="text-sm text-zinc-500">
                    {new Date(event.startTime).toLocaleString()} - {new Date(event.endTime).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-zinc-400">No events found.</p>
            )}
          </div>
        </div>

        <div className="flex flex-col space-y-10">
          <div className="space-y-5">
            <h1 className="font-bold text-xl">Important Links</h1>
            <h2 className="text-lg font-semibold">AirBnB Reservation</h2>
            <p>linkjqnwdjqawneqiowne</p>
            <button className="bg-zinc-800 rounded-lg px-6 py-2 gap-2 text-xl text-white w-full flex items-center justify-center">
              <Plus className="size-5" />
              Add Link
            </button>
          </div>
          <div className="w-full h-[2px] bg-zinc-400" />
          <div className="space-y-5">
            <h1 className="text-xl font-bold">Guests</h1>
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-xl text-white">Jessica White</h1>
              <p className="text-zinc-400">jessica.white@gmail.com</p>
              <CircleDashed className="text-zinc-700" />
            </div>
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-xl text-white">Fabo Black</h1>
              <p className="text-zinc-400">fabo.black@gmail.com</p>
              <CheckCircle2 className="text-primary" />
            </div>
            <button className="bg-zinc-800 rounded-lg px-6 py-2 gap-2 text-xl text-white w-full flex items-center justify-center">
              <UserCog className="size-5" />
              Manage Guests
            </button>
          </div>
        </div>
      </main>

      {isCreateEventModalOpen && <CreateEventModal closeCreateEventModal={closeCreateEventModal} />}

      {isConfirmTripModalOpen && (
        <ConfirmTripModal closeConfirmTripModal={closeConfirmTripModal} createTrip={createTrip} />
      )}
    </div>
  )
}

