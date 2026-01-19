# Deployment Guide

This guide provides step-by-step instructions for deploying the Smart Task Manager application.

## Prerequisites

- GitHub account
- Railway/Render account (for backend)
- Vercel account (for frontend)

## Step 1: Push to GitHub

1. Initialize git repository (if not already done):
```bash
git init
git add .
git commit -m "Initial commit: Smart Task Manager"
```

2. Create a new repository on GitHub

3. Push your code:
```bash
git remote add origin <your-github-repo-url>
git branch -M main
git push -u origin main
```

## Step 2: Deploy Backend

### Option A: Railway (Recommended)

1. Go to [railway.app](https://railway.app) and sign in
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect Node.js
5. In project settings:
   - Set **Root Directory** to `backend`
   - Railway will auto-configure PORT
6. Click "Deploy"
7. Once deployed, copy the generated URL (e.g., `https://your-app.railway.app`)

### Option B: Render

1. Go to [render.com](https://render.com) and sign in
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: task-manager-backend
   - **Root Directory**: `backend`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Click "Create Web Service"
6. Once deployed, copy the URL (e.g., `https://your-app.onrender.com`)

## Step 3: Deploy Frontend

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure:
   - **Root Directory**: `frontend` (click "Edit" and set to `frontend`)
   - **Framework Preset**: Vite (should auto-detect)
   - **Build Command**: `npm run build` (should auto-detect)
   - **Output Directory**: `dist` (should auto-detect)
5. Add Environment Variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-backend-url/api` (use your Railway/Render URL)
6. Click "Deploy"

## Step 4: Verify Deployment

1. **Backend Health Check**:
   - Visit: `https://your-backend-url/health`
   - Should return: `{"status":"ok","message":"Task Manager API is running"}`

2. **Backend API Test**:
   - Visit: `https://your-backend-url/api/tasks`
   - Should return: `[]`

3. **Frontend Test**:
   - Visit your Vercel URL
   - Try creating a task
   - Verify it appears in the list
   - Test filtering, editing, and deleting

## Troubleshooting

### Backend Issues

- **Port Error**: Ensure PORT environment variable is set (Railway/Render auto-sets this)
- **CORS Error**: Backend already has CORS enabled for all origins
- **Data Not Persisting**: JSON file storage works on Railway/Render, but data resets on redeploy

### Frontend Issues

- **API Connection Error**: 
  - Verify `VITE_API_URL` environment variable is set correctly
  - Ensure backend URL includes `/api` at the end
  - Check browser console for CORS errors
- **Build Fails**: 
  - Ensure all dependencies are in `package.json`
  - Check Vercel build logs for specific errors

### Common Fixes

1. **Clear Vercel cache**: Redeploy or clear build cache in Vercel settings
2. **Check environment variables**: Ensure `VITE_API_URL` is set in Vercel
3. **Verify backend is running**: Check Railway/Render logs
4. **Test API directly**: Use Postman or curl to test backend endpoints

## Environment Variables Summary

### Backend
- `PORT` - Server port (auto-set by Railway/Render)

### Frontend
- `VITE_API_URL` - Backend API URL (e.g., `https://your-app.railway.app/api`)

## Notes

- The backend uses JSON file storage, which means data persists during the session but resets on redeploy
- For production, consider upgrading to a database (PostgreSQL, MongoDB, etc.)
- The frontend is a Single Page Application (SPA), so Vercel's rewrite rules handle routing
