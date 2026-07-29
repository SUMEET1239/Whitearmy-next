"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import API from "@/services/api";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
}

export default function Register() {
  const router = useRouter();

  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
  });

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await API.post("/auth/register", form);

      toast.success("Registered Successfully ✅");

      router.push("/login");
    } catch (error) {
      console.error(error);
      toast.error("Error ❌");
    }
  };

  return (
    <div className="relative flex min-h-[90vh] items-center justify-center overflow-hidden bg-gradient-to-br from-black via-zinc-950 to-red-950 px-4 py-8 sm:px-6 lg:px-8">
      {/* Glow */}
      <div className="absolute h-56 w-56 rounded-full bg-red-600/20 blur-3xl sm:h-72 sm:w-72" />

      <form
        onSubmit={submit}
        className="relative z-10 w-full max-w-md rounded-3xl border border-red-500/30 bg-zinc-900/80 p-6 text-center shadow-[0_0_40px_rgba(239,68,68,0.2)] backdrop-blur sm:p-8"
      >
        <h2 className="text-3xl font-black leading-tight text-white sm:text-4xl">
          Join <span className="text-red-500">WhiteArmy</span>
        </h2>

        <p className="mt-3 text-sm text-zinc-400 sm:text-base">
          Create your account and enter the battlefield 🎮
        </p>

        <div className="mt-8">
          <input
            type="text"
            placeholder="Enter your name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mb-4 w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-sm text-white outline-none transition focus:border-red-500 focus:shadow-[0_0_15px_rgba(239,68,68,0.4)] sm:text-base"
          />

          <input
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="mb-4 w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-sm text-white outline-none transition focus:border-red-500 focus:shadow-[0_0_15px_rgba(239,68,68,0.4)] sm:text-base"
          />

          <input
            type="password"
            placeholder="Create password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="mb-4 w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-sm text-white outline-none transition focus:border-red-500 focus:shadow-[0_0_15px_rgba(239,68,68,0.4)] sm:text-base"
          />

          <button
            type="submit"
            className="mt-4 w-full rounded-xl bg-gradient-to-r from-red-600 to-orange-500 py-3 font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(239,68,68,0.6)]"
          >
            🚀 Create Account
          </button>
        </div>
      </form>
    </div>
  );
}
