import { Router } from "express";
import { Community } from "../models/community";
import { Post } from "../models/post";
import { getErrorMessage } from "../utils";
import { AuthUser } from "./users";
import { Request } from "express-jwt";
import { Comment, IComment } from "../models/comment";
import { FlattenMaps, Types } from "mongoose";

const postsPerPage = 10;

export const postRoutes = Router();

type VoteDirection = "up" | "down";

function getScoreChange(newDir: VoteDirection, oldDir: VoteDirection): number {
  if (newDir === "up") {
    switch (oldDir) {
      case "up":
        return -1;
      case "down":
        return 2;
      default:
        return 1;
    }
  } else {
    switch (oldDir) {
      case "down":
        return 1;
      case "up":
        return -2;
      default:
        return -1;
    }
  }
}

// Get a paginated list of posts
postRoutes.get("/", async (req: Request<AuthUser>, res) => {
  const page = Number(req.query.page) || 1;

  try {
    let queryFilter = {};
    if (req.query.communityName) {
      const community = await Community.findOne({
        name: req.body.filter.communityName,
      });

      if (!community) {
        return res.status(404).json({ message: "Community not found" });
      }

      queryFilter = {
        community: community._id,
      };
    }

    const totalPosts = await Post.countDocuments(queryFilter);
    const totalPages = Math.ceil(totalPosts / postsPerPage);

    const posts = await Post.find(queryFilter)
      .populate("author", "username")
      .skip((page - 1) * postsPerPage)
      .limit(postsPerPage)
      .sort({ createdAt: "desc" })
      .lean();

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
});

// Get a single post
postRoutes.get("/:id", async (req: Request<AuthUser>, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "username")
      .lean();

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json({ ...post, voteStatus: post.voteIds[req.auth!.id] || "none" });
  } catch (error) {
    res.status(500).json({ message: getErrorMessage(error) });
  }
});

// Vote a post up or down
postRoutes.post("/:postId/vote", async (req: Request<AuthUser>, res) => {
  const userId = req.auth!.id;
  const postId = req.params.postId;
  const voteDirection = req.body.type as VoteDirection;

  if (!voteDirection) {
    return res.status(400).json({
      message: "Missing one or more required fields: type",
    });
  }

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const currentDirection = post.voteIds.get(userId) as VoteDirection;
    const scoreDiff = getScoreChange(voteDirection, currentDirection);
    post.votes += scoreDiff;

    if (voteDirection === currentDirection) {
      post.voteIds.delete(userId);
    } else {
      post.voteIds.set(userId, voteDirection);
    }

    post.markModified("voteIds");
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: getErrorMessage(error) });
  }
});

type CommentResponse = FlattenMaps<IComment> & {
  _id: Types.ObjectId;
} & {
  children: CommentResponse[];
  voteStatus: "up" | "down" | "none";
};

function getChildCommentsRecursively(
  id: string,
  allComments: CommentResponse[]
) {
  const children = allComments.filter((c) => String(c.parentCommentId) == id);

  for (const child of children) {
    child.children = getChildCommentsRecursively(child._id, allComments);
  }

  return children;
}

// Get comments in a nested structure.
// Recursion limits and paging are omitted from this implementation.
postRoutes.get("/:postId/comments", async (req: Request<AuthUser>, res) => {
  try {
    const allComments = (
      await Comment.find({ post: req.params.postId })
        .populate("author", "username")
        .lean()
    ).map<CommentResponse>((c) => ({
      ...c,
      children: [],
      voteStatus: c.voteIds[req.auth!.id],
    }));

    // Get top level comments
    const nestedComments = allComments.filter(
      (c) => c.parentCommentId === null
    );

    // Populate children
    for (const comment of nestedComments) {
      comment.children = getChildCommentsRecursively(comment._id, allComments);
    }

    res.status(200).json(nestedComments);
  } catch (err) {
    res.status(500).json({ error: getErrorMessage(err) });
  }
});

// Add a comment to a post
postRoutes.post("/:postId/comments", async (req: Request<AuthUser>, res) => {
  const { content, parentCommentId } = req.body;

  if (!content) {
    return res.status(400).json({ error: "content is required" });
  }

  const comment = new Comment({
    content,
    post: req.params.postId,
    parentCommentId: parentCommentId || null,
    author: req.auth!.id,
  });

  try {
    const savedComment = await comment.save();
    res.status(201).json(savedComment);
  } catch (error) {
    res.status(500).json({ error: "Error saving the comment" });
  }
});

// Vote on a post's comment up or down
postRoutes.post(
  "/:postId/comment/:commentId/vote",
  async (req: Request<AuthUser>, res) => {
    const userId = req.auth!.id;
    const commentId = req.params.commentId;
    const voteDirection = req.body.type as VoteDirection;

    if (!voteDirection) {
      return res.status(400).json({
        message: "Missing one or more required fields: type",
      });
    }

    try {
      const comment = await Comment.findById(commentId);

      if (!comment) {
        return res.status(404).json({ message: "Post not found" });
      }

      const currentDirection = comment.voteIds.get(userId) as VoteDirection;
      const scoreDiff = getScoreChange(voteDirection, currentDirection);
      comment.votes += scoreDiff;

      if (voteDirection === currentDirection) {
        comment.voteIds.delete(userId);
      } else {
        comment.voteIds.set(userId, voteDirection);
      }

      comment.markModified("voteIds");
      await comment.save();
      res.status(200).json(comment);
    } catch (error) {
      res.status(500).json({ message: getErrorMessage(error) });
    }
  }
);
