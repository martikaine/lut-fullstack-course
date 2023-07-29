import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { database, secret } from "./config/database";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { userRoutes } from "./routes/users";
import { expressjwt } from "express-jwt";
import { communityRoutes } from "./routes/communities";
import { postRoutes } from "./routes/posts";
import path from "path";

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

app.use(cors());
app.use(bodyParser.json());

app.use((err: any, req: any, res: any, next: any) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).send("Invalid token");
  } else {
    next(err);
  }
});

app.use("/api/users", userRoutes);
app.use("/api/communities", communityRoutes);
app.use("/api/posts", postRoutes);

app.use(express.static(path.join(__dirname, "public")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(port, () => {
  console.log(`Server started on port ${port}.`);
});
