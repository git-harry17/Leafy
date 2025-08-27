# README.md
# Blog Backend API

A scalable blog backend built with Express.js, MongoDB, and modern Node.js practices.

## Features

- 🔐 JWT Authentication with Google OAuth support
- 📝 CRUD operations for blog posts
- 👥 User management and profiles
- 🔍 Search functionality for blogs and users
- 🛡️ Security middleware (Helmet, Rate limiting)
- 📊 Analytics and activity tracking
- 🎯 Input validation and sanitization
- 📝 Comprehensive logging
- 🚀 Scalable architecture

## Project Structure

```
auth-server/
├── config/                 # Configuration & DB setup
│   ├── database.js         # DB connection with reconnection logic
│   └── env.js             # Environment variable validation
├── controllers/            # Route handler functions
│   ├── authController.js   # Authentication logic
│   ├── userController.js   # User profile management
│   ├── blogController.js   # Blog CRUD operations
│   └── healthController.js # Health check endpoints
├── middleware/            # Express middlewares
│   ├── auth.js            # JWT authentication
│   ├── security.js        # Security configurations
│   ├── validation.js      # Input validation schemas
│   └── errorHandler.js    # Global error handling
├── models/               # Database models (with classes)
│   ├── User.js           # User schema
│   ├── Blog.js           # Blog schema
│   ├── Comment.js        # Comment schema
│   └── Notification.js   # Notification schema
├── routes/               # Route definitions
│   ├── authRoutes.js     # Authentication routes
│   ├── userRoutes.js     # User routes
│   ├── blogRoutes.js     # Blog routes
│   └── healthRoutes.js   # Health check routes
├── services/             # Business logic
│   ├── authService.js    # Authentication services
│   ├── blogService.js    # Blog-related services
│   ├── emailService.js   # Email services (placeholder)
│   └── notificationService.js # Notification services
├── utils/                # Helper functions
│   ├── logger.js         # Winston logger configuration
│   ├── sanitizer.js      # Input sanitization
│   ├── dateUtils.js      # Date utility functions
│   └── validation.js     # Validation helpers
└── server.js             # Main application entry point
```

## Quick Start

1. **Clone and Install**
   ```bash
   git clone <repository>
   cd auth-server
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login user
- `POST /api/auth/google-auth` - Google OAuth login

### Users
- `GET /api/user/me` - Get current user profile
- `POST /api/user/profile` - Get user profile by username
- `POST /api/user/search` - Search users

### Blogs
- `GET /api/blog/latest` - Get latest blogs
- `GET /api/blog/trending` - Get trending blogs
- `POST /api/blog/create` - Create new blog
- `GET /api/blog/:blog_id` - Get specific blog
- `PUT /api/blog/:blog_id` - Update blog
- `DELETE /api/blog/:blog_id` - Delete blog
- `POST /api/blog/search` - Search blogs by tag

### Health
- `GET /api/health` - Health check
- `GET /api/ready` - Readiness probe

## Environment Variables

Required:
- `DB_LOCATION` - MongoDB connection string
- `SECRET_ACCESS_KEY` - JWT secret key

Optional:
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `FRONTEND_URL` - Frontend URL for CORS
- `FIREBASE_CONFIG` - Firebase service account for Google auth

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run build` - Run linting and tests

## Security Features

- JWT authentication with expiration
- Rate limiting on all endpoints
- Input validation and sanitization
- CORS configuration
- Security headers with Helmet
- Password hashing with bcrypt
- XSS protection

## Error Handling

The API uses a centralized error handling system with:
- Structured error responses
- Detailed logging
- Environment-specific error details
- Validation error formatting

## Logging

Winston-based logging with:
- File rotation
- Different log levels
- Structured JSON format
- Console output in development
