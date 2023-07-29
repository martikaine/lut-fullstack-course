import express from "express";
import path from "path";
import cors from "cors";
import bodyParser from "body-parser";
import { database, secret } from "./config/database";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { userRoutes } from "./routes/users";
import { expressjwt } from "express-jwt";
import { communityRoutes } from "./routes/communities";
import { postRoutes } from "./routes/posts";

mongoose.connect(database);

mongoose.connection.on("connected", () => {
  console.log("Connected to db");
});

mongoose.connection.on("error", (err) => {
  console.log("db error: " + err);
});

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:4200",
  })
);
app.use(bodyParser.json());

app.use(
  expressjwt({ secret: secret, algorithms: ["HS256"] }).unless({
    path: ["/users/auth", "/users/register"],
  })
);

app.use((err: any, req: any, res: any, next: any) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).send("Invalid token");
  } else {
    next(err);
  }
});

app.use("/users", userRoutes);
app.use("/communities", communityRoutes);
app.use("/posts", postRoutes);

app.get("/", (_, res) => res.send("Hello world!"));

app.listen(port, () => {
  console.log(`Server started on port ${port}.`);
});
