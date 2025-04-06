# FitnessBuddy API Documentation

This document provides detailed information about the FitnessBuddy API endpoints, request/response formats, and authentication requirements.

## Table of Contents

- [Authentication](#authentication)
- [Users](#users)
- [Workouts](#workouts)
- [Community](#community)
- [Messages](#messages)
- [Nutrition](#nutrition)
- [Wearables](#wearables)
- [Error Handling](#error-handling)

## Authentication

All protected endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

### Endpoints

#### Register a New User

```
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "johndoe@gmail.com",
  "password": "password123"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "67f26565743a8bb3b1d0518c",
    "name": "John Doe",
    "email": "johndoe@gmail.com"
  }
}
```

#### Login

```
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "johndoe@gmail.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "67f26565743a8bb3b1d0518c",
    "name": "John Doe",
    "email": "johndoe@gmail.com"
  }
}
```

## Users

### Endpoints

#### Get Current User

```
GET /api/users/me
```

**Response (200 OK):**
```json
{
  "id": "67f26565743a8bb3b1d0518c",
  "name": "John Doe",
  "email": "johndoe@gmail.com",
  "profilePicture": "https://example.com/profile.jpg",
  "fitnessGoals": ["Weight Loss", "Muscle Gain"],
  "activityLevel": "Intermediate",
  "createdAt": "2025-01-15T12:00:00Z"
}
```

#### Update User Profile

```
PUT /api/users/me
```

**Request Body:**
```json
{
  "name": "John Doe",
  "profilePicture": "https://example.com/new-profile.jpg",
  "fitnessGoals": ["Weight Loss", "Muscle Gain", "Flexibility"],
  "activityLevel": "Advanced"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "67f26565743a8bb3b1d0518c",
    "name": "John Doe",
    "email": "johndoe@gmail.com",
    "profilePicture": "https://example.com/new-profile.jpg",
    "fitnessGoals": ["Weight Loss", "Muscle Gain", "Flexibility"],
    "activityLevel": "Advanced"
  }
}
```

## Workouts

### Endpoints

#### Get All Workouts

```
GET /api/workouts
```

**Query Parameters:**
- `type` (optional): Filter by workout type (strength, cardio, flexibility, HIIT)
- `limit` (optional): Number of workouts to return (default: 10)
- `page` (optional): Page number for pagination (default: 1)

**Response (200 OK):**
```json
{
  "workouts": [
    {
      "id": "workout123",
      "title": "Full Body Strength",
      "type": "strength",
      "description": "Complete full body workout targeting all major muscle groups",
      "exercises": [
        {
          "name": "Squats",
          "sets": 3,
          "reps": 12,
          "weight": 50
        },
        {
          "name": "Push-ups",
          "sets": 3,
          "reps": 15,
          "weight": 0
        }
      ],
      "createdAt": "2025-03-15T10:30:00Z",
      "createdBy": "67f26565743a8bb3b1d0518c"
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "pages": 3
  }
}
```

#### Create a New Workout

```
POST /api/workouts
```

**Request Body:**
```json
{
  "title": "HIIT Cardio Blast",
  "type": "HIIT",
  "description": "High-intensity interval training for maximum calorie burn",
  "exercises": [
    {
      "name": "Burpees",
      "sets": 4,
      "reps": 15,
      "weight": 0
    },
    {
      "name": "Mountain Climbers",
      "sets": 4,
      "reps": 30,
      "weight": 0
    }
  ]
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Workout created successfully",
  "workout": {
    "id": "workout456",
    "title": "HIIT Cardio Blast",
    "type": "HIIT",
    "description": "High-intensity interval training for maximum calorie burn",
    "exercises": [
      {
        "name": "Burpees",
        "sets": 4,
        "reps": 15,
        "weight": 0
      },
      {
        "name": "Mountain Climbers",
        "sets": 4,
        "reps": 30,
        "weight": 0
      }
    ],
    "createdAt": "2025-04-06T13:45:00Z",
    "createdBy": "67f26565743a8bb3b1d0518c"
  }
}
```

#### Get a Specific Workout

```
GET /api/workouts/:id
```

**Response (200 OK):**
```json
{
  "id": "workout456",
  "title": "HIIT Cardio Blast",
  "type": "HIIT",
  "description": "High-intensity interval training for maximum calorie burn",
  "exercises": [
    {
      "name": "Burpees",
      "sets": 4,
      "reps": 15,
      "weight": 0
    },
    {
      "name": "Mountain Climbers",
      "sets": 4,
      "reps": 30,
      "weight": 0
    }
  ],
  "createdAt": "2025-04-06T13:45:00Z",
  "createdBy": {
    "id": "67f26565743a8bb3b1d0518c",
    "name": "John Doe"
  }
}
```

#### Update a Workout

```
PUT /api/workouts/:id
```

**Request Body:**
```json
{
  "title": "HIIT Cardio Blast - Updated",
  "exercises": [
    {
      "name": "Burpees",
      "sets": 5,
      "reps": 15,
      "weight": 0
    },
    {
      "name": "Mountain Climbers",
      "sets": 5,
      "reps": 30,
      "weight": 0
    },
    {
      "name": "Jump Squats",
      "sets": 4,
      "reps": 20,
      "weight": 0
    }
  ]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Workout updated successfully",
  "workout": {
    "id": "workout456",
    "title": "HIIT Cardio Blast - Updated",
    "type": "HIIT",
    "description": "High-intensity interval training for maximum calorie burn",
    "exercises": [
      {
        "name": "Burpees",
        "sets": 5,
        "reps": 15,
        "weight": 0
      },
      {
        "name": "Mountain Climbers",
        "sets": 5,
        "reps": 30,
        "weight": 0
      },
      {
        "name": "Jump Squats",
        "sets": 4,
        "reps": 20,
        "weight": 0
      }
    ],
    "createdAt": "2025-04-06T13:45:00Z",
    "updatedAt": "2025-04-06T14:30:00Z",
    "createdBy": "67f26565743a8bb3b1d0518c"
  }
}
```

#### Delete a Workout

```
DELETE /api/workouts/:id
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Workout deleted successfully"
}
```

## Community

### Endpoints

#### Get All Posts

```
GET /api/community
```

**Query Parameters:**
- `limit` (optional): Number of posts to return (default: 10)
- `page` (optional): Page number for pagination (default: 1)

**Response (200 OK):**
```json
{
  "posts": [
    {
      "id": "post123",
      "content": "Just completed my first 5K run!",
      "media": ["https://example.com/run.jpg"],
      "likes": 15,
      "comments": 5,
      "createdAt": "2025-04-05T09:30:00Z",
      "author": {
        "id": "67f26565743a8bb3b1d0518c",
        "name": "John Doe",
        "profilePicture": "https://example.com/profile.jpg"
      }
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 10,
    "pages": 5
  }
}
```

#### Create a New Post

```
POST /api/community
```

**Request Body:**
```json
{
  "content": "Just hit a new personal record on deadlifts! 💪",
  "media": ["https://example.com/deadlift.jpg"]
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Post created successfully",
  "post": {
    "id": "post456",
    "content": "Just hit a new personal record on deadlifts! 💪",
    "media": ["https://example.com/deadlift.jpg"],
    "likes": 0,
    "comments": 0,
    "createdAt": "2025-04-06T15:00:00Z",
    "author": {
      "id": "67f26565743a8bb3b1d0518c",
      "name": "John Doe",
      "profilePicture": "https://example.com/profile.jpg"
    }
  }
}
```

## Messages

### Endpoints

#### Get User Conversations

```
GET /api/messages/conversations
```

**Query Parameters:**
- `userId` (required): ID of the current user

**Response (200 OK):**
```json
{
  "conversations": [
    {
      "id": "conv123",
      "participants": [
        {
          "id": "67f26565743a8bb3b1d0518c",
          "name": "John Doe",
          "profilePicture": "https://example.com/profile.jpg"
        },
        {
          "id": "user456",
          "name": "Jane Smith",
          "profilePicture": "https://example.com/jane.jpg"
        }
      ],
      "lastMessage": {
        "content": "Are you going to the gym today?",
        "sender": "user456",
        "timestamp": "2025-04-06T14:30:00Z",
        "read": false
      },
      "unreadCount": 1
    }
  ]
}
```

#### Get Messages for a Conversation

```
GET /api/messages/:conversationId
```

**Response (200 OK):**
```json
{
  "messages": [
    {
      "id": "msg123",
      "content": "Hey, how's your training going?",
      "sender": {
        "id": "67f26565743a8bb3b1d0518c",
        "name": "John Doe"
      },
      "timestamp": "2025-04-06T14:15:00Z",
      "read": true
    },
    {
      "id": "msg124",
      "content": "Are you going to the gym today?",
      "sender": {
        "id": "user456",
        "name": "Jane Smith"
      },
      "timestamp": "2025-04-06T14:30:00Z",
      "read": false
    }
  ],
  "conversation": {
    "id": "conv123",
    "participants": [
      {
        "id": "67f26565743a8bb3b1d0518c",
        "name": "John Doe",
        "profilePicture": "https://example.com/profile.jpg"
      },
      {
        "id": "user456",
        "name": "Jane Smith",
        "profilePicture": "https://example.com/jane.jpg"
      }
    ]
  }
}
```

#### Send a New Message

```
POST /api/messages
```

**Request Body:**
```json
{
  "conversationId": "conv123",
  "content": "Yes, I'll be there at 6 PM. Want to join?",
  "sender": "67f26565743a8bb3b1d0518c"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": {
    "id": "msg125",
    "content": "Yes, I'll be there at 6 PM. Want to join?",
    "sender": {
      "id": "67f26565743a8bb3b1d0518c",
      "name": "John Doe"
    },
    "timestamp": "2025-04-06T15:10:00Z",
    "read": false
  }
}
```

## Error Handling

All API endpoints follow a consistent error response format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {} // Optional additional error details
  }
}
```

### Common Error Codes

- `AUTHENTICATION_ERROR`: Invalid or missing authentication token
- `AUTHORIZATION_ERROR`: User does not have permission to perform the action
- `VALIDATION_ERROR`: Invalid request parameters or body
- `RESOURCE_NOT_FOUND`: Requested resource does not exist
- `INTERNAL_SERVER_ERROR`: Unexpected server error

## Rate Limiting

API requests are subject to rate limiting to prevent abuse. The current limits are:

- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users

When rate limited, the API will respond with a 429 Too Many Requests status code and the following response:

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests, please try again later",
    "details": {
      "retryAfter": 60 // Seconds until the rate limit resets
    }
  }
}
```
