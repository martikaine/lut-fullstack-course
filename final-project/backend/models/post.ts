import { Schema, model, Document } from "mongoose";
import { ICommunity } from "./community";
import { IUser } from "./user";

export interface IPost extends Document {
  title: string;
  content: string;
  community: ICommunity["_id"];
  author: IUser["_id"];
  createdAt: Date;
  votes: number;
  voteIds: Map<string, string>;
}

const postSchema: Schema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  community: { type: Schema.Types.ObjectId, ref: "Community" },
  author: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  votes: { type: Number, default: 0 },
  voteIds: { type: Map, of: String, default: {} },
});

export const Post = model<IPost>("Post", postSchema);
