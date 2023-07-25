import { Model, Schema, model } from "mongoose";
import bcryptjs from "bcryptjs";

export interface IUser {
  name: string;
  email: string;
  username: string;
  password: string;
}

interface IUserMethods {
  isPasswordCorrect(hash: string): Promise<boolean>;
}

interface UserModel extends Model<IUser, {}, IUserMethods> {
  addUser(user: IUser): Promise<void>;
}

const userSchema = new Schema<IUser, UserModel, IUserMethods>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
});

userSchema.method("isPasswordCorrect", async function (password: string) {
  return await bcryptjs.compare(password, this.password);
});

userSchema.static("addUser", async function (user: IUser) {
  const salt = await bcryptjs.genSalt();
  const hash = await bcryptjs.hash(user.password, salt);

  user.password = hash;
  return await this.create(user);
});

export const User = model<IUser, UserModel>("User", userSchema);
