# Keuzekompas API - Testing Guide

## 🚀 Quick Start

1. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   ```

2. **Start the server:**
   ```bash
   npm run dev
   ```

3. **Verify server is running:**
   ```bash
   curl http://localhost:3000/health
   ```

## 📋 API Endpoints

### Base URL: `http://localhost:3000/api`

### 👤 User Endpoints

#### Register User
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "study": "Computer Science",
    "password": "password123",
    "role": 1
  }'
```

#### Login User
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

#### Get User (requires auth)
```bash
# Replace YOUR_JWT_TOKEN with the token from login response
# Replace USER_ID with the actual user ID
curl -X GET http://localhost:3000/api/users/USER_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Update User (requires auth)
```bash
curl -X PUT http://localhost:3000/api/users/USER_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name"
  }'
```

### 📚 Module Endpoints

#### List All Modules (public)
```bash
curl -X GET http://localhost:3000/api/modules
```

#### Get Module by ID (public)
```bash
curl -X GET http://localhost:3000/api/modules/MODULE_ID
```

#### Create Module (admin only, role >= 2)
```bash
# First create an admin user with role: 2
curl -X POST http://localhost:3000/api/modules \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Advanced Mathematics",
    "location": "Building A, Room 101",
    "period": 1,
    "provider": "University XYZ",
    "duration": 120,
    "language": "English",
    "level": "Advanced",
    "description": "Advanced mathematical concepts and applications",
    "information": "This course covers calculus, linear algebra, and statistical analysis"
  }'
```

## 🔐 Authentication Flow

1. **Register a new user** (role 1 = regular user, role 2+ = admin)
2. **Login to get JWT token**
3. **Include token in Authorization header** for protected endpoints:
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## 🗃️ Database Setup

Make sure MongoDB is running and accessible at the URI specified in your `.env` file.

Default connection: `mongodb://localhost:27017/keuzekompas`

## 📊 Response Format

All API responses follow this format:

### Success Response
```json
{
  "success": true,
  "data": { /* actual data */ },
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": ["Optional additional details"]
  }
}
```

## 🧪 Testing Tools

### Recommended tools:
- **Postman** - Import the endpoints above
- **Thunder Client** (VS Code extension)
- **Insomnia**
- **curl** (command line)

### Sample Test Flow:
1. Register user → Get user ID
2. Login user → Get JWT token
3. Test protected endpoints with token
4. Register admin user (role: 2) → Login → Test admin endpoints