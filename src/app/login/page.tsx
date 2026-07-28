"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import API from "@/services/api";

interface LoginForm {
  email: string;
  password: string;
}

export default function Login() {
  const router = useRouter();

  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Login Success 🔥");

      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Login Failed ❌");
    }
  };

  return (
    <div className="relative flex min-h-[90vh] items-center justify-center overflow-hidden bg-gradient-to-br from-black via-zinc-950 to-red-950 px-4">
      {/* Glow */}
      <div className="absolute h-72 w-72 rounded-full bg-red-600/20 blur-3xl" />

      <form
        onSubmit={submit}
        className="relative z-10 w-full max-w-md rounded-3xl border border-red-500/30 bg-zinc-900/80 p-8 text-center shadow-[0_0_40px_rgba(239,68,68,0.2)] backdrop-blur"
      >
        <h2 className="text-4xl font-black text-white">
          Welcome Back <span className="text-red-500">Warrior</span>
        </h2>

        <p className="mt-2 text-sm text-zinc-400">
          Login and continue your gaming journey 🎮
        </p>

        <div className="mt-8">
          <input
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="mb-4 w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-white outline-none transition focus:border-red-500 focus:shadow-[0_0_15px_rgba(239,68,68,0.4)]"
          />

          <input
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="mb-4 w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-white outline-none transition focus:border-red-500 focus:shadow-[0_0_15px_rgba(239,68,68,0.4)]"
          />

          <button
            type="submit"
            className="mt-4 w-full rounded-xl bg-gradient-to-r from-red-600 to-orange-500 py-3 font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(239,68,68,0.6)]"
          >
            🔥 Login
          </button>
        </div>
      </form>
    </div>
  );
}
