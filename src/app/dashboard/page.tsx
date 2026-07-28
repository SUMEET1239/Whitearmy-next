"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "@/services/api";
import Loader from "@/components/Loader";
import ProtectedRoute from "@/components/ProtectedRoute";

interface User {
  _id: string;
  name: string;
}

interface Profile {
  uid: string;
  gameName: string;
  rank: string;
  role: string;
  level: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState<Profile>({
    uid: "",
    gameName: "",
    rank: "",
    role: "",
    level: "",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProfile = useCallback(async () => {
    if (!user?._id) return;

    try {
      const res = await API.get(`/player/${user._id}`);

      setProfile(res.data);

      setForm({
        uid: res.data.uid || "",
        gameName: res.data.gameName || "",
        rank: res.data.rank || "",
        role: res.data.role || "",
        level: res.data.level || "",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) return;

    try {
      const res = await API.post("/player/profile", {
        userId: user._id,
        ...form,
      });

      setProfile(res.data);

      toast.success("Profile Saved 🔥");
    } catch (error) {
      console.error(error);
      toast.error("Error saving profile ❌");
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-red-950 px-4 py-12 text-white">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="text-5xl font-black">
            🔥{" "}
            <span className="bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">
              Dashboard
            </span>
          </h1>

          <h2 className="mt-4 text-2xl font-bold text-zinc-300">
            Welcome,{" "}
            <span className="text-red-500">{user?.name || "Player"}</span> 🔥
          </h2>

          {/* Player Profile Card */}

          {profile && (
            <div className="mx-auto mt-10 w-full max-w-md rounded-3xl border border-red-500/30 bg-zinc-900/80 p-8 shadow-[0_0_40px_rgba(239,68,68,0.2)] backdrop-blur transition hover:-translate-y-2">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-orange-500 text-3xl font-black shadow-[0_0_25px_rgba(239,68,68,0.5)]">
                {profile.gameName?.charAt(0).toUpperCase()}
              </div>

              <h3 className="mt-5 text-3xl font-black text-white">
                {profile.gameName}
              </h3>

              <div className="mt-6 grid grid-cols-2 gap-4 text-left">
                <div className="rounded-xl border border-zinc-800 bg-black p-4">
                  <p className="text-sm text-zinc-500">🆔 UID</p>
                  <p className="mt-1 font-bold">{profile.uid}</p>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-black p-4">
                  <p className="text-sm text-zinc-500">🏆 Rank</p>
                  <p className="mt-1 font-bold text-yellow-400">
                    {profile.rank}
                  </p>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-black p-4">
                  <p className="text-sm text-zinc-500">🎯 Role</p>
                  <p className="mt-1 font-bold text-red-400">{profile.role}</p>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-black p-4">
                  <p className="text-sm text-zinc-500">⚡ Level</p>
                  <p className="mt-1 font-bold text-cyan-400">
                    {profile.level}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Create Profile Form */}

          <form
            onSubmit={submit}
            className="mx-auto mt-12 w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900/80 p-8 shadow-[0_0_30px_rgba(239,68,68,0.15)] backdrop-blur"
          >
            <h3 className="mb-6 text-2xl font-black text-white">
              🎮 Create Gaming Profile
            </h3>

            <input
              type="text"
              placeholder="Free Fire UID"
              value={form.uid}
              onChange={(e) => setForm({ ...form, uid: e.target.value })}
              className="mb-4 w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-white outline-none transition focus:border-red-500 focus:shadow-[0_0_15px_rgba(239,68,68,0.3)]"
            />

            <input
              type="text"
              placeholder="Game Name"
              value={form.gameName}
              onChange={(e) => setForm({ ...form, gameName: e.target.value })}
              className="mb-4 w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-white outline-none transition focus:border-red-500 focus:shadow-[0_0_15px_rgba(239,68,68,0.3)]"
            />

            <input
              type="text"
              placeholder="Rank"
              value={form.rank}
              onChange={(e) => setForm({ ...form, rank: e.target.value })}
              className="mb-4 w-full rounded-xl border border-zinc_700 bg-black px-4 py-3 text-white outline-none transition focus:border-red-500 focus:shadow-[0_0_15px_rgba(239,68,68,0.3)]"
            />

            <input
              type="text"
              placeholder="Role"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="mb-4 w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-white outline-none transition focus:border-red-500 focus:shadow-[0_0_15px_rgba(239,68,68,0.3)]"
            />

            <input
              type="text"
              placeholder="Level"
              value={form.level}
              onChange={(e) => setForm({ ...form, level: e.target.value })}
              className="mb-6 w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-white outline-none transition focus:border-red-500 focus:shadow-[0_0_15px_rgba(239,68,68,0.3)]"
            />

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-red-600 to-orange-500 py-3 font-bold transition hover:scale-105 hover:shadow-[0_0_30px_rgba(239,68,68,0.5)]"
            >
              🚀 Save Profile
            </button>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
