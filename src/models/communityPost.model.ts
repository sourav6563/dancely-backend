import { Schema, model, Types } from "mongoose";

interface CommunityPost {
  owner: Types.ObjectId;
  content: string;
}

const communityPostSchema = new Schema<CommunityPost>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
  },
  { timestamps: true },
);

export const CommunityPost = model<CommunityPost>("CommunityPost", communityPostSchema);
