import { Model, Schema, Document, model } from "mongoose";
import bcryptjs from "bcryptjs";

export interface IUser extends Document {
  username: string;
  passwordHash: string;
  email: string;
  createdAt: Date;
  karma: number;
}

interface IUserMethods {
  isPasswordCorrect(hash: string): Promise<boolean>;
}

interface UserModel extends Model<IUser, {}, IUserMethods> {
  addUser(user: {
    name: string;
    password: string;
    email: string;
  }): Promise<void>;
}

const userSchema: Schema = new Schema({
  username: { type: String, required: true },
  passwordHash: { type: String, required: true },
  email: {
    type: String,
    required: true,
    validate: {
      validator: function (email: string) {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
      },
      message: (props: { value: string }) =>
        `${props.value} is not a valid email!`,
    },
  },
  createdAt: { type: Date, default: Date.now },
  karma: { type: Number, default: 0 },
});

userSchema.method("isPasswordCorrect", async function (password: string) {
  return await bcryptjs.compare(password, this.passwordHash);
});

userSchema.static(
  "addUser",
  async function (user: { name: string; password: string; email: string }) {
    const salt = await bcryptjs.genSalt();
    const hash = await bcryptjs.hash(user.password, salt);

    return await this.create<IUser>({
      username: user.name,
      passwordHash: hash,
      email: user.email,
    });
  }
);

export const User = model<IUser, UserModel>("User", userSchema);
