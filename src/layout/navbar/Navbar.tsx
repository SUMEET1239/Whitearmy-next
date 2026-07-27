"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface User {
  name?: string;
  avatar?: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User>({});

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    setToken(storedToken);

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser({});
    }
  }, [pathname]);

  const logout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <nav className="flex items-center justify-between bg-black/80 px-6 py-3 text-white">
      {/* Logo */}
      <h2
        onClick={() => router.push("/")}
        className="cursor-pointer text-2xl font-bold text-red-500"
      >
        🔥 WhiteArmy
      </h2>

      {/* Links */}
      <div className="flex items-center gap-6">
        <Link href="/" className="transition hover:text-red-500">
          Home
        </Link>

        <Link href="/players" className="transition hover:text-red-500">
          Players
        </Link>

        <Link href="/leaderboard" className="transition hover:text-red-500">
          Leaderboard
        </Link>

        {!token ? (
          <>
            <Link href="/login" className="transition hover:text-red-500">
              Login
            </Link>

            <Link href="/register" className="transition hover:text-red-500">
              Register
            </Link>
          </>
        ) : (
          <>
            <Link href="/tournament" className="transition hover:text-red-500">
              Tournaments
            </Link>

            <div className="relative">
              <div
                onClick={() => setOpen(!open)}
                className="flex cursor-pointer items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 transition hover:border-red-500"
              >
                <Image
                  src={
                    user.avatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user.name || "User",
                    )}`
                  }
                  alt={user.name || "User"}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                  unoptimized
                />

                <span>{user.name}</span>
              </div>

              {open && (
                <div className="absolute right-0 top-14 z-50 flex w-48 flex-col gap-3 rounded-lg border border-red-600 bg-zinc-900 p-4 shadow-lg">
                  <p className="font-semibold">{user.name}</p>

                  <button
                    onClick={() => router.push("/profile")}
                    className="text-left transition hover:text-red-500"
                  >
                    Profile
                  </button>

                  <button
                    onClick={() => router.push("/dashboard")}
                    className="text-left transition hover:text-red-500"
                  >
                    Dashboard
                  </button>

                  <button
                    onClick={() => router.push("/tournament")}
                    className="text-left transition hover:text-red-500"
                  >
                    My Tournaments
                  </button>

                  <button
                    onClick={logout}
                    className="text-left text-red-500 transition hover:text-red-400"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
