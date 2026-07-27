import mongoose, { Schema, models, model } from "mongoose";

const PlayerSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    uid: String,
    gameName: String,
    rank: String,
    role: String,
    name: String,
    level: Number,

    points: {
      type: Number,
      default: 0,
    },

    wins: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

export default models.Player || model("Player", PlayerSchema);
