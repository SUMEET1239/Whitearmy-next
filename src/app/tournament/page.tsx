"use client";
import { useEffect, useState } from "react";
import API from "@/services/api";
import toast from "react-hot-toast";

// ================= TYPES =================

interface Player {
  _id: string;
  name?: string;
  gameName?: string;
}

interface Winner {
  playerId: Player;
  position: number;
}

interface Tournament {
  _id: string;
  title: string;
  game: string;
  date: string;
  entryFee: number;
  prizePool: number;
  maxPlayers: number;
  players: Player[];
  winners: Winner[];
  resultDeclared: boolean;
}

interface RoomModal {
  open: boolean;
  id: string | null;
}

interface RoomData {
  roomId: string;
  roomPass: string;
}

interface TournamentForm {
  title: string;
  game: string;
  date: string;
  entryFee: string;
  prizePool: string;
  maxPlayers: string;
}

interface ResultSelection {
  winner?: string;
  second?: string;
  third?: string;
}

interface User {
  _id?: string;
  role?: string;
  wallet?: number;
}

// ================= COMPONENT =================

function Tournament() {
  const [user, setUser] = useState<User>({});
  const [data, setData] = useState<Tournament[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);

  const [roomModal, setRoomModal] = useState<RoomModal>({
    open: false,
    id: null,
  });

  const [roomData, setRoomData] = useState<RoomData>({
    roomId: "",
    roomPass: "",
  });

  const [time, setTime] = useState<Record<string, string>>({});

  const [resultForm, setResultForm] = useState<Record<string, ResultSelection>>(
    {},
  );

  const [successMsg, setSuccessMsg] = useState<string>("");

  const [form, setForm] = useState<TournamentForm>({
    title: "",
    game: "",
    date: "",
    entryFee: "",
    prizePool: "",
    maxPlayers: "",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // ================= TIMER =================

  const getTimeLeft = (date: string): string => {
    const diff = new Date(date).getTime() - new Date().getTime();

    if (diff <= 0) return "🔥 Started";

    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);

    return `${h}h ${m}m ${s}s`;
  };

  // ================= FETCH =================

  const fetchData = async (): Promise<void> => {
    try {
      const res = await API.get("/tournament/all");
      setData(res.data);
    } catch (err) {
      console.log("FETCH ERROR:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================= LIVE TIMER =================

  useEffect(() => {
    const interval = setInterval(() => {
      const t: Record<string, string> = {};

      data.forEach((x) => {
        t[x._id] = getTimeLeft(x.date);
      });

      setTime(t);
    }, 1000);

    return () => clearInterval(interval);
  }, [data]);

  // ================= CREATE =================

  const createTournament = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    try {
      await API.post("/tournament/create", form);

      setShowForm(false);

      setForm({
        title: "",
        game: "",
        date: "",
        entryFee: "",
        prizePool: "",
        maxPlayers: "",
      });

      toast.success("Tournament Created 🏆");

      fetchData();
    } catch {
      toast.error("Only leader can create ❌");
    }
  };

  // ================= JOIN =================

  const join = async (id: string): Promise<void> => {
    try {
      const res = await API.post(`/tournament/join/${id}`);

      toast.success(res.data.message);

      const updatedUser = {
        ...user,
        wallet: res.data.wallet,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      fetchData();
    } catch (err: any) {
      toast.error(err?.response?.data || "Join Failed ❌");
    }
  };

  // ================= ROOM =================

  const addRoom = async (): Promise<void> => {
    try {
      await API.post(`/tournament/add-room/${roomModal.id}`, roomData);

      setRoomModal({
        open: false,
        id: null,
      });

      setRoomData({
        roomId: "",
        roomPass: "",
      });

      toast.success("Room Added + Emails Sent 📩");

      fetchData();
    } catch {
      toast.error("Room Error ❌");
    }
  };

  // ================= RESULT =================

  const submitResult = async (id: string): Promise<void> => {
    const f = resultForm[id];

    if (!f?.winner || !f?.second || !f?.third) {
      toast.error("Select all players ❗");
      return;
    }

    if (f.winner === f.second || f.winner === f.third || f.second === f.third) {
      toast.error("Players must be different ⚠️");
      return;
    }

    try {
      await API.post(`/tournament/result/${id}`, {
        winners: [
          {
            playerId: f.winner,
            position: 1,
          },
          {
            playerId: f.second,
            position: 2,
          },
          {
            playerId: f.third,
            position: 3,
          },
        ],
      });

      toast.success("🏆 Result Declared!");

      fetchData();

      setTimeout(() => {
        setSuccessMsg("");
      }, 3000);
    } catch {
      toast.error("Result Error ❌");
    }
  };
  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-red-950 px-5 py-10 text-white">
      {/* Title */}

      <h1 className="mb-10 text-center text-5xl font-black">
        🏆{" "}
        <span className="bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">
          Gaming Tournaments
        </span>
      </h1>

      {/* Success */}

      {successMsg && (
        <div className="mx-auto mb-6 max-w-md rounded-xl border border-green-400 bg-green-500/20 p-4 text-center font-bold text-green-400 shadow-[0_0_25px_rgba(34,197,94,0.3)]">
          {successMsg}
        </div>
      )}

      {/* Create Button */}

      {user?.role === "leader" && (
        <div className="mb-8 flex justify-center">
          <button
            onClick={() => setShowForm(!showForm)}
            className="
rounded-xl
bg-gradient-to-r
from-red-600
to-orange-500
px-8 py-4
font-black
shadow-[0_0_30px_rgba(239,68,68,0.4)]
transition
hover:scale-105
"
          >
            ➕ Create Tournament
          </button>
        </div>
      )}

      {/* Form */}

      {showForm && (
        <form
          onSubmit={createTournament}
          className="
mx-auto mb-10
max-w-md
rounded-3xl
border border-zinc-800
bg-zinc-900/80
p-7
shadow-[0_0_40px_rgba(239,68,68,0.15)]
backdrop-blur
"
        >
          {[
            ["title", "Tournament Title"],
            ["game", "Game"],
            ["entryFee", "Entry Fee ₹"],
            ["prizePool", "Prize Pool ₹"],
            ["maxPlayers", "Maximum Players"],
          ].map(([name, placeholder]) => (
            <input
              key={name}
              type={
                name === "entryFee" ||
                name === "prizePool" ||
                name === "maxPlayers"
                  ? "number"
                  : "text"
              }
              placeholder={placeholder}
              value={form[name as keyof typeof form]}
              onChange={(e) =>
                setForm({
                  ...form,
                  [name]: e.target.value,
                })
              }
              className="mb-4 w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-white outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/30"
            />
          ))}
          <input
            type="date"
            value={form.date}
            onChange={(e) =>
              setForm({
                ...form,
                date: e.target.value,
              })
            }
            className="mb-5 w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-white"
          />

          <button
            className="
w-full
rounded-xl
bg-gradient-to-r
from-green-500
to-lime-400
py-3
font-black
text-black
shadow-[0_0_25px_rgba(34,197,94,0.4)]
hover:scale-105
transition
"
          >
            Create Tournament
          </button>
        </form>
      )}

      {/* Tournament Cards */}

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {data.map((t) => {
          const joined = (t.players || []).some((p) => p._id === user?._id);

          const maxPlayers = Number(t.maxPlayers) || 0;

          const isFull = maxPlayers > 0 && t.players.length >= maxPlayers;

          return (
            <div
              key={t._id}
              className={`
      relative overflow-hidden
      rounded-3xl
      border
      bg-gradient-to-br
      from-zinc-900
      to-black
      p-7
      transition-all
      duration-300
      hover:-translate-y-2

      ${
        t.resultDeclared
          ? "border-yellow-400 shadow-[0_0_35px_rgba(250,204,21,0.35)]"
          : "border-zinc-800 hover:border-red-500 hover:shadow-[0_0_35px_rgba(239,68,68,0.3)]"
      }
      `}
            >
              <h2 className="text-3xl font-black">{t.title}</h2>

              <div className="mt-5 space-y-3 text-zinc-300">
                <p>
                  🎮 <span className="font-semibold text-white">{t.game}</span>
                </p>

                <p>📅 {t.date}</p>

                <p>
                  💰 Entry :
                  <span className="ml-2 font-bold text-green-400">
                    ₹{t.entryFee || 0}
                  </span>
                </p>

                <p>
                  🏆 Prize :
                  <span className="ml-2 font-bold text-yellow-400">
                    ₹{t.prizePool || 0}
                  </span>
                </p>

                <p>
                  👥
                  <span className="font-bold text-red-400">
                    {t.players?.length || 0}/{maxPlayers}
                  </span>
                  Players
                </p>
              </div>

              <div className="mt-5 rounded-xl bg-red-500/10 p-3 text-center font-bold text-yellow-400">
                ⏰ {time[t._id]}
              </div>

              {t.resultDeclared && (
                <div
                  className="
        mt-5
        rounded-2xl
        border
        border-yellow-400
        bg-yellow-400/10
        p-5
        shadow-[0_0_25px_rgba(250,204,21,0.2)]
        "
                >
                  <h3 className="mb-3 text-xl font-black text-yellow-400">
                    🏆 Winners
                  </h3>

                  {t.winners.map((w, i) => (
                    <p key={i} className="text-zinc-200">
                      {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}{" "}
                      {w.playerId?.name}
                    </p>
                  ))}
                </div>
              )}

              {/* Join Button */}

              <button
                onClick={() => join(t._id)}
                disabled={joined || isFull}
                className="
        mt-6
        w-full
        rounded-xl
        bg-gradient-to-r
        from-green-500
        to-lime-400
        py-3
        font-black
        text-black
        transition
        hover:scale-105
        disabled:cursor-not-allowed
        disabled:opacity-50
        "
              >
                {joined
                  ? "Joined ✅"
                  : isFull
                    ? "Tournament Full"
                    : t.entryFee > 0
                      ? `Join ₹${t.entryFee}`
                      : "Join Free"}
              </button>

              {user?.role === "leader" && (
                <button
                  onClick={() =>
                    setRoomModal({
                      open: true,
                      id: t._id,
                    })
                  }
                  className="
          mt-3
          w-full
          rounded-xl
          bg-gradient-to-r
          from-orange-600
          to-orange-400
          py-3
          font-black
          transition
          hover:scale-105
          "
                >
                  🎮 Add Room
                </button>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}

export default Tournament;
