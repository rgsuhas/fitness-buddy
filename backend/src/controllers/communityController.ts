import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { AuthRequest } from '../types/auth';
import Post from '../models/Post';
import { ApiError } from '../utils/errorHandler';

// Get all posts with pagination
export const getPosts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'name avatar')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'name avatar'
        }
      });

    const total = await Post.countDocuments();

    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts' });
  }
};

// Get single post
export const getPost = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name avatar')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'name avatar'
        }
      });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching post' });
  }
};

// Create post
export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { title, content, imageUrl, tags } = req.body;
    const post = await Post.create({
      title,
      content,
      imageUrl,
      tags,
      author: req.user._id
    });

    const populatedPost = await post.populate('author', 'name avatar');
    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Error creating post' });
  }
};

// Update post
export const updatePost = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { title, content, imageUrl, tags } = req.body;
    post.title = title;
    post.content = content;
    post.imageUrl = imageUrl;
    post.tags = tags;

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error updating post' });
  }
};

// Delete post
export const deletePost = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post' });
  }
};

// Add comment
export const addComment = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = {
      content: req.body.content,
      author: req.user._id
    };

    post.comments.push(comment);
    await post.save();

    const populatedPost = await post.populate({
      path: 'comments.author',
      select: 'name avatar'
    });

    res.json(populatedPost.comments[populatedPost.comments.length - 1]);
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment' });
  }
};

// Update comment
export const updateComment = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    comment.content = req.body.content;
    await post.save();
    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Error updating comment' });
  }
};

// Delete comment
export const deleteComment = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    comment.deleteOne();
    await post.save();
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting comment' });
  }
};

// Toggle post like
export const toggleLike = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const userId = req.user._id.toString();
    const index = post.likes.findIndex(id => id.toString() === userId);
    
    if (index === -1) {
      post.likes.push(new Types.ObjectId(userId));
    } else {
      post.likes.splice(index, 1);
    }

    await post.save();
    res.json({ likes: post.likes });
  } catch (error) {
    res.status(500).json({ message: 'Error toggling like' });
  }
};

// Toggle comment like
export const toggleCommentLike = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const userId = req.user._id.toString();
    const index = comment.likes.findIndex(id => id.toString() === userId);

    if (index === -1) {
      comment.likes.push(new Types.ObjectId(userId));
    } else {
      comment.likes.splice(index, 1);
    }

    await post.save();
    res.json({ likes: comment.likes });
  } catch (error) {
    res.status(500).json({ message: 'Error toggling comment like' });
  }
};
