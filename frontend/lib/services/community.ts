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
    const response = await fetch(`${API_URL}/api/community?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch posts');
    return response.json();
  },

  getPost: async (id: string): Promise<Post> => {
    const token = localStorage.getItem('fitness_buddy_token');
    const response = await fetch(`${API_URL}/api/community/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch post');
    return response.json();
  },

  createPost: async (data: { title: string; content: string; imageUrl?: string; tags?: string[] }): Promise<Post> => {
    const token = localStorage.getItem('fitness_buddy_token');
    const response = await fetch(`${API_URL}/api/community`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create post');
    return response.json();
  },

  updatePost: async (id: string, data: { title: string; content: string; imageUrl?: string; tags?: string[] }): Promise<Post> => {
    const token = localStorage.getItem('fitness_buddy_token');
    const response = await fetch(`${API_URL}/api/community/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update post');
    return response.json();
  },

  deletePost: async (id: string): Promise<void> => {
    const token = localStorage.getItem('fitness_buddy_token');
    const response = await fetch(`${API_URL}/api/community/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to delete post');
  },

  // Comments
  addComment: async (postId: string, content: string): Promise<Comment> => {
    const token = localStorage.getItem('fitness_buddy_token');
    const response = await fetch(`${API_URL}/api/community/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });
    if (!response.ok) throw new Error('Failed to add comment');
    return response.json();
  },

  updateComment: async (postId: string, commentId: string, content: string): Promise<Comment> => {
    const token = localStorage.getItem('fitness_buddy_token');
    const response = await fetch(`${API_URL}/api/community/${postId}/comments/${commentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });
    if (!response.ok) throw new Error('Failed to update comment');
    return response.json();
  },

  deleteComment: async (postId: string, commentId: string): Promise<void> => {
    const token = localStorage.getItem('fitness_buddy_token');
    const response = await fetch(`${API_URL}/api/community/${postId}/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to delete comment');
  },

  // Likes
  togglePostLike: async (postId: string): Promise<{ likes: string[] }> => {
    const token = localStorage.getItem('fitness_buddy_token');
    const response = await fetch(`${API_URL}/api/community/${postId}/like`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to toggle like');
    return response.json();
  },

  toggleCommentLike: async (postId: string, commentId: string): Promise<{ likes: string[] }> => {
    const token = localStorage.getItem('fitness_buddy_token');
    const response = await fetch(`${API_URL}/api/community/${postId}/comments/${commentId}/like`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to toggle comment like');
    return response.json();
  },
};
