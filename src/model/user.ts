import mongoose, { Schema, models, model } from "mongoose";

const UserSchema = new Schema(
  {
    name: String,
    email: String,
    password: String,

    role: {
      type: String,
      default: "user",
    },

    avatar: {
      type: String,
      default: "",
    },

    wallet: {
      type: Number,
      default: 0,
    },

    wins: {
      type: Number,
      default: 0,
    },

    points: {
      type: Number,
      default: 0,
    },

    transactions: [
      {
        type: {
          type: String,
        },
        amount: Number,
        reason: String,
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export default models.User || model("User", UserSchema);
