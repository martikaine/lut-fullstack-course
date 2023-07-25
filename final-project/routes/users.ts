import { Router } from "express";
import { IUser, User } from "../models/user";
import jwt from "jsonwebtoken";
import { getErrorMessage } from "../utils";
import { secret } from "../config/database";
import { Request } from "express-jwt";

export interface AuthUser {
  id: string;
  name: string;
  username: string;
  email: string;
  isAdmin: boolean;
}

export const userRoutes = Router();

userRoutes.post("/register", async (req, res) => {
  try {
    User.addUser({
      name: req.body.name,
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
    });

    res.send("Created");
  } catch (e) {
    res
      .status(400)
      .send({ msg: "Failed to create user", details: getErrorMessage(e) });
  }
});

userRoutes.post("/auth", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const user = await User.findOne({ name: username });

  if (!user) {
    res.sendStatus(404);
    return;
  }

  const isMatch = await user.isPasswordCorrect(password);
  if (isMatch) {
    const userObj = {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
    };
    const token = jwt.sign(userObj, secret, { expiresIn: 86400 });

    res.json({
      token,
      user: userObj,
    });
  } else {
    res.status(400).send("Incorrect password");
  }
});

userRoutes.get("/users/:username", async (req: Request<AuthUser>, res) => {
  const name = req.params.username;
  const user = await User.findOne({ name });

  if (!user) {
    res.sendStatus(404);
    return;
  }

  // Show personal info if this is our own profile
  if (user.name === req.auth?.username) {
    res.send(user);
  } else {
    res.send({ name: user.name });
  }
});
