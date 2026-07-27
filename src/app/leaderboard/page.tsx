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
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black px-5 py-10 text-white">
      <h1 className="mb-8 text-center text-4xl font-bold text-yellow-400 drop-shadow-lg">
        🏆 Leaderboard
      </h1>

      <div className="mb-10 flex justify-center">
        <input
          type="text"
          placeholder="Search player..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm rounded-full border border-zinc-700 bg-zinc-900 px-5 py-3 outline-none transition focus:border-red-500"
        />
      </div>

      {/* Top 3 */}

      <div className="mb-12 flex flex-wrap items-end justify-center gap-6">
        {top3.map((player, index) => (
          <div
            key={player._id}
            onClick={() => router.push(`/players/${player.userId?._id}`)}
            className={`relative w-44 cursor-pointer rounded-xl bg-zinc-900 p-5 text-center transition hover:-translate-y-2

            ${
              index === 0
                ? "border border-yellow-400 shadow-[0_0_20px_gold] scale-110"
                : index === 1
                  ? "border border-gray-300 shadow-[0_0_15px_silver]"
                  : "border border-orange-500 shadow-[0_0_15px_orange]"
            }
            `}
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-3xl">
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
              width={90}
              height={90}
              unoptimized
              className="mx-auto rounded-full border-4 border-red-500 object-cover"
            />

            <h3 className="mt-4 text-xl font-semibold">
              {player.userId?.name || player.gameName}
            </h3>

            <p className="mt-2 text-yellow-400">⭐ {player.points || 0} pts</p>

            <p className="text-cyan-300">🏆 {player.wins || 0} wins</p>
          </div>
        ))}
      </div>

      {/* Table */}

      <div className="overflow-x-auto rounded-xl">
        <table className="w-full overflow-hidden rounded-xl">
          <thead className="bg-zinc-900 text-red-500">
            <tr>
              <th className="p-4">#</th>
              <th className="p-4">Player</th>
              <th className="p-4">Game</th>
              <th className="p-4">Points</th>
              <th className="p-4">Wins</th>
            </tr>
          </thead>

          <tbody>
            {rest.map((player, index) => (
              <tr
                key={player._id}
                onClick={() => router.push(`/players/${player.userId?._id}`)}
                className="cursor-pointer border-b border-zinc-800 bg-zinc-950 transition hover:bg-zinc-900"
              >
                <td className="p-4 text-center font-semibold">{index + 4}</td>

                <td className="p-4">
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
                      width={40}
                      height={40}
                      unoptimized
                      className="rounded-full border border-red-500 object-cover"
                    />

                    <span>{player.userId?.name || "Unknown"}</span>
                  </div>
                </td>

                <td className="p-4">{player.gameName || "-"}</td>

                <td className="p-4 font-semibold text-yellow-400">
                  ⭐ {player.points || 0}
                </td>

                <td className="p-4 font-semibold text-cyan-400">
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
