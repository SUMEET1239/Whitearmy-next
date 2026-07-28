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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-black via-zinc-950 to-red-950 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-red-500/30 bg-zinc-900/80 p-8 text-center shadow-[0_0_40px_rgba(239,68,68,0.2)] backdrop-blur">
        <h2 className="text-4xl font-black text-white">
          👤 <span className="text-red-500">Player Profile</span>
        </h2>

        <p className="mt-2 text-sm text-zinc-400">
          WhiteArmy Gaming Identity 🎮
        </p>

        {/* Avatar */}

        <div className="mx-auto mt-8 flex h-24 w-24 items-center justify-center rounded-full border-4 border-red-500 bg-gradient-to-br from-red-600 to-orange-500 text-4xl font-black text-white shadow-[0_0_30px_rgba(239,68,68,0.6)]">
          {player.gameName?.charAt(0).toUpperCase()}
        </div>

        <h3 className="mt-6 text-3xl font-black text-white">
          {player.gameName}
        </h3>

        <p className="mt-1 text-zinc-400">@{player.userId?.name}</p>

        {/* Stats */}

        <div className="mt-8 grid grid-cols-2 gap-4 text-left">
          <div className="rounded-xl border border-zinc-800 bg-black p-4">
            <p className="text-sm text-zinc-500">🆔 UID</p>

            <p className="mt-1 font-bold text-white">{player.uid || "N/A"}</p>
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

        <div className="mt-6 rounded-2xl border border-red-500/20 bg-gradient-to-r from-red-950/50 to-black p-5">
          <h3 className="mb-4 text-xl font-bold text-white">🔥 Performance</h3>

          <div className="space-y-3 text-left">
            <p className="flex justify-between text-zinc-300">
              <span>🔥 Points</span>
              <span className="font-bold text-red-500">
                {player.points || 0}
              </span>
            </p>

            <p className="flex justify-between text-zinc-300">
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
