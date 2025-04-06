# FitnessBuddy Authentication Documentation

This document provides detailed information about the authentication system implemented in FitnessBuddy, including flows, security considerations, and implementation details.

## Table of Contents

- [Overview](#overview)
- [Authentication Flows](#authentication-flows)
- [JWT Implementation](#jwt-implementation)
- [Security Considerations](#security-considerations)
- [Social Authentication](#social-authentication)
- [Testing Authentication](#testing-authentication)
- [Troubleshooting](#troubleshooting)

## Overview

FitnessBuddy uses a JWT (JSON Web Token) based authentication system. When a user logs in, the server validates their credentials and issues a JWT token that is used for subsequent authenticated requests. The token contains encoded user information and is signed to prevent tampering.

## Authentication Flows

### Registration Flow

1. User submits registration form with name, email, and password
2. Server validates the input data
3. Server checks if the email is already registered
4. If not, the password is hashed using bcrypt
5. User record is created in the database
6. A JWT token is generated and returned to the client
7. Client stores the token in localStorage or a secure cookie

### Login Flow

1. User submits login form with email and password
2. Server validates the input data
3. Server retrieves the user record by email
4. Server compares the provided password with the stored hash
5. If matched, a JWT token is generated and returned to the client
6. Client stores the token in localStorage or a secure cookie

### Authentication Middleware

All protected routes use an authentication middleware that:

1. Extracts the JWT token from the Authorization header
2. Verifies the token's signature using the secret key
3. Decodes the token to get the user ID
4. Retrieves the user from the database
5. Attaches the user object to the request for use in route handlers

## JWT Implementation

### Token Structure

The JWT token consists of three parts:

1. **Header**: Specifies the token type and hashing algorithm
   ```json
   {
     "alg": "HS256",
     "typ": "JWT"
   }
   ```

2. **Payload**: Contains the claims (user data and metadata)
   ```json
   {
     "userId": "67f26565743a8bb3b1d0518c",
     "email": "johndoe@gmail.com",
     "role": "user",
     "iat": 1617704889,
     "exp": 1617791289
   }
   ```

3. **Signature**: Ensures the token hasn't been tampered with
   ```
   HMACSHA256(
     base64UrlEncode(header) + "." + base64UrlEncode(payload),
     secret
   )
   ```

### Token Expiration

Tokens are configured to expire after 24 hours. After expiration, the client must request a new token by logging in again.

### Token Storage

Tokens should be stored securely:
- For web clients: Use HttpOnly cookies or localStorage
- For mobile clients: Use secure storage mechanisms provided by the platform

## Security Considerations

### Password Hashing

Passwords are hashed using bcrypt with a work factor of 10. This provides a good balance between security and performance.

```typescript
import bcrypt from 'bcrypt';

// Hashing a password
const hashedPassword = await bcrypt.hash(password, 10);

// Comparing a password
const isMatch = await bcrypt.compare(password, hashedPassword);
```

### HTTPS

All API endpoints should be accessed over HTTPS to prevent man-in-the-middle attacks and token theft.

### CORS Configuration

The API has CORS configured to only allow requests from trusted origins:

```typescript
// Example CORS configuration
app.use(cors({
  origin: ['https://fitness-buddy.com', 'http://localhost:3000'],
  credentials: true
}));
```

### Rate Limiting

To prevent brute force attacks, login and registration endpoints are rate-limited:

```typescript
// Example rate limiting configuration
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per IP
  message: 'Too many login attempts, please try again later'
});

app.use('/api/auth/login', loginLimiter);
```

## Social Authentication

### Google OAuth

FitnessBuddy supports authentication via Google OAuth. The implementation uses the following flow:

1. Client initiates Google OAuth flow using Google Sign-In button
2. After successful Google authentication, client receives an ID token
3. Client sends the ID token to the server
4. Server verifies the token with Google's OAuth API
5. If verified, server checks if the user exists in the database
6. If not, a new user record is created
7. Server issues a JWT token and returns it to the client

### Configuration

To enable Google OAuth, set the following environment variables:

```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## Testing Authentication

### Test Account

For testing purposes, you can use:
- Email: `johndoe@gmail.com`
- Password: `password123`

### Testing with Postman

1. Create a new request to `/api/auth/login`
2. Set the method to POST
3. Add a JSON body with email and password
4. Send the request
5. Copy the token from the response
6. For subsequent requests, add an Authorization header:
   ```
   Authorization: Bearer <token>
   ```

### Testing with Jest

Example test for the login endpoint:

```typescript
describe('Login Endpoint', () => {
  it('should return a token for valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'johndoe@gmail.com',
        password: 'password123'
      });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
  });

  it('should return 401 for invalid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'johndoe@gmail.com',
        password: 'wrongpassword'
      });
    
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });
});
```

## Troubleshooting

### Common Issues

#### "Invalid Token" Error

- Check that the token hasn't expired
- Verify that the token is being sent in the correct format
- Ensure the JWT_SECRET hasn't changed

#### "User Not Found" After Valid Token

- The user might have been deleted from the database
- Check for database connectivity issues

#### Password Mismatch

- The password might have been changed
- The password hashing algorithm might have been updated

### Debugging

For debugging authentication issues, enable detailed logging:

```typescript
// In your authentication middleware
console.log('Token received:', token);
try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log('Decoded token:', decoded);
  // ...
} catch (error) {
  console.error('Token verification failed:', error.message);
  // ...
}
```

## Implementation Details

### Auth Provider Component

The frontend uses an AuthProvider component to manage authentication state:

```tsx
// lib/auth-provider.tsx
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on page load
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserData(token);
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Login failed');
      }
      
      localStorage.setItem('token', data.token);
      setUser(data.user);
      return data.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

### Login API Route

```typescript
// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: { message: 'Email and password are required' } },
        { status: 400 }
      );
    }
    
    // Connect to database
    const db = await connectToDatabase();
    
    // Find user by email
    const user = await db.collection('users').findOne({ email });
    
    // Check if user exists
    if (!user) {
      return NextResponse.json(
        { error: { message: 'Invalid credentials' } },
        { status: 401 }
      );
    }
    
    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      console.log(`Password mismatch for user: ${email}`);
      return NextResponse.json(
        { error: { message: 'Invalid credentials' } },
        { status: 401 }
      );
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Return token and user data
    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: { message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
```
