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
      <div className="mx-auto max-w-5xl px-4 py-10 text-center">
        <h1 className="text-4xl font-bold text-red-600">🔥 Dashboard</h1>

        <h2 className="mt-3 text-2xl font-semibold text-white">
          Welcome, {user?.name || "Player"} 🔥
        </h2>

        {profile && (
          <div className="mx-auto mt-8 w-full max-w-sm rounded-xl border-2 border-red-600 bg-zinc-900 p-6 shadow-[0_0_20px_red] transition hover:scale-105">
            <h3 className="mb-4 text-2xl font-bold text-red-500">
              {profile.gameName}
            </h3>

            <p>UID: {profile.uid}</p>
            <p>Rank: {profile.rank}</p>
            <p>Role: {profile.role}</p>
            <p>Level: {profile.level}</p>
          </div>
        )}

        <form
          onSubmit={submit}
          className="mx-auto mt-10 w-full max-w-sm rounded-xl border border-red-600 bg-zinc-900 p-6"
        >
          <input
            type="text"
            placeholder="Free Fire UID"
            value={form.uid}
            onChange={(e) => setForm({ ...form, uid: e.target.value })}
            className="mb-4 w-full border border-red-600 bg-black px-3 py-2 text-white outline-none focus:ring-2 focus:ring-red-500"
          />

          <input
            type="text"
            placeholder="Game Name"
            value={form.gameName}
            onChange={(e) => setForm({ ...form, gameName: e.target.value })}
            className="mb-4 w-full border border-red-600 bg-black px-3 py-2 text-white outline-none focus:ring-2 focus:ring-red-500"
          />

          <input
            type="text"
            placeholder="Rank"
            value={form.rank}
            onChange={(e) => setForm({ ...form, rank: e.target.value })}
            className="mb-4 w-full border border-red-600 bg-black px-3 py-2 text-white outline-none focus:ring-2 focus:ring-red-500"
          />

          <input
            type="text"
            placeholder="Role"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="mb-4 w-full border border-red-600 bg-black px-3 py-2 text-white outline-none focus:ring-2 focus:ring-red-500"
          />

          <input
            type="text"
            placeholder="Level"
            value={form.level}
            onChange={(e) => setForm({ ...form, level: e.target.value })}
            className="mb-6 w-full border border-red-600 bg-black px-3 py-2 text-white outline-none focus:ring-2 focus:ring-red-500"
          />

          <button
            type="submit"
            className="w-full rounded-md bg-red-600 py-3 font-semibold text-white transition hover:bg-red-700"
          >
            Save Profile
          </button>
        </form>
      </div>
    </ProtectedRoute>
  );
}
