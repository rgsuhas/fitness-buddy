import { Request, Response } from 'express';
import { Types } from 'mongoose';
import Message from '../models/Message';
import { ApiError } from '../utils/errorHandler';

// Get all conversations for the current user
export const getConversations = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const userId = req.user._id;

    // Get all messages where the user is either the sender or receiver
    const messages = await Message.find({
      $or: [
        { sender: userId },
        { receiver: userId }
      ]
    })
      .sort({ timestamp: -1 })
      .populate('sender', 'name avatar')
      .populate('receiver', 'name avatar');

    // Group messages by conversation (unique sender-receiver pairs)
    const conversations = messages.reduce((acc, message) => {
      const senderIdStr = message.sender._id.toString();
      const receiverIdStr = message.receiver._id.toString();
      const userIdStr = userId.toString();
      
      // Determine if the current user is the sender or receiver
      const isUserSender = senderIdStr === userIdStr;
      
      // Get the other user in the conversation
      const otherUser = isUserSender ? message.receiver : message.sender;
      const otherUserId = otherUser._id.toString();
      
      // Only add this conversation if we haven't seen it before
      if (!acc[otherUserId]) {
        // Get the populated user fields
        const populatedUser = otherUser as any; // Type assertion to access populated fields
        
        acc[otherUserId] = {
          user: {
            id: otherUserId,
            name: populatedUser.name,
            avatar: populatedUser.avatar
          },
          lastMessage: {
            content: message.content,
            timestamp: message.timestamp,
            unread: !message.read && receiverIdStr === userIdStr
          }
        };
      }
      
      return acc;
    }, {} as Record<string, any>);

    res.json(Object.values(conversations));
  } catch (error) {
    console.error('Error getting conversations:', error);
    res.status(500).json({ message: 'Error getting conversations' });
  }
};

// Get messages between current user and another user
export const getMessages = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const userId = req.user._id;
    const otherUserId = req.params.userId;

    // Validate otherUserId
    if (!Types.ObjectId.isValid(otherUserId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Get all messages between the two users
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId }
      ]
    })
      .sort({ timestamp: 1 })
      .populate('sender', 'name avatar')
      .populate('receiver', 'name avatar');

    // Mark unread messages as read
    await Message.updateMany(
      { sender: otherUserId, receiver: userId, read: false },
      { read: true }
    );

    res.json(messages);
  } catch (error) {
    console.error('Error getting messages:', error);
    res.status(500).json({ message: 'Error getting messages' });
  }
};

// Send a message
export const sendMessage = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { receiverId, content } = req.body;

    // Validate receiverId
    if (!Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ message: 'Invalid receiver ID' });
    }

    // Create and save the message
    const message = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      content,
      timestamp: new Date(),
      read: false
    });

    // Populate sender and receiver
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name avatar')
      .populate('receiver', 'name avatar');

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Error sending message' });
  }
};

// Mark messages as read
export const markAsRead = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const userId = req.user._id;
    const senderId = req.params.userId;

    // Validate senderId
    if (!Types.ObjectId.isValid(senderId)) {
      return res.status(400).json({ message: 'Invalid sender ID' });
    }

    // Mark all messages from sender to user as read
    await Message.updateMany(
      { sender: senderId, receiver: userId, read: false },
      { read: true }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ message: 'Error marking messages as read' });
  }
};
