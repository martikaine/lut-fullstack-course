import { Router } from "express";
import { Community } from "../models/community";
import { Post } from "../models/post";
import { Request } from "express-jwt";
import { AuthUser } from "./users";
import { getErrorMessage } from "../utils";

const postsPerPage = 10;

export const communityRoutes = Router();

communityRoutes.get("/", async (_, res) => {
  res.send(await Community.find());
});

communityRoutes.get("/:name", async (req, res) => {
  res.send(await Community.findOne({ name: req.params.name }));
});

communityRoutes.post("/", async (req, res) => {
  const community = await Community.create({
    name: req.body.name,
    description: req.body.description,
  });

  res.status(201).json(community);
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
communityRoutes.get(
  "/:communityName/posts",
  async (req: Request<AuthUser>, res) => {
    const page = Number(req.query.page) || 1;

    try {
      const community = await Community.findOne({
        name: req.params.communityName,
      });

      if (!community) {
        return res.status(404).json({ message: "Community not found" });
      }

      const totalPosts = await Post.countDocuments({
        community: community._id,
      });
      const totalPages = Math.ceil(totalPosts / postsPerPage);

      const posts = await Post.find({ community: community._id })
        .populate("author", "username")
        .skip((page - 1) * postsPerPage)
        .limit(postsPerPage)
        .lean();

      console.log(posts);
      const postsWithVoteStatus = posts.map((post) => {
        const voteStatus = post.voteIds[req.auth!.id] || "none";
        return { ...post, voteStatus };
      });

      res.json({
        totalPages: totalPages,
        currentPage: page,
        posts: postsWithVoteStatus,
      });
    } catch (error) {
      res.status(500).json({ message: getErrorMessage(error) });
    }
  }
);

// Add a post to a community
communityRoutes.post(
  "/:communityName/posts",
  async (req: Request<AuthUser>, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Missing one or more required fields: title, content",
      });
    }

    console.log(req.params.communityName);

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
