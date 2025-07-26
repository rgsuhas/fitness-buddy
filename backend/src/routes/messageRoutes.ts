import { Router } from 'express';
import { getConversations, getMessages, sendMessage, markAsRead } from '../controllers/messageController';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// Get all conversations for the current user
router.get('/conversations', protect, getConversations);

// Get messages between current user and another user
router.get('/:userId', protect, getMessages);

// Send a message
router.post('/', protect, sendMessage);

// Mark messages as read
router.put('/:userId/read', protect, markAsRead);

export default router;