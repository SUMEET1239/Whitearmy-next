"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import API from "@/services/api";
import Loader from "@/components/Loader";

interface User {
  name: string;
}

interface Player {
  uid: string;
  gameName: string;
  rank: string;
  role: string;
  level: string;
  points: number;
  matchesPlayed: number;
  userId: User;
}

export default function PlayerProfile() {
  const params = useParams();
  const _id = params.id as string;

  const [player, setPlayer] = useState<Player | null>(null);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const res = await API.get(`/player/${_id}`);
        setPlayer(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (_id) {
      fetchPlayer();
    }
  }, [_id]);

  if (!player) return <Loader />;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-black via-zinc-950 to-red-950 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="w-full max-w-md rounded-3xl border border-red-500/30 bg-zinc-900/80 p-6 text-center shadow-[0_0_40px_rgba(239,68,68,0.2)] backdrop-blur sm:p-8">
        <h2 className="text-3xl font-black text-white sm:text-4xl">
          👤 <span className="text-red-500">Player Profile</span>
        </h2>

        <p className="mt-2 text-sm text-zinc-400 sm:text-base">
          WhiteArmy Gaming Identity 🎮
        </p>

        {/* Avatar */}

        <div className="mx-auto mt-8 flex h-20 w-20 items-center justify-center rounded-full border-4 border-red-500 bg-gradient-to-br from-red-600 to-orange-500 text-3xl font-black text-white shadow-[0_0_30px_rgba(239,68,68,0.6)] sm:h-24 sm:w-24 sm:text-4xl">
          {player.gameName?.charAt(0).toUpperCase()}
        </div>

        <h3 className="mt-6 break-words text-2xl font-black text-white sm:text-3xl">
          {player.gameName}
        </h3>

        <p className="mt-1 break-all text-sm text-zinc-400 sm:text-base">
          @{player.userId?.name}
        </p>

        {/* Stats */}

        <div className="mt-8 grid grid-cols-1 gap-4 text-left sm:grid-cols-2">
          <div className="rounded-xl border border-zinc-800 bg-black p-4">
            <p className="text-sm text-zinc-500">🆔 UID</p>

            <p className="mt-1 break-all font-bold text-white">
              {player.uid || "N/A"}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-black p-4">
            <p className="text-sm text-zinc-500">🏆 Rank</p>

            <p className="mt-1 font-bold text-yellow-400">
              {player.rank || "N/A"}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-black p-4">
            <p className="text-sm text-zinc-500">🎯 Role</p>

            <p className="mt-1 font-bold text-red-400">
              {player.role || "N/A"}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-black p-4">
            <p className="text-sm text-zinc-500">⚡ Level</p>

            <p className="mt-1 font-bold text-cyan-400">{player.level || 0}</p>
          </div>
        </div>

        {/* Performance */}

        <div className="mt-6 rounded-2xl border border-red-500/20 bg-gradient-to-r from-red-950/50 to-black p-4 sm:p-5">
          <h3 className="mb-4 text-lg font-bold text-white sm:text-xl">
            🔥 Performance
          </h3>

          <div className="space-y-3 text-sm text-left sm:text-base">
            <p className="flex items-center justify-between text-zinc-300">
              <span>🔥 Points</span>
              <span className="font-bold text-red-500">
                {player.points || 0}
              </span>
            </p>

            <p className="flex items-center justify-between text-zinc-300">
              <span>🎮 Matches Played</span>
              <span className="font-bold text-cyan-400">
                {player.matchesPlayed || 0}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
