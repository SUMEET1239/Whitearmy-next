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
    <div className="flex min-h-[90vh] items-center justify-center bg-black px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-[320px] border-2 border-red-600 bg-zinc-900 p-8 text-center shadow-[0_0_15px_red]"
      >
        <h2 className="mb-5 text-3xl font-bold text-red-600">Register</h2>

        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="mb-4 w-full border border-red-600 bg-black px-3 py-2 text-white outline-none focus:shadow-[0_0_5px_red]"
        />

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="mb-4 w-full border border-red-600 bg-black px-3 py-2 text-white outline-none focus:shadow-[0_0_5px_red]"
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="mb-4 w-full border border-red-600 bg-black px-3 py-2 text-white outline-none focus:shadow-[0_0_5px_red]"
        />

        <button
          type="submit"
          className="mt-2 w-full bg-red-600 py-2 text-white transition duration-300 hover:bg-red-800 hover:shadow-[0_0_10px_red]"
        >
          Register
        </button>
      </form>
    </div>
  );
}
