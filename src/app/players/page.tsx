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
    <main className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-red-950 px-4 py-8 text-white sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <h1 className="mb-8 text-center text-3xl font-black sm:mb-10 sm:text-4xl lg:text-5xl">
        🔥{" "}
        <span className="bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">
          WhiteArmy Players
        </span>
      </h1>

      {/* Search */}

      <div className="mb-10 flex justify-center sm:mb-12">
        <input
          type="text"
          placeholder="Search warrior..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md rounded-xl border border-zinc-700 bg-black px-5 py-3 text-sm text-white outline-none transition focus:border-red-500 focus:shadow-[0_0_20px_rgba(239,68,68,0.4)] sm:text-base"
        />
      </div>

      {/* Players Grid */}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredPlayers.length === 0 && (
          <p className="col-span-full text-center text-zinc-400">
            No players found...
          </p>
        )}

        {filteredPlayers.map((player, index) => (
          <div
            key={player._id}
            onClick={() => router.push(`/players/${player.userId?._id}`)}
            className={`
          group relative cursor-pointer rounded-3xl border
          bg-zinc-900/80 p-5 backdrop-blur
          transition-all duration-300
          hover:-translate-y-2
          hover:shadow-[0_0_35px_rgba(239,68,68,0.3)]
          sm:p-6
          ${
            index < 3
              ? "border-yellow-400 shadow-[0_0_25px_rgba(250,204,21,0.25)]"
              : "border-zinc-800 hover:border-red-500"
          }
        `}
          >
            {/* Rank Badge */}

            {index === 0 && (
              <span className="absolute right-4 top-4 text-2xl sm:text-3xl">
                🥇
              </span>
            )}

            {index === 1 && (
              <span className="absolute right-4 top-4 text-2xl sm:text-3xl">
                🥈
              </span>
            )}

            {index === 2 && (
              <span className="absolute right-4 top-4 text-2xl sm:text-3xl">
                🥉
              </span>
            )}

            {/* Avatar */}

            <div className="flex justify-center">
              <Image
                src={
                  player.userId?.avatar
                    ? player.userId.avatar
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        player.userId?.name || "Player",
                      )}`
                }
                alt={player.userId?.name || "Player"}
                width={90}
                height={90}
                unoptimized
                className="h-20 w-20 rounded-full border-4 border-red-500 object-cover shadow-[0_0_20px_rgba(239,68,68,0.5)] transition group-hover:scale-110 sm:h-[90px] sm:w-[90px]"
              />
            </div>

            <h2 className="mt-5 text-center text-xl font-black text-white sm:text-2xl">
              {player.gameName || "No Name"}
            </h2>

            <p className="mt-2 break-all text-center text-xs text-zinc-400 sm:text-sm">
              UID : {player.uid || "N/A"}
            </p>

            {/* Stats */}

            <div className="mt-6 grid grid-cols-3 gap-2 text-center text-xs sm:text-sm">
              <div className="rounded-lg bg-black p-2">
                <p className="text-yellow-400">🏆</p>
                <span className="text-zinc-300">{player.rank || "N/A"}</span>
              </div>

              <div className="rounded-lg bg-black p-2">
                <p className="text-red-400">🎯</p>
                <span className="text-zinc-300">{player.role || "N/A"}</span>
              </div>

              <div className="rounded-lg bg-black p-2">
                <p className="text-cyan-400">⚡</p>
                <span className="text-zinc-300">Lv.{player.level || 0}</span>
              </div>
            </div>

            <p className="mt-5 text-center text-xs text-zinc-500 sm:text-sm">
              👤 {player.userId?.name || "Unknown"}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
