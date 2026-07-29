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
    <main className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-red-950 px-4 py-8 text-white sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <h1 className="mb-8 text-center text-3xl font-black sm:mb-10 sm:text-4xl lg:text-5xl">
        🏆{" "}
        <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
          Leaderboard
        </span>
      </h1>

      {/* Search */}

      <div className="mb-10 flex justify-center sm:mb-12">
        <input
          type="text"
          placeholder="Search warrior..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md rounded-full border border-zinc-700 bg-black px-5 py-3 text-sm text-white outline-none transition focus:border-red-500 focus:shadow-[0_0_20px_rgba(239,68,68,0.3)] sm:px-6 sm:text-base"
        />
      </div>

      {/* Top 3 */}

      <div className="mb-12 flex flex-wrap items-center justify-center gap-5 sm:mb-16 sm:items-end sm:gap-8">
        {top3.map((player, index) => (
          <div
            key={player._id}
            onClick={() => router.push(`/players/${player.userId?._id}`)}
            className={`
relative w-full max-w-[280px] cursor-pointer rounded-3xl
bg-zinc-900/90 p-5 text-center
transition-all duration-300
hover:-translate-y-2
sm:w-48 sm:p-6
${
  index === 0
    ? "scale-100 sm:scale-110 border border-yellow-400 shadow-[0_0_40px_rgba(250,204,21,0.4)]"
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
              className="mx-auto h-20 w-20 rounded-full border-4 border-red-500 object-cover shadow-[0_0_20px_rgba(239,68,68,0.5)] sm:h-24 sm:w-24"
            />

            <h3 className="mt-4 text-lg font-black sm:mt-5 sm:text-xl">
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

      <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-black/50 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
        <table className="min-w-[650px] w-full text-left">
          <thead className="bg-zinc-900 text-sm text-red-500 sm:text-base">
            <tr>
              <th className="p-3 sm:p-5 text-center">Rank</th>

              <th className="p-3 sm:p-5">Player</th>

              <th className="p-3 sm:p-5">Game</th>

              <th className="p-3 sm:p-5">Points</th>

              <th className="p-3 sm:p-5">Wins</th>
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
                <td className="p-3 sm:p-5 text-center font-black text-red-500">
                  #{index + 4}
                </td>

                <td className="p-3 sm:p-5">
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
                      className="h-10 w-10 rounded-full border border-red-500 object-cover sm:h-11 sm:w-11"
                    />

                    <span className="text-sm font-semibold sm:text-base">
                      {player.userId?.name || "Unknown"}
                    </span>
                  </div>
                </td>

                <td className="p-3 sm:p-5 text-zinc-300">
                  {player.gameName || "-"}
                </td>

                <td className="p-5 font-bold text-yellow-400">
                  ⭐ {player.points || 0}
                </td>

                <td className="p-3 sm:p-5 font-bold text-cyan-400">
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
