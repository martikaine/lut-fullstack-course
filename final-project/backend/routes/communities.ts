import { Router } from "express";
import { Community } from "../models/community";
import { Post } from "../models/post";
import { Request, expressjwt } from "express-jwt";
import { AuthUser } from "./users";
import { getErrorMessage } from "../utils";
import { secret } from "../config/database";

const postsPerPage = 10;

export const communityRoutes = Router();

communityRoutes.get(
  "/",
  expressjwt({ secret: secret, algorithms: ["HS256"] }),
  async (_, res) => {
    res.send(await Community.find());
  }
);

communityRoutes.get(
  "/:name",
  expressjwt({ secret: secret, algorithms: ["HS256"] }),
  async (req, res) => {
    res.send(await Community.findOne({ name: req.params.name }));
  }
);

communityRoutes.post(
  "/",
  expressjwt({ secret: secret, algorithms: ["HS256"] }),
  async (req: Request<AuthUser>, res) => {
    const community = await Community.create({
      name: req.body.name,
      description: req.body.description,
      creator: req.auth!.id,
    });

    res.status(201).json(community);
  }
);

communityRoutes.delete(
  "/:name",
  expressjwt({ secret: secret, algorithms: ["HS256"] }),
  async (req: Request<AuthUser>, res) => {
    if (req.auth?.isAdmin) {
      Community.deleteOne({ name: req.params.name });
      res.sendStatus(200);
    } else {
      res.sendStatus(401);
    }
  }
);

// Add a post to a community
communityRoutes.post(
  "/:communityName/posts",
  expressjwt({ secret: secret, algorithms: ["HS256"] }),
  async (req: Request<AuthUser>, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Missing one or more required fields: title, content",
      });
    }

    try {
      const community = await Community.findOne({
        name: req.params.communityName,
      });

      if (!community) {
        return res.status(404).json({ message: "Community not found" });
      }

      const newPost = new Post({
        title: title,
        content: content,
        community: community._id,
        author: req.auth?.id,
      });

      const savedPost = await newPost.save();

      res.status(201).json(savedPost);
    } catch (error) {
      res.status(500).json({ message: getErrorMessage(error) });
    }
  }
);
