import mongoose, { Schema, models, model } from "mongoose";

const TournamentSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    game: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: String,
      required: true,
    },

    entryFee: {
      type: Number,
      default: 0,
    },

    prizePool: {
      type: Number,
      default: 0,
    },

    maxPlayers: {
      type: Number,
      default: 0,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    resultDeclared: {
      type: Boolean,
      default: false,
    },

    players: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      default: [],
    },

    winners: [
      {
        playerId: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },

        position: {
          type: Number,
          required: true,
        },
      },
    ],

    roomId: {
      type: String,
      default: "",
    },

    roomPass: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

export default models.Tournament || model("Tournament", TournamentSchema);
