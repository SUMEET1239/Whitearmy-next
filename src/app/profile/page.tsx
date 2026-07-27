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
    <main className="flex min-h-screen items-center justify-center bg-black px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-zinc-900 p-8 shadow-[0_0_20px_rgba(255,0,0,0.25)]">
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
            width={100}
            height={100}
            unoptimized
            className="rounded-full border-4 border-red-600 object-cover"
          />

          <h2 className="mt-4 text-3xl font-bold text-white">{user.name}</h2>

          <p className="text-gray-400">{user.email}</p>

          <div className="mt-6 w-full rounded-xl border border-red-600 bg-black p-5 text-center">
            <p className="text-gray-400">💰 Wallet Balance</p>

            <h1 className="mt-2 text-4xl font-bold text-cyan-400">
              ₹{user.wallet || 0}
            </h1>
          </div>
          {/* Transaction History */}
          <div className="mt-8">
            <h3 className="mb-4 text-xl font-semibold text-white">
              📜 Transaction History
            </h3>

            {transactions.length === 0 ? (
              <p className="text-center text-gray-500">No transactions yet</p>
            ) : (
              <div className="max-h-64 space-y-3 overflow-y-auto">
                {transactions.map((transaction, index) => (
                  <div
                    key={transaction._id || index}
                    className={`flex items-center justify-between rounded-lg border p-3 ${
                      transaction.type === "credit"
                        ? "border-l-4 border-l-cyan-400 border-zinc-700 bg-zinc-800"
                        : "border-l-4 border-l-red-500 border-zinc-700 bg-zinc-800"
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-white">
                        {transaction.reason}
                      </p>

                      <span className="text-xs text-gray-400">
                        {new Date(transaction.date).toLocaleString()}
                      </span>
                    </div>

                    <div
                      className={`font-bold ${
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
          <div className="mt-8">
            <input
              type="file"
              accept="image/*"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setFile(e.target.files?.[0] || null)
              }
              className="mb-4 w-full rounded-md border border-zinc-700 bg-black px-3 py-2 text-white file:mr-4 file:rounded-md file:border-0 file:bg-red-600 file:px-4 file:py-2 file:text-white"
            />

            <button
              onClick={uploadAvatar}
              className="w-full rounded-md bg-red-600 py-3 font-semibold text-white transition hover:bg-red-700"
            >
              Upload Avatar
            </button>
          </div>

          {/* Add Money */}

          <div className="mt-8">
            <input
              type="number"
              placeholder="Enter Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mb-4 w-full rounded-md border border-zinc-700 bg-black px-4 py-3 text-white outline-none focus:border-red-500"
            />

            <button
              onClick={payNow}
              className="w-full rounded-md bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700"
            >
              💳 Add Money
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
