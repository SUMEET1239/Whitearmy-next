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
    <main className="min-h-screen bg-[#050505] text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-950 via-black to-black px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        {/* Glow */}
        <div className="absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-red-600/20 blur-3xl" />

        <div className="relative z-10">
          <h1 className="text-4xl font-black leading-tight tracking-wide sm:text-5xl md:text-6xl lg:text-7xl">
            🔥{" "}
            <span className="bg-gradient-to-r from-red-500 to-red-300 bg-clip-text text-transparent">
              WhiteArmy
            </span>{" "}
            Tournaments
          </h1>

          <p className="mx-auto mt-6 max-w-2xl px-2 text-base leading-relaxed text-zinc-400 sm:text-lg md:text-xl">
            Join competitive gaming battles, challenge top players, climb the
            leaderboard and win exciting rewards 🎮🏆
          </p>

          <button
            onClick={handleJoinNow}
            className="mt-10 w-full max-w-xs rounded-xl bg-gradient-to-r from-red-600 to-orange-500 px-8 py-4 font-bold transition-all duration-300 hover:scale-105 hover:shadow-[0_0_50px_rgba(239,68,68,0.8)] sm:w-auto sm:px-10"
          >
            🚀 Join Battle
          </button>
        </div>
      </section>

      {/* How it Works */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <h2 className="text-center text-3xl font-black sm:text-4xl">
          ⚡ <span className="text-red-500">How It Works</span>
        </h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Register",
              desc: "Create your account and build your gaming profile",
            },
            {
              title: "Join",
              desc: "Enter tournaments and challenge other players",
            },
            {
              title: "Play",
              desc: "Show your skills and dominate the arena",
            },
            {
              title: "Win",
              desc: "Earn points, rewards and glory",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="group rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:border-red-500 hover:shadow-[0_0_25px_rgba(239,68,68,0.25)] sm:p-7"
            >
              <h3 className="text-xl font-bold text-red-500">
                {index + 1}️⃣ {item.title}
              </h3>

              <p className="mt-3 text-zinc-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Tournaments */}

      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <h2 className="text-center text-3xl font-black sm:text-4xl">
          🏆 <span className="text-red-500">Featured Tournaments</span>
        </h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {tournaments.map((tournament) => (
            <div
              key={tournament._id}
              className="group rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-black p-5 transition-all duration-300 hover:-translate-y-2 hover:border-red-500 hover:shadow-[0_0_35px_rgba(239,68,68,0.3)] sm:p-7"
            >
              <h3 className="text-xl font-bold sm:text-2xl">
                {tournament.title}
              </h3>

              <div className="mt-5 space-y-2 text-zinc-400">
                <p>🎮 {tournament.game}</p>

                <p>📅 {tournament.date}</p>

                <p>👥 {tournament.players?.length || 0} Players</p>
              </div>

              <button
                onClick={handleJoinNow}
                className="mt-6 w-full rounded-xl bg-green-600 py-3 font-bold transition hover:bg-green-500 hover:shadow-[0_0_25px_rgba(34,197,94,0.5)]"
              >
                Join Tournament
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}

      <section className="relative overflow-hidden bg-gradient-to-r from-red-950 via-black to-red-950 px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-24">
        <h2 className="text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
          Ready to dominate the battlefield? 🔥
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-sm text-zinc-400 sm:text-base">
          Join WhiteArmy and prove your skills.
        </p>

        <button
          onClick={handleJoinNow}
          className="mt-8 w-full max-w-xs rounded-xl bg-gradient-to-r from-red-600 to-orange-500 px-8 py-4 font-bold transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] sm:w-auto sm:px-10"
        >
          🚀 Join Now
        </button>
      </section>
    </main>
  );
}
