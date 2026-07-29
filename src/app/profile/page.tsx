"use client";

import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "@/services/api";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  wallet?: number;
}

interface Transaction {
  _id?: string;
  reason: string;
  amount: number;
  type: "credit" | "debit";
  date: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [amount, setAmount] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/auth/profile");

      setUser(res.data);

      fetchTransactions(res.data._id);
    } catch (error) {
      console.error(error);
      toast.error("Please login again");
      router.replace("/login");
    }
  };

  const fetchTransactions = async (userId: string) => {
    try {
      const res = await API.get(`/user/transactions/${userId}`);
      setTransactions(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const uploadAvatar = async () => {
    if (!file || !user) {
      toast.error("Select image ❌");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await API.post(`/user/upload-avatar/${user._id}`, formData);

      localStorage.setItem("user", JSON.stringify(res.data.user));

      setUser(res.data.user);

      toast.success("Avatar Updated 🔥");
    } catch (error) {
      console.error(error);
      toast.error("Upload Failed ❌");
    }
  };

  const payNow = async () => {
    if (!user) return;

    if (!amount || Number(amount) <= 0) {
      toast.error("Enter valid amount");
      return;
    }

    try {
      const { data: order } = await API.post("/payment/create-order", {
        amount,
      });

      const options = {
        key: "rzp_test_SkvYzPQcYsnukc",
        amount: order.amount,
        currency: "INR",
        name: "WhiteArmy",
        description: "Add Money",
        order_id: order.id,

        handler: async (response: any) => {
          await API.post("/payment/verify", {
            ...response,
            userId: user._id,
            amount,
          });

          const updatedUser = {
            ...user,
            wallet: (user.wallet || 0) + Number(amount),
          };

          localStorage.setItem("user", JSON.stringify(updatedUser));

          setUser(updatedUser);

          toast.success("Payment Success 💰");
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error(error);
      toast.error("Payment Failed ❌");
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-white">
        Loading...😅
      </div>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-black via-zinc-950 to-red-950 px-4 py-8 text-white sm:px-6 sm:py-10 lg:px-8">
      <div className="w-full max-w-md rounded-3xl border border-red-500/20 bg-zinc-900/80 p-6 shadow-[0_0_40px_rgba(239,68,68,0.15)] backdrop-blur sm:p-8">
        <div className="flex flex-col items-center">
          <Image
            key={user.avatar}
            src={
              user.avatar
                ? user.avatar
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.name,
                  )}`
            }
            alt={user.name}
            width={110}
            height={110}
            unoptimized
            className="h-24 w-24 rounded-full border-4 border-red-500 object-cover shadow-[0_0_25px_rgba(239,68,68,0.5)] sm:h-[110px] sm:w-[110px]"
          />

          <h2 className="mt-5 break-words text-center text-2xl font-black text-white sm:text-3xl">
            {user.name}
          </h2>

          <p className="mt-1 break-all text-center text-sm text-zinc-400 sm:text-base">
            {user.email}
          </p>

          {/* Wallet */}

          <div className="mt-8 w-full rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-zinc-900 to-black p-5 text-center shadow-[0_0_25px_rgba(34,211,238,0.15)] sm:p-6">
            <p className="text-sm text-zinc-400">💰 Wallet Balance</p>

            <h1 className="mt-3 text-4xl font-black text-cyan-400 sm:text-5xl">
              ₹{user.wallet || 0}
            </h1>
          </div>

          {/* Transaction History */}

          <div className="mt-8 w-full sm:mt-10">
            <h3 className="mb-5 text-lg font-bold text-white sm:text-xl">
              📜 Transaction History
            </h3>

            {transactions.length === 0 ? (
              <p className="rounded-xl border border-zinc-800 bg-black p-4 text-center text-sm text-zinc-500 sm:text-base">
                No transactions yet
              </p>
            ) : (
              <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
                {transactions.map((transaction, index) => (
                  <div
                    key={transaction._id || index}
                    className={`flex items-center justify-between rounded-xl border bg-black p-3 transition hover:-translate-y-1 sm:p-4 ${
                      transaction.type === "credit"
                        ? "border-cyan-500/40"
                        : "border-red-500/40"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-white">
                        {transaction.reason}
                      </p>

                      <span className="block text-xs text-zinc-500">
                        {new Date(transaction.date).toLocaleString()}
                      </span>
                    </div>

                    <div
                      className={`ml-3 whitespace-nowrap text-sm font-bold sm:text-base ${
                        transaction.type === "credit"
                          ? "text-cyan-400"
                          : "text-red-500"
                      }`}
                    >
                      {transaction.type === "credit" ? "+" : "-"}₹
                      {transaction.amount}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upload Avatar */}

          <div className="mt-8 w-full rounded-2xl border border-zinc-800 bg-black p-5 sm:mt-10">
            <h3 className="mb-4 text-lg font-bold">🖼️ Update Avatar</h3>

            <input
              type="file"
              accept="image/*"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setFile(e.target.files?.[0] || null)
              }
              className="mb-4 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm file:mr-2 file:mb-2 file:rounded-lg file:border-0 file:bg-red-600 file:px-4 file:py-2 file:text-white sm:file:mr-4 sm:file:mb-0"
            />

            <button
              onClick={uploadAvatar}
              className="w-full rounded-xl bg-gradient-to-r from-red-600 to-red-500 py-3 font-bold transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(239,68,68,0.5)]"
            >
              Upload Avatar
            </button>
          </div>

          {/* Add Money */}

          <div className="mt-6 w-full rounded-2xl border border-zinc-800 bg-black p-5">
            <h3 className="mb-4 text-lg font-bold">💳 Add Wallet Balance</h3>

            <input
              type="number"
              placeholder="Enter Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mb-4 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-green-500 sm:text-base"
            />

            <button
              onClick={payNow}
              className="w-full rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 py-3 font-bold transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(34,197,94,0.4)]"
            >
              💳 Add Money
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
