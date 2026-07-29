export default function Footer() {
  return (
    <footer className="border-t border-red-500/20 bg-gradient-to-r from-black via-zinc-950 to-black px-4 py-8 text-zinc-400 shadow-[0_-10px_30px_rgba(239,68,68,0.08)]">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 text-center">
        <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
          🔥 WhiteArmy <span className="text-red-500">Gaming</span>
        </h2>

        <p className="text-xs text-zinc-400 sm:text-sm">
          © 2026 WhiteArmy 🎮 | All Rights Reserved
        </p>

        <p className="text-xs text-zinc-500 sm:text-sm">
          Built with ❤️ by{" "}
          <span className="font-semibold text-red-500">Sumeet</span>
        </p>
      </div>
    </footer>
  );
}
