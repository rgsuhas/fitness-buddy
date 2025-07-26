import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL + '/api/messages';

export interface Conversation {
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  lastMessage: {
    content: string;
    timestamp: string;
    unread: boolean;
  };
}

export interface Message {
  _id: string;
  content: string;
  timestamp: string;
  sender: {
    _id: string;
    name: string;
    avatar: string;
  };
  receiver: {
    _id: string;
    name: string;
    avatar: string;
  };
  read: boolean;
}

// Get all conversations for the current user
export const getConversations = async (): Promise<Conversation[]> => {
  try {
    const response = await axios.get(`${API_URL}/conversations`);
    return response.data;
  } catch (error) {
    console.error('Error fetching conversations:', error);
    throw error;
  }
};

// Get messages between current user and another user
export const getMessages = async (userId: string): Promise<Message[]> => {
  try {
    const response = await axios.get(`${API_URL}/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

// Send a message
export const sendMessage = async (receiverId: string, content: string): Promise<Message> => {
  try {
    const response = await axios.post(API_URL, { receiverId, content });
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// Mark messages as read
export const markAsRead = async (userId: string): Promise<void> => {
  try {
    await axios.put(`${API_URL}/${userId}/read`);
  } catch (error) {
    console.error('Error marking messages as read:', error);
    throw error;
  }
};
