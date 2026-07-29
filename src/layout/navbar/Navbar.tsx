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
  const [mobileMenu, setMobileMenu] = useState(false);

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
    <nav className="sticky top-0 z-50 border-b border-red-500/20 bg-gradient-to-r from-black via-zinc-950 to-black text-white shadow-[0_0_30px_rgba(239,68,68,0.12)] backdrop-blur-md">
      <div className="mx-auto flex h-16 items-center justify-between px-5 lg:px-8">
        {/* Logo */}
        <h2
          onClick={() => router.push("/")}
          className="cursor-pointer text-2xl font-extrabold tracking-wide text-red-500 transition hover:scale-105 hover:text-red-400 md:text-3xl"
        >
          🔥 WhiteArmy
        </h2>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-6 lg:flex">
          <Link
            href="/"
            className="relative font-medium text-zinc-300 transition hover:text-red-500 after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-red-500 after:transition-all hover:after:w-full"
          >
            Home
          </Link>

          <Link
            href="/players"
            className="relative font-medium text-zinc-300 transition hover:text-red-500 after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-red-500 after:transition-all hover:after:w-full"
          >
            Players
          </Link>

          <Link
            href="/leaderboard"
            className="relative font-medium text-zinc-300 transition hover:text-red-500 after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-red-500 after:transition-all hover:after:w-full"
          >
            Leaderboard
          </Link>

          {!token ? (
            <>
              <Link
                href="/login"
                className="rounded-md border border-zinc-700 px-4 py-2 text-zinc-300 transition hover:border-red-500 hover:bg-red-500/10 hover:text-red-400"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-md bg-gradient-to-r from-red-600 to-red-500 px-5 py-2 font-semibold transition hover:scale-105"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/tournament"
                className="relative font-medium text-zinc-300 transition hover:text-red-500 after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-red-500 after:transition-all hover:after:w-full"
              >
                Tournaments
              </Link>

              {/* Existing Profile Dropdown */}
              <div className="relative">
                <div
                  onClick={() => setOpen(!open)}
                  className="flex cursor-pointer items-center gap-3 rounded-full border border-zinc-700 bg-zinc-900/80 px-4 py-2 transition-all duration-300 hover:border-red-500 hover:bg-zinc-800 hover:shadow-[0_0_20px_rgba(239,68,68,0.25)]"
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
                    className="rounded-full border-2 border-red-500 object-cover"
                    unoptimized
                  />

                  <span className="font-medium text-zinc-200">{user.name}</span>
                </div>

                {open && (
                  <div className="absolute right-0 top-16 z-50 w-56 overflow-hidden rounded-xl border border-red-500/30 bg-zinc-950/95 p-2 shadow-[0_10px_35px_rgba(239,68,68,0.18)] backdrop-blur-xl">
                    <div className="mb-2 border-b border-zinc-800 px-3 pb-2">
                      <p className="truncate font-semibold text-white">
                        {user.name}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <button
                        onClick={() => router.push("/profile")}
                        className="flex w-full rounded-lg px-3 py-2 text-left text-zinc-300 transition hover:bg-red-500/10 hover:text-red-500"
                      >
                        Profile
                      </button>

                      <button
                        onClick={() => router.push("/dashboard")}
                        className="flex w-full rounded-lg px-3 py-2 text-left text-zinc-300 transition hover:bg-red-500/10 hover:text-red-500"
                      >
                        Dashboard
                      </button>

                      <button
                        onClick={() => router.push("/tournament")}
                        className="flex w-full rounded-lg px-3 py-2 text-left text-zinc-300 transition hover:bg-red-500/10 hover:text-red-500"
                      >
                        My Tournaments
                      </button>

                      <div className="my-2 border-t border-zinc-800" />

                      <button
                        onClick={logout}
                        className="flex w-full rounded-lg px-3 py-2 text-left text-red-500 transition hover:bg-red-500/10"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setMobileMenu(!mobileMenu)}
          className="rounded-lg p-2 text-3xl text-red-500 lg:hidden"
        >
          {mobileMenu ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="border-t border-zinc-800 bg-zinc-950 lg:hidden">
          <div className="flex flex-col px-5 py-4">
            <Link
              href="/"
              onClick={() => setMobileMenu(false)}
              className="rounded-lg px-3 py-3 hover:bg-red-500/10"
            >
              Home
            </Link>

            <Link
              href="/players"
              onClick={() => setMobileMenu(false)}
              className="rounded-lg px-3 py-3 hover:bg-red-500/10"
            >
              Players
            </Link>

            <Link
              href="/leaderboard"
              onClick={() => setMobileMenu(false)}
              className="rounded-lg px-3 py-3 hover:bg-red-500/10"
            >
              Leaderboard
            </Link>

            {!token ? (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenu(false)}
                  className="mt-3 rounded-md border border-zinc-700 px-4 py-3 text-center"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  onClick={() => setMobileMenu(false)}
                  className="mt-3 rounded-md bg-red-600 px-4 py-3 text-center font-semibold"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/tournament"
                  onClick={() => setMobileMenu(false)}
                  className="rounded-lg px-3 py-3 hover:bg-red-500/10"
                >
                  Tournaments
                </Link>

                <Link
                  href="/profile"
                  onClick={() => setMobileMenu(false)}
                  className="rounded-lg px-3 py-3 hover:bg-red-500/10"
                >
                  Profile
                </Link>

                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenu(false)}
                  className="rounded-lg px-3 py-3 hover:bg-red-500/10"
                >
                  Dashboard
                </Link>

                <button
                  onClick={() => {
                    logout();
                    setMobileMenu(false);
                  }}
                  className="mt-3 rounded-lg bg-red-600 px-4 py-3 text-left font-semibold"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
