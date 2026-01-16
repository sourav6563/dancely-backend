import { Schema, model, Types } from "mongoose";

interface IPlaylist {
  owner: Types.ObjectId;
  videos: Types.ObjectId[];
  name: string;
  description: string;
}

const playlistSchema = new Schema<IPlaylist>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    videos: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Playlist = model<IPlaylist>("Playlist", playlistSchema);
