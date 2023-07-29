import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./user";
import { IPost } from "./post";

export interface IComment extends Document {
  content: string;
  post: IPost["_id"];
  parentCommentId: IComment["_id"] | null;
  author: IUser["_id"];
  createdAt: Date;
  votes: number;
  voteIds: Map<string, "up" | "down">;
}

const CommentSchema: Schema = new Schema({
  content: { type: String, required: true },
  post: { type: Schema.Types.ObjectId, ref: "Post" },
  parentCommentId: {
    type: Schema.Types.ObjectId,
    ref: "Comment",
    default: null,
  },
  author: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  votes: { type: Number, default: 0 },
  voteIds: { type: Map, of: String, default: {} },
});

export const Comment = mongoose.model<IComment>("Comment", CommentSchema);
