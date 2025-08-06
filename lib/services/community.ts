import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface Post {
  _id: string;
  title: string;
  content: string;
  author: {
    _id: string;
    name: string;
    avatar?: string;
  };
  imageUrl?: string;
  tags: string[];
  likes: string[];
  comments: Comment[];
  createdAt: string;
}

export interface Comment {
  _id: string;
  content: string;
  author: {
    _id: string;
    name: string;
    avatar?: string;
  };
  likes: string[];
  createdAt: string;
}

export const communityService = {
  // Posts
  getPosts: async (page = 1, limit = 10): Promise<{ posts: Post[]; total: number; totalPages: number }> => {
    const token = localStorage.getItem('fitness_buddy_token');
    const response = await axios.get(`${API_URL}/api/community?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  getPost: async (id: string): Promise<Post> => {
    const token = localStorage.getItem('fitness_buddy_token');
    const response = await axios.get(`${API_URL}/api/community/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  createPost: async (data: { title: string; content: string; imageUrl?: string; tags?: string[] }): Promise<Post> => {
    const token = localStorage.getItem('fitness_buddy_token');
    const response = await axios.post(`${API_URL}/api/community`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  updatePost: async (id: string, data: { title: string; content: string; imageUrl?: string; tags?: string[] }): Promise<Post> => {
    const token = localStorage.getItem('fitness_buddy_token');
    const response = await axios.put(`${API_URL}/api/community/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  deletePost: async (id: string): Promise<void> => {
    const token = localStorage.getItem('fitness_buddy_token');
    await axios.delete(`${API_URL}/api/community/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Comments
  addComment: async (postId: string, content: string): Promise<Comment> => {
    const token = localStorage.getItem('fitness_buddy_token');
    const response = await axios.post(`${API_URL}/api/community/${postId}/comments`, { content }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  updateComment: async (postId: string, commentId: string, content: string): Promise<Comment> => {
    const token = localStorage.getItem('fitness_buddy_token');
    const response = await axios.put(`${API_URL}/api/community/${postId}/comments/${commentId}`, { content }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  deleteComment: async (postId: string, commentId: string): Promise<void> => {
    const token = localStorage.getItem('fitness_buddy_token');
    await axios.delete(`${API_URL}/api/community/${postId}/comments/${commentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Likes
  togglePostLike: async (postId: string): Promise<{ likes: string[] }> => {
    const token = localStorage.getItem('fitness_buddy_token');
    const response = await axios.post(`${API_URL}/api/community/${postId}/like`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  toggleCommentLike: async (postId: string, commentId: string): Promise<{ likes: string[] }> => {
    const token = localStorage.getItem('fitness_buddy_token');
    const response = await axios.post(`${API_URL}/api/community/${postId}/comments/${commentId}/like`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};
