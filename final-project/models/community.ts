import { Model, Schema, model } from "mongoose";

export interface ICommunity {
  name: string;
  description: string;
}

interface CommunityModel extends Model<ICommunity> {
  addCommunity(c: ICommunity): Promise<void>;
}

const communitySchema = new Schema<ICommunity, CommunityModel>({
  name: { type: String, required: true },
  description: { type: String, required: true },
});

export const Community = model<ICommunity>("Community", communitySchema);
