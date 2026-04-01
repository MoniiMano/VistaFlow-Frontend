# CORS Configuration Guide

## Problem
When running the frontend locally (`http://localhost:3000`) and trying to connect to a production backend (`https://assignly-auth.vercel.app`), you'll encounter CORS errors:

```
Access to XMLHttpRequest at 'https://assignly-auth.vercel.app/api/auth/logout' 
from origin 'http://localhost:3000' has been blocked by CORS policy
```

## Solutions

### Option 1: Use Local Backend (Recommended for Development)

1. **Start your local backend server:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Use the development environment file:**
   The `.env.development` file is already configured:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_SOCKET_URL=http://localhost:5000
   ```

3. **Restart your frontend:**
   ```bash
   npm run dev
   ```

### Option 2: Configure Backend CORS

If you need to use the production backend from localhost, update your backend CORS configuration:

**In your backend `server.js` or `app.js`:**

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:3000',           // Local development
    'https://your-frontend.vercel.app' // Production frontend
  ],
  credentials: true,  // Important for cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## Environment Files

### Development (`.env.development`)
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### Production (`.env.production`)
```env
VITE_API_URL=https://assignly-auth.vercel.app/api
VITE_SOCKET_URL=https://assignly-auth.vercel.app
```

## How Vite Handles Environment Files

Vite automatically loads the correct environment file:
- `npm run dev` → Uses `.env.development`
- `npm run build` → Uses `.env.production`
- `.env` → Used as fallback for both

## Vercel Deployment

For production deployment on Vercel:

1. **Set environment variables in Vercel Dashboard:**
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add:
     - `VITE_API_URL` = `https://assignly-auth.vercel.app/api`
     - `VITE_SOCKET_URL` = `https://assignly-auth.vercel.app`

2. **Backend CORS must allow your frontend domain:**
   ```javascript
   origin: [
     'https://your-frontend.vercel.app',
     'https://your-frontend-*.vercel.app' // For preview deployments
   ]
   ```

## Testing

1. **Local Development:**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   npm run dev
   ```

2. **Production Build:**
   ```bash
   npm run build
   npm run preview
   ```

## Common Issues

### Issue: CORS error even with local backend
**Solution:** Make sure your backend has CORS enabled and is running on port 5000

### Issue: 401 Unauthorized errors
**Solution:** Check that `withCredentials: true` is set in axios config and backend allows credentials

### Issue: Environment variables not updating
**Solution:** Restart the dev server after changing `.env` files

## Security Notes

- Never commit `.env` files to git (already in `.gitignore`)
- Use different API keys/secrets for development and production
- Always use HTTPS in production
- Restrict CORS origins to only trusted domains in production
