import { Router } from "express";
import { Community } from "../models/community";
import { Post } from "../models/post";
import { Comment } from "../models/comment";
import { Request } from "express-jwt";
import { AuthUser } from "./users";

export const communityRoutes = Router();

communityRoutes.get("/", async (_, res) => {
  res.send(await Community.find());
});

communityRoutes.get("/:name", async (req, res) => {
  res.send(await Community.findOne({ name: req.params.name }));
});

communityRoutes.post("/", async (req, res) => {
  new Community({
    name: req.body.name,
    description: req.body.description,
  }).save();

  res.sendStatus(201);
});

communityRoutes.delete("/:name", async (req: Request<AuthUser>, res) => {
  if (req.auth?.isAdmin) {
    Community.deleteOne({ name: req.params.name });
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});

// Get posts in a community
communityRoutes.get("/:name/posts", async (req, res) => {
  const community = await Community.findOne({ name: req.params.name });

  if (!community) {
    res.sendStatus(404);
    return;
  }

  res.send(Post.find({ communityId: community._id }));
});

// Add a post to a community
communityRoutes.post("/:name/posts", async (req: Request<AuthUser>, res) => {
  const community = await Community.findOne({ name: req.params.name });

  if (!community) {
    res.sendStatus(404);
    return;
  }

  new Post({
    communityId: community._id,
    creatorId: req.auth!.id,
    title: req.body.title,
    body: req.body.body,
    url: req.body.url,
  }).save();

  res.sendStatus(201);
});

// Get comments on a post
communityRoutes.get("/:name/posts/:postId/comments", async (req, res) => {
  res.send(Comment.find({ postId: req.params.postId }));
});

// Add a comment to a post
communityRoutes.post(
  "/:name/posts/:postId/comments",
  async (req: Request<AuthUser>, res) => {
    const post = await Post.findOne({ post: req.params.postId });
    if (!post) {
      res.sendStatus(404);
      return;
    }

    new Comment({
      postId: post._id,
      creatorId: req.auth!.id,
      body: req.body.body,
    }).save();

    res.sendStatus(201);
  }
);
