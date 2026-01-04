import { Schema, model, Types } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

interface Comment {
  video: Types.ObjectId;
  owner: Types.ObjectId;
  content: string;
}

const commentSchema = new Schema<Comment>(
  {
    video: {
      type: Schema.Types.ObjectId,
      ref: "Video",
      required: true,
      index: true,
    },
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
    },
  },
  {
    timestamps: true,
  },
);

commentSchema.plugin(mongooseAggregatePaginate);

export const Comment = model<Comment>("Comment", commentSchema);
