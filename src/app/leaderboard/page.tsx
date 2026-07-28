"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/services/api";
import Loader from "@/components/Loader";

interface User {
  _id: string;
  name: string;
  avatar?: string;
}

interface Player {
  _id: string;
  gameName: string;
  points: number;
  wins: number;
  userId: User;
}

export default function Leaderboard() {
  const router = useRouter();

  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await API.get("/player/leaderboard");
        setPlayers(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const filtered = useMemo(() => {
    return players.filter((player) =>
      `${player.userId?.name ?? ""} ${player.gameName ?? ""}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [players, search]);

  const top3 = filtered.slice(0, 3);
  const rest = filtered.slice(3);

  if (loading) return <Loader />;

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-red-950 px-5 py-12 text-white">
      <h1 className="mb-10 text-center text-5xl font-black">
        🏆{" "}
        <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
          Leaderboard
        </span>
      </h1>

      {/* Search */}

      <div className="mb-12 flex justify-center">
        <input
          type="text"
          placeholder="Search warrior..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md rounded-full border border-zinc-700 bg-black px-6 py-3 text-white outline-none transition focus:border-red-500 focus:shadow-[0_0_20px_rgba(239,68,68,0.3)]"
        />
      </div>

      {/* Top 3 */}

      <div className="mb-16 flex flex-wrap items-end justify-center gap-8">
        {top3.map((player, index) => (
          <div
            key={player._id}
            onClick={() => router.push(`/players/${player.userId?._id}`)}
            className={`
      relative w-48 cursor-pointer rounded-3xl
      bg-zinc-900/90 p-6 text-center
      transition-all duration-300
      hover:-translate-y-3
      ${
        index === 0
          ? "scale-110 border border-yellow-400 shadow-[0_0_40px_rgba(250,204,21,0.4)]"
          : index === 1
            ? "border border-zinc-300 shadow-[0_0_30px_rgba(212,212,216,0.3)]"
            : "border border-orange-500 shadow-[0_0_30px_rgba(249,115,22,0.3)]"
      }
      `}
          >
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-4xl">
              {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
            </div>

            <Image
              src={
                player.userId?.avatar
                  ? player.userId.avatar
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      player.userId?.name || "User",
                    )}`
              }
              alt={player.userId?.name || "User"}
              width={95}
              height={95}
              unoptimized
              className="mx-auto rounded-full border-4 border-red-500 object-cover shadow-[0_0_20px_rgba(239,68,68,0.5)]"
            />

            <h3 className="mt-5 text-xl font-black">
              {player.userId?.name || player.gameName}
            </h3>

            <div className="mt-4 space-y-2">
              <p className="font-bold text-yellow-400">
                ⭐ {player.points || 0} Points
              </p>

              <p className="font-bold text-cyan-400">
                🏆 {player.wins || 0} Wins
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Ranking Table */}

      <div className="overflow-x-auto rounded-3xl border border-zinc-800 bg-black/50 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
        <table className="w-full text-left">
          <thead className="bg-zinc-900 text-red-500">
            <tr>
              <th className="p-5 text-center">Rank</th>

              <th className="p-5">Player</th>

              <th className="p-5">Game</th>

              <th className="p-5">Points</th>

              <th className="p-5">Wins</th>
            </tr>
          </thead>

          <tbody>
            {rest.map((player, index) => (
              <tr
                key={player._id}
                onClick={() => router.push(`/players/${player.userId?._id}`)}
                className="
          cursor-pointer
          border-b border-zinc-800
          bg-zinc-950
          transition
          hover:bg-zinc-900
          hover:shadow-[inset_0_0_20px_rgba(239,68,68,0.1)]
          "
              >
                <td className="p-5 text-center font-black text-red-500">
                  #{index + 4}
                </td>

                <td className="p-5">
                  <div className="flex items-center gap-3">
                    <Image
                      src={
                        player.userId?.avatar
                          ? player.userId.avatar
                          : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              player.userId?.name || "User",
                            )}`
                      }
                      alt={player.userId?.name || "User"}
                      width={45}
                      height={45}
                      unoptimized
                      className="rounded-full border border-red-500 object-cover"
                    />

                    <span className="font-semibold">
                      {player.userId?.name || "Unknown"}
                    </span>
                  </div>
                </td>

                <td className="p-5 text-zinc-300">{player.gameName || "-"}</td>

                <td className="p-5 font-bold text-yellow-400">
                  ⭐ {player.points || 0}
                </td>

                <td className="p-5 font-bold text-cyan-400">
                  🏆 {player.wins || 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
