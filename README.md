# FitnessBuddy

FitnessBuddy is a comprehensive social fitness application designed to help users achieve their fitness goals through personalized workout plans, progress tracking, community engagement, and social features. The app provides a complete fitness ecosystem with secure authentication, customizable workouts, interactive progress visualization, and a vibrant community to keep you motivated.

<p align="center">
  <img src="public/images/logo.png" alt="FitnessBuddy Logo" width="200"/>
</p>

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [Database](#database)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [Roadmap](#roadmap)
- [License](#license)

## Overview

FitnessBuddy is built as a modern web application with a focus on user experience, performance, and scalability. The application uses a Next.js frontend with a MongoDB database, providing a seamless fitness management experience across devices.

**Live Demo:** [https://fitness-buddy-demo.vercel.app](https://fitness-buddy-demo.vercel.app) (Coming Soon)

## Features

### User Management
- **Authentication**: Secure email/password login and registration
- **User Profiles**: Customizable profiles with fitness goals, activity levels, and preferences
- **Social Authentication**: Google OAuth integration (in progress)

### Workout Management
- **My Workouts**: Create, view, and manage personalized workout routines
- **Exercise Library**: Browse and add exercises with detailed instructions
- **AI Workout Plans**: Get personalized workout recommendations based on your goals

### Progress Tracking
- **Dashboard**: Visual representation of your fitness journey
- **Calendar**: Schedule workouts and track your activity
- **Charts**: Monitor progress with interactive data visualization

### Community Features
- **Community Posts**: Share your fitness journey and interact with others
- **Messaging**: Real-time chat with other fitness enthusiasts
- **Challenges**: Participate in community fitness challenges

### Additional Features
- **Nutrition Tracking**: Log meals and track nutritional intake
- **Mindfulness**: Access guided meditation and breathing exercises
- **Wearables Integration**: Connect with fitness devices and apps
- **Dark Mode**: Toggle between light and dark themes

## Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Context API
- **Charts**: Recharts for data visualization

### Backend
- **API Routes**: Next.js API routes
- **Authentication**: JWT-based authentication
- **Database**: MongoDB with MongoDB Atlas
- **Real-time**: WebSockets for messaging

### DevOps
- **Deployment**: Vercel
- **Version Control**: Git and GitHub
- **CI/CD**: GitHub Actions

## Project Structure

```plaintext
fitness-buddy/
├── frontend/                # Next.js application
│   ├── app/                 # Application pages and API routes
│   │   ├── api/             # Backend API endpoints
│   │   │   ├── auth/        # Authentication endpoints
│   │   │   ├── community/   # Community post endpoints
│   │   │   ├── messages/    # Messaging endpoints
│   │   │   ├── seed/        # Database seeding
│   │   │   └── ...
│   │   ├── auth/            # Authentication pages
│   │   ├── dashboard/       # User dashboard
│   │   ├── my-workouts/     # Workout management
│   │   ├── messages/        # Messaging interface
│   │   └── ...
│   ├── components/          # Reusable UI components
│   │   ├── ui/              # Base UI components
│   │   └── ...              # Feature-specific components
│   ├── lib/                 # Utility functions and hooks
│   │   ├── db/              # Database connection
│   │   ├── hooks/           # Custom React hooks
│   │   └── ...
│   ├── public/              # Static assets
│   └── ...
├── backend/                 # Express.js server (optional)
│   ├── dist/                # Compiled JavaScript
│   ├── src/                 # Source TypeScript files
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   └── ...
│   └── ...
└── docs/                    # Detailed documentation
    ├── api.md               # API documentation
    ├── authentication.md    # Authentication flows
    ├── database.md          # Database schema
    └── ...
```

## Installation

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- MongoDB (local or Atlas)
- Git

### Clone the Repository

```bash
git clone https://github.com/rgsuhas/fitness-buddy.git
cd fitness-buddy
```

## Environment Setup

1. **Frontend Environment Variables**

Create a `.env.local` file in the `frontend` directory with the following variables:

```
# MongoDB
MONGODB_URI=mongodb://localhost:27017/fitness-buddy

# Authentication
JWT_SECRET=your_jwt_secret_here
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

2. **Backend Environment Variables (if using separate backend)**

Create a `.env` file in the `backend` directory with similar variables.

## Running the Application

### Frontend Development Server

```bash
cd frontend
npm install
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Backend Development Server (if applicable)

```bash
cd backend
npm install
npm run dev
```

The backend server will run on [http://localhost:5000](http://localhost:5000).

### Database Seeding

To populate the database with sample data:

```bash
# In browser, visit:
http://localhost:3000/api/seed
```

This will create sample users, workouts, community posts, and messages.

## API Documentation

For detailed API documentation, see [docs/api.md](docs/api.md)

### Core API Endpoints

#### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/verify` - Verify authentication token

#### Community
- `GET /api/community` - Get all posts with pagination
- `POST /api/community` - Create a new post
- `GET /api/community/:id` - Get a single post
- `PUT /api/community/:id` - Update a post
- `DELETE /api/community/:id` - Delete a post

#### Messages
- `GET /api/messages/conversations` - Get user conversations
- `GET /api/messages/:id` - Get messages for a conversation
- `POST /api/messages` - Send a new message

#### Workouts
- `GET /api/workouts` - Get all workouts
- `POST /api/workouts` - Create a new workout
- `GET /api/workouts/:id` - Get a specific workout
- `PUT /api/workouts/:id` - Update a workout
- `DELETE /api/workouts/:id` - Delete a workout

## Authentication

FitnessBuddy uses JWT-based authentication. For detailed information about authentication flows and implementation, see [docs/authentication.md](docs/authentication.md).

### Test Account

For testing purposes, you can use:
- Email: `johndoe@gmail.com`
- Password: `password123`

## Database

FitnessBuddy uses MongoDB as its primary database. The schema includes collections for users, workouts, posts, conversations, and messages.

For detailed database schema information, see [docs/database.md](docs/database.md).

## Contributing

We welcome contributions to FitnessBuddy! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

For more details, see [docs/contributing.md](docs/contributing.md).

## Troubleshooting

### Common Issues

1. **Authentication Issues**
   - Ensure MongoDB is running and accessible
   - Check that environment variables are set correctly
   - Verify user credentials in the database

2. **API Errors**
   - Check server logs for detailed error messages
   - Verify API endpoint URLs and request formats
   - Ensure authentication tokens are valid

3. **UI Issues**
   - Clear browser cache and reload
   - Check console for JavaScript errors
   - Verify that all required dependencies are installed

For more troubleshooting information, see [docs/troubleshooting.md](docs/troubleshooting.md).

## Roadmap

### Current Status (April 2025)

- ✅ Authentication system with email/password
- ✅ Community posts and interaction
- ✅ Messaging system with real-time updates
- ✅ My Workouts feature
- ✅ Dashboard with progress visualization
- ✅ Calendar for workout scheduling
- ✅ Nutrition calculator and tracking
- ✅ Mindfulness features
- ✅ Dark mode support

### Upcoming Features

- 🔄 Google OAuth integration
- 🔄 Wearables data synchronization
- 🔄 Mobile app development
- 🔄 Advanced analytics and reporting
- 🔄 AI-powered workout recommendations

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

© 2025 FitnessBuddy. All rights reserved.
