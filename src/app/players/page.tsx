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
  uid: string;
  gameName: string;
  rank: string;
  role: string;
  level: number;
  userId: User;
}

export default function Players() {
  const router = useRouter();

  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const res = await API.get("/player/leaderboard");
        setPlayers(res.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  const filteredPlayers = useMemo(() => {
    return players.filter((player) =>
      (player.gameName || "").toLowerCase().includes(search.toLowerCase()),
    );
  }, [players, search]);

  if (loading) return <Loader />;

  return (
    <main className="min-h-screen bg-black px-5 py-10 text-white">
      <h1 className="mb-8 text-center text-4xl font-bold text-red-500">
        🔥 WhiteArmy Players
      </h1>

      <div className="mb-10 flex justify-center">
        <input
          type="text"
          placeholder="Search player..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm rounded-md border border-red-600 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:ring-2 focus:ring-red-500"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {filteredPlayers.length === 0 && (
          <p className="col-span-full text-center text-gray-400">
            No players found 😢
          </p>
        )}

        {filteredPlayers.map((player, index) => (
          <div
            key={player._id}
            onClick={() => router.push(`/players/${player.userId?._id}`)}
            className={`relative cursor-pointer rounded-xl border bg-zinc-900 p-6 transition duration-300 hover:scale-105 hover:border-red-500
            ${
              index < 3
                ? "border-yellow-400 shadow-[0_0_15px_gold]"
                : "border-zinc-700"
            }`}
          >
            {index === 0 && (
              <span className="absolute -right-2 -top-2 text-2xl">🥇</span>
            )}

            {index === 1 && (
              <span className="absolute -right-2 -top-2 text-2xl">🥈</span>
            )}

            {index === 2 && (
              <span className="absolute -right-2 -top-2 text-2xl">🥉</span>
            )}

            <div className="mb-4 flex justify-center">
              <Image
                src={
                  player.userId?.avatar
                    ? player.userId.avatar
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        player.userId?.name || "Player",
                      )}`
                }
                alt={player.userId?.name || "Player"}
                width={80}
                height={80}
                unoptimized
                className="rounded-full border-4 border-red-600 object-cover"
              />
            </div>

            <h2 className="text-center text-xl font-semibold">
              {player.gameName || "No Name"}
            </h2>

            <p className="mt-2 text-center text-gray-400">
              UID: {player.uid || "N/A"}
            </p>

            <div className="mt-5 flex justify-between text-sm text-gray-300">
              <span>🏆 {player.rank || "N/A"}</span>
              <span>🎯 {player.role || "N/A"}</span>
              <span>⚡ Lv.{player.level || 0}</span>
            </div>

            <p className="mt-5 text-center text-sm text-gray-500">
              👤 {player.userId?.name || "Unknown"}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
