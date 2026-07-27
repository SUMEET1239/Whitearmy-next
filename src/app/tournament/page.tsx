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
    <div className="min-h-screen bg-[#0f0f0f] text-white px-5 py-6">
      {/* Title */}
      <h1 className="mb-6 text-center text-3xl font-bold text-red-500 drop-shadow-[0_0_10px_rgba(255,0,0,0.5)] md:text-4xl">
        🏆 Gaming Tournaments
      </h1>

      {/* Success Message */}
      {successMsg && (
        <div className="mx-auto mb-5 max-w-md rounded-lg bg-green-500 p-3 text-center font-semibold text-black shadow-lg">
          {successMsg}
        </div>
      )}

      {/* Create Button */}
      {user?.role === "leader" && (
        <div className="mb-5 flex justify-center">
          <button
            onClick={() => setShowForm(!showForm)}
            className="rounded-xl bg-gradient-to-r from-red-600 to-red-400 px-6 py-3 font-bold text-white transition duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(255,0,0,0.4)]"
          >
            ➕ Create Tournament
          </button>
        </div>
      )}

      {/* Create Form */}
      {showForm && (
        <form
          onSubmit={createTournament}
          className="mx-auto mb-8 max-w-md rounded-2xl border border-zinc-800 bg-[#111] p-6 shadow-xl"
        >
          {/* Title */}
          <input
            type="text"
            placeholder="Tournament Title"
            value={form.title}
            onChange={(e) =>
              setForm({
                ...form,
                title: e.target.value,
              })
            }
            className="mb-4 w-full rounded-lg border border-zinc-700 bg-[#1d1d1d] px-4 py-3 text-white outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/30"
          />

          {/* Game */}
          <input
            type="text"
            placeholder="Game"
            value={form.game}
            onChange={(e) =>
              setForm({
                ...form,
                game: e.target.value,
              })
            }
            className="mb-4 w-full rounded-lg border border-zinc-700 bg-[#1d1d1d] px-4 py-3 text-white outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/30"
          />

          {/* Date */}
          <input
            type="date"
            value={form.date}
            onChange={(e) =>
              setForm({
                ...form,
                date: e.target.value,
              })
            }
            className="mb-4 w-full rounded-lg border border-zinc-700 bg-[#1d1d1d] px-4 py-3 text-white outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/30"
          />

          {/* Entry Fee */}
          <input
            type="number"
            placeholder="Entry Fee ₹"
            value={form.entryFee}
            onChange={(e) =>
              setForm({
                ...form,
                entryFee: e.target.value,
              })
            }
            className="mb-4 w-full rounded-lg border border-zinc-700 bg-[#1d1d1d] px-4 py-3 text-white outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/30"
          />

          {/* Prize Pool */}
          <input
            type="number"
            placeholder="Prize Pool ₹"
            value={form.prizePool}
            onChange={(e) =>
              setForm({
                ...form,
                prizePool: e.target.value,
              })
            }
            className="mb-4 w-full rounded-lg border border-zinc-700 bg-[#1d1d1d] px-4 py-3 text-white outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/30"
          />

          {/* Max Players */}
          <input
            type="number"
            placeholder="Maximum Players"
            value={form.maxPlayers}
            onChange={(e) =>
              setForm({
                ...form,
                maxPlayers: e.target.value,
              })
            }
            className="mb-5 w-full rounded-lg border border-zinc-700 bg-[#1d1d1d] px-4 py-3 text-white outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/30"
          />

          {/* Submit */}
          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-green-600 to-lime-400 py-3 font-bold text-black transition hover:scale-[1.02]"
          >
            Create Tournament
          </button>
        </form>
      )}

      {/* Tournament Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {data.map((t) => {
          const joined = (t.players || []).some((p) => p._id === user?._id);

          const maxPlayers = Number(t.maxPlayers) || 0;

          const isFull = maxPlayers > 0 && t.players.length >= maxPlayers;

          return (
            <div
              key={t._id}
              className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br from-[#1a1a1a] to-[#111] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-red-500 hover:shadow-[0_0_18px_rgba(255,0,0,0.25)]
            ${
              t.resultDeclared
                ? "border-yellow-400 shadow-[0_0_20px_rgba(255,215,0,0.4)]"
                : "border-zinc-800"
            }`}
            >
              {/* Tournament Info */}

              <h2 className="mb-3 text-2xl font-bold text-white">{t.title}</h2>

              <p className="mb-2 text-zinc-300">🎮 {t.game}</p>

              <p className="mb-2 text-zinc-300">📅 {t.date}</p>

              <p className="mb-2 text-zinc-300">
                💰 Entry Fee :
                <span className="font-semibold text-green-400">
                  {" "}
                  ₹{t.entryFee || 0}
                </span>
              </p>

              <p className="mb-2 text-zinc-300">
                🏆 Prize Pool :
                <span className="font-semibold text-yellow-400">
                  {" "}
                  ₹{t.prizePool || 0}
                </span>
              </p>

              <p className="mb-3 text-zinc-300">
                👥 {t.players.length}/{maxPlayers} Players
              </p>

              {/* Timer */}

              <p className="mb-4 font-bold text-yellow-400">⏰ {time[t._id]}</p>

              {/* Winners */}

              {t.resultDeclared && (
                <div className="mb-4 rounded-xl border-2 border-yellow-400 p-4 shadow-[0_0_20px_rgba(255,215,0,0.4)]">
                  <h3 className="mb-3 text-lg font-bold text-yellow-400">
                    🏆 Winners
                  </h3>

                  {t.winners.map((w, i) => (
                    <p key={i} className="mb-1 text-white">
                      {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}{" "}
                      {w.playerId?.name}
                    </p>
                  ))}
                </div>
              )}

              {/* Join */}

              <button
                onClick={() => join(t._id)}
                disabled={joined || isFull}
                className="mb-3 w-full rounded-xl bg-gradient-to-r from-green-600 to-lime-400 py-3 font-bold text-black transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {joined
                  ? "Joined"
                  : isFull
                    ? "Full"
                    : t.entryFee > 0
                      ? `Join ₹${t.entryFee}`
                      : "Join Free"}
              </button>

              {/* Add Room */}

              {user?.role === "leader" && (
                <button
                  onClick={() =>
                    setRoomModal({
                      open: true,
                      id: t._id,
                    })
                  }
                  className="mb-3 w-full rounded-xl bg-gradient-to-r from-orange-600 to-orange-400 py-3 font-bold text-white transition hover:scale-[1.02]"
                >
                  Add Room
                </button>
              )}

              {/* Room Modal */}

              {roomModal.open && roomModal.id === t._id && (
                <div className="mt-4 flex flex-col gap-3 rounded-xl border border-zinc-700 bg-[#161616] p-4 animate-fadeIn">
                  <input
                    type="text"
                    placeholder="Room ID"
                    value={roomData.roomId}
                    onChange={(e) =>
                      setRoomData({
                        ...roomData,
                        roomId: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-zinc-700 bg-[#1d1d1d] px-4 py-3 text-white outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/30"
                  />

                  <input
                    type="text"
                    placeholder="Password"
                    value={roomData.roomPass}
                    onChange={(e) =>
                      setRoomData({
                        ...roomData,
                        roomPass: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-zinc-700 bg-[#1d1d1d] px-4 py-3 text-white outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/30"
                  />

                  <button
                    onClick={addRoom}
                    className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-400 py-3 font-bold text-white transition hover:scale-[1.02]"
                  >
                    Save Room
                  </button>
                </div>
              )}
              {/* Result Section */}
              {user?.role === "leader" && (
                <>
                  {t.resultDeclared ? (
                    <div className="mt-3 rounded-lg bg-gradient-to-r from-green-400 to-green-300 py-3 text-center font-bold text-black">
                      ✅ Result Declared
                    </div>
                  ) : (
                    <button
                      onClick={() =>
                        setResultForm((prev) => ({
                          ...prev,
                          [t._id]: {},
                        }))
                      }
                      className="mt-3 w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-400 py-3 font-bold text-white transition hover:scale-[1.02]"
                    >
                      Declare Result
                    </button>
                  )}

                  {!t.resultDeclared && resultForm[t._id] && (
                    <div className="mt-4 flex flex-col gap-3 rounded-xl border border-zinc-700 bg-[#181818] p-4">
                      {(["winner", "second", "third"] as const).map((key) => (
                        <select
                          key={key}
                          value={resultForm[t._id]?.[key] || ""}
                          onChange={(e) =>
                            setResultForm((prev) => ({
                              ...prev,
                              [t._id]: {
                                ...prev[t._id],
                                [key]: e.target.value,
                              },
                            }))
                          }
                          className="w-full rounded-lg border border-zinc-700 bg-[#1d1d1d] px-4 py-3 text-white outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/30"
                        >
                          <option value="">Select {key}</option>

                          {(t.players || []).map((pl) => (
                            <option key={pl._id} value={pl._id}>
                              {pl.name || pl.gameName}
                            </option>
                          ))}
                        </select>
                      ))}

                      <button
                        onClick={() => submitResult(t._id)}
                        className="w-full rounded-xl bg-gradient-to-r from-green-600 to-lime-400 py-3 font-bold text-black transition hover:scale-[1.02]"
                      >
                        Submit Result
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Tournament;
