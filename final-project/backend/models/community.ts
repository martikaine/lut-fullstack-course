import { Model, Schema, model, Document } from "mongoose";
import { IUser } from "./user";

export interface ICommunity extends Document {
  name: string;
  description: string;
  createdAt: Date;
  creator: IUser["_id"];
}

const communitySchema = new Schema<ICommunity>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  creator: { type: Schema.Types.ObjectId, ref: "User" },
});

export const Community = model<ICommunity>("Community", communitySchema);
