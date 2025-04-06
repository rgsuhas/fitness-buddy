import { Router } from 'express';
import { getConversations, getMessages, sendMessage, markAsRead } from '../controllers/messageController';
import { auth } from '../middleware/auth';

const router = Router();

// Get all conversations for the current user
router.get('/conversations', auth, getConversations);

// Get messages between current user and another user
router.get('/:userId', auth, getMessages);

// Send a message
router.post('/', auth, sendMessage);

// Mark messages as read
router.put('/:userId/read', auth, markAsRead);

export default router;
