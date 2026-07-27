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
    <div className="flex min-h-screen items-center justify-center bg-black px-4 py-10">
      <div className="w-full max-w-sm rounded-xl border border-red-600 bg-zinc-900 p-8 text-center shadow-[0_0_20px_rgba(255,0,0,0.3)]">
        <h2 className="mb-6 text-3xl font-bold text-red-500">
          👤 Player Profile
        </h2>

        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-2xl font-bold text-white">
          {player.gameName?.charAt(0).toUpperCase()}
        </div>

        <h3 className="mb-5 text-2xl font-semibold text-white">
          {player.gameName}
        </h3>

        <div className="space-y-3 text-left text-gray-300">
          <p>
            <span className="font-semibold text-white">👤 Name:</span>{" "}
            {player.userId?.name}
          </p>

          <p>
            <span className="font-semibold text-white">🆔 UID:</span>{" "}
            {player.uid}
          </p>

          <p>
            <span className="font-semibold text-white">🏆 Rank:</span>{" "}
            {player.rank}
          </p>

          <p>
            <span className="font-semibold text-white">🎯 Role:</span>{" "}
            {player.role}
          </p>

          <p>
            <span className="font-semibold text-white">⚡ Level:</span>{" "}
            {player.level}
          </p>

          <p>
            <span className="font-semibold text-white">🔥 Points:</span>{" "}
            {player.points || 0}
          </p>

          <p>
            <span className="font-semibold text-white">🎮 Matches Played:</span>{" "}
            {player.matchesPlayed || 0}
          </p>
        </div>
      </div>
    </div>
  );
}
