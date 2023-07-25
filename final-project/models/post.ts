import { ObjectId, Schema, model } from "mongoose";

export interface IPost {
  communityId: ObjectId;
  creatorId: ObjectId;
  title: string;
  body?: string;
  url?: string;
}

const postSchema = new Schema<IPost>({
  communityId: { type: Schema.Types.ObjectId, required: true },
  creatorId: { type: Schema.Types.ObjectId, required: true },
  title: { type: String, required: true },
  body: { type: String, required: false },
  url: { type: String, required: false },
});

export const Post = model<IPost>("Post", postSchema);
