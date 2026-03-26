# VistaFlow - Internal Workflow & Team Management Platform

A full-stack web application for managing internal teams, projects, and tasks with secure role-based access and hierarchical data organization.

## 🏗️ Architecture Overview

### Tech Stack

**Frontend:**
- React 18 + Vite
- Tailwind CSS (custom theme system)
- Zustand (state management)
- React Query (API management & caching)
- Framer Motion (animations)
- React Icons
- React Toastify (notifications)
- React Hook Form + Zod (validation)

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT (HttpOnly cookies)
- Socket.io (real-time updates)
- Zod (validation)
- Helmet (security)
- Express Rate Limit

### Database Choice: MongoDB

**Why MongoDB?**

1. **Hierarchical Data Structure**: The Projects → Sections → Tasks hierarchy maps naturally to MongoDB's document model with embedded references
2. **Flexible Schema**: Easy to evolve requirements without complex migrations
3. **Performance**: Excellent read performance for dashboard analytics and aggregations
4. **Scalability**: Horizontal scaling with sharding for future growth
5. **Developer Experience**: Mongoose provides excellent TypeScript-like schema validation

### Data Model

```
User
├── Projects (owner/member)
    ├── Sections
        └── Tasks (assigned to users)
```

**Key Indexes:**
- Text indexes on Project/Task names for search
- Compound indexes on (assignedTo, status) for task queries
- Single field indexes on foreign keys and status fields

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB 6+ (local or Atlas)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd vistaflow
```

2. **Install Frontend Dependencies**
```bash
npm install
```

3. **Install Backend Dependencies**
```bash
cd backend
npm install
```

4. **Configure Environment Variables**

Frontend (.env):
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=VistaFlow
VITE_SOCKET_URL=http://localhost:5000
```

Backend (backend/.env):
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vistaflow
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7
CLIENT_URL=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

5. **Start MongoDB**
```bash
# If using local MongoDB
mongod
```

6. **Start Backend Server**
```bash
cd backend
npm run dev
```

7. **Start Frontend Development Server**
```bash
# In root directory
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📁 Project Structure

```
vistaflow/
├── frontend/
│   ├── src/
│   │   ├── api/              # API client & services
│   │   ├── components/       # Reusable UI components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── layouts/          # Layout components
│   │   ├── pages/            # Page components
│   │   ├── store/            # Zustand stores
│   │   ├── theme/            # Theme configuration
│   │   └── utils/            # Utility functions
│   └── package.json
│
└── backend/
    ├── src/
    │   ├── config/           # Configuration files
    │   ├── controllers/      # Request handlers
    │   ├── models/           # Mongoose models
    │   ├── routes/           # API routes
    │   ├── middleware/       # Auth, validation, errors
    │   └── server.js         # Entry point
    └── package.json
```

## 🔐 Authentication & Authorization

- JWT tokens stored in HttpOnly cookies (secure)
- Three roles: Admin, Manager, Member
- Role-based route protection on both frontend and backend
- Automatic token refresh
- Secure password hashing with bcrypt

## 🎯 Core Features

### ✅ Implemented

1. **User Authentication**
   - Registration and login
   - JWT with HttpOnly cookies
   - Role-based access control (Admin, Manager, Member)
   - Protected routes

2. **Hierarchical Data Management**
   - Projects → Sections → Tasks (3-level hierarchy)
   - Full CRUD operations
   - Soft delete with activity tracking
   - Parent-child relationship integrity

3. **Role-Specific Dashboards**
   - Admin: System-wide statistics
   - Manager: Team overview and metrics
   - Member: Personal task list

4. **Search & Filter**
   - Global search across projects and tasks
   - Advanced filters (status, assignee, date range)
   - Text search with MongoDB indexes

5. **Data Export**
   - Export tasks to Excel/CSV
   - Filtered export support

6. **RESTful API**
   - 10+ endpoints
   - Proper validation with Zod
   - Error handling middleware
   - Rate limiting

### 🎁 Bonus Features

1. **Real-time Updates** - Socket.io for live task updates
2. **Soft Delete** - Activity log with deletedBy tracking
3. **Rate Limiting** - Protection against abuse
4. **Dark Mode** - Theme toggle with persistence
5. **Performance Optimization** - MongoDB indexing, React Query caching, memoization

## 🔑 API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user
- POST `/api/auth/logout` - Logout user

### Projects
- GET `/api/projects` - Get all projects
- GET `/api/projects/:id` - Get single project
- POST `/api/projects` - Create project (Admin/Manager)
- PUT `/api/projects/:id` - Update project (Admin/Manager)
- DELETE `/api/projects/:id` - Delete project (Admin/Manager)
- GET `/api/projects/search` - Search projects

### Tasks
- GET `/api/tasks` - Get all tasks
- GET `/api/tasks/my-tasks` - Get user's tasks
- GET `/api/tasks/:id` - Get single task
- POST `/api/tasks` - Create task
- PUT `/api/tasks/:id` - Update task
- DELETE `/api/tasks/:id` - Delete task
- POST `/api/tasks/:id/assign` - Assign task (Admin/Manager)
- GET `/api/tasks/search` - Search tasks
- GET `/api/tasks/export` - Export tasks to Excel

### Dashboard
- GET `/api/dashboard/admin` - Admin statistics
- GET `/api/dashboard/manager` - Manager statistics
- GET `/api/dashboard/member` - Member statistics

## 🎨 Theme System

Custom color system without gradients:
- Primary: Brand color (blue)
- Secondary: Supporting color (purple)
- Tertiary: Accent color (green)
- Quaternary: Additional accent (orange)
- Neutral: Grays for text and backgrounds

Colors are accessed via CSS variables and the theme object for consistency.




