import { Schema, model, Types } from "mongoose";

interface IFollow {
  follower: Types.ObjectId; // who follows
  following: Types.ObjectId; // whom they follow
}

const followSchema = new Schema<IFollow>(
  {
    follower: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    following: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

/* Prevent duplicate follow */
followSchema.index({ follower: 1, following: 1 }, { unique: true });

export const Follow = model<IFollow>("Follow", followSchema);
