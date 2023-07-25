import { ObjectId, Schema, model } from "mongoose";

export interface IComment {
  postId: ObjectId;
  creatorId: ObjectId;
  body: string;
}

const commentSchema = new Schema<IComment>({
  postId: { type: Schema.Types.ObjectId, required: true },
  creatorId: { type: Schema.Types.ObjectId, required: true },
  body: { type: String, required: false },
});

export const Comment = model<IComment>("Comment", commentSchema);
