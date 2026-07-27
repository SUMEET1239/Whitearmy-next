"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/services/api";

interface Tournament {
  _id: string;
  title: string;
  game: string;
  date: string;
  players: unknown[];
}

interface User {
  _id?: string;
  name?: string;
  email?: string;
}

export default function Home() {
  const router = useRouter();

  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const res = await API.get("/tournament/all");
      setTournaments(res.data.slice(0, 3));
    } catch (error) {
      console.error(error);
    }
  };

  const handleJoinNow = () => {
    if (!user) {
      router.push("/login");
    } else {
      router.push("/tournament");
    }
  };

  return (
    <main className="bg-[#0f0f0f] text-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1a1a1a] to-black px-5 py-24 text-center">
        <h1 className="text-5xl font-bold text-red-600">
          🔥 WhiteArmy Tournaments
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-400">
          Join competitive gaming tournaments & win rewards 🎮
        </p>

        <button
          onClick={handleJoinNow}
          className="mt-8 rounded-xl bg-gradient-to-r from-red-600 to-red-400 px-8 py-3 font-semibold shadow-lg shadow-red-600/30 transition hover:scale-105"
        >
          🚀 Join Now
        </button>
      </section>

      {/* How it Works */}
      <section className="px-5 py-16 text-center">
        <h2 className="text-3xl font-bold">⚡ How It Works</h2>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-6">
            <h3 className="mb-2 text-xl font-semibold">1️⃣ Register</h3>
            <p className="text-gray-400">Create your account and profile</p>
          </div>

          <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-6">
            <h3 className="mb-2 text-xl font-semibold">2️⃣ Join</h3>
            <p className="text-gray-400">Join any available tournament</p>
          </div>

          <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-6">
            <h3 className="mb-2 text-xl font-semibold">3️⃣ Play</h3>
            <p className="text-gray-400">Compete and show your skills</p>
          </div>

          <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-6">
            <h3 className="mb-2 text-xl font-semibold">4️⃣ Win</h3>
            <p className="text-gray-400">Earn points & rewards 🏆</p>
          </div>
        </div>
      </section>

      {/* Featured Tournaments */}
      <section className="px-5 py-16 text-center">
        <h2 className="text-3xl font-bold">🏆 Featured Tournaments</h2>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tournaments.map((tournament) => (
            <div
              key={tournament._id}
              className="rounded-xl border border-zinc-700 bg-zinc-900 p-6"
            >
              <h3 className="text-2xl font-semibold">{tournament.title}</h3>

              <p className="mt-2 text-gray-300">🎮 {tournament.game}</p>

              <p className="text-gray-300">📅 {tournament.date}</p>

              <p className="text-gray-300">
                👥 {tournament.players?.length} Players
              </p>

              <button
                onClick={handleJoinNow}
                className="mt-5 rounded bg-green-600 px-5 py-2 transition hover:bg-green-700"
              >
                Join
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#111] px-5 py-20 text-center">
        <h2 className="text-4xl font-bold">
          Ready to dominate the battlefield? 🔥
        </h2>

        <button
          onClick={handleJoinNow}
          className="mt-8 rounded-xl bg-gradient-to-r from-red-600 to-red-400 px-8 py-3 font-semibold shadow-lg shadow-red-600/30 transition hover:scale-105"
        >
          Join Now
        </button>
      </section>
    </main>
  );
}
