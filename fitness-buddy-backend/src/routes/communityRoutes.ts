import express from 'express';
import { protect } from '../middleware/auth.middleware';
import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  addComment,
  updateComment,
  deleteComment,
  toggleLike,
  toggleCommentLike
} from '../controllers/communityController';

const router = express.Router();

// Post routes
router.route('/')
  .get(getPosts)
  .post(protect, createPost);

router.route('/:id')
  .get(getPost)
  .put(protect, updatePost)
  .delete(protect, deletePost);

// Comment routes
router.route('/:id/comments')
  .post(protect, addComment);

router.route('/:id/comments/:commentId')
  .put(protect, updateComment)
  .delete(protect, deleteComment);

// Like routes
router.route('/:id/like')
  .post(protect, toggleLike);

router.route('/:id/comments/:commentId/like')
  .post(protect, toggleCommentLike);

export default router;
