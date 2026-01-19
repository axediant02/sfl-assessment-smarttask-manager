# Vercel Configuration Guide

## Step-by-Step Configuration

### 1. Access Your Project Settings
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click on your project (Smart Task Manager or task-manager-frontend)
3. Click on the **Settings** tab

### 2. Configure Root Directory
1. In Settings, scroll to **General** section
2. Find **Root Directory**
3. Click **Edit** button
4. Enter: `frontend`
5. Click **Save**

### 3. Add Environment Variable
1. In Settings, click on **Environment Variables** (left sidebar)
2. Click **Add New** button
3. Fill in:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend-url/api`
     - Replace `your-backend-url` with your actual backend URL
     - Examples:
       - Railway: `https://task-manager-backend.railway.app/api`
       - Render: `https://task-manager-backend.onrender.com/api`
4. Select all environments:
   - ✅ Production
   - ✅ Preview
   - ✅ Development
5. Click **Save**

### 4. Verify Build Settings
In Settings → General, verify:
- **Framework Preset**: Vite (or Auto)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

If these are incorrect:
1. Click **Edit** next to each setting
2. Update the value
3. Click **Save**

### 5. Redeploy
After making changes:
1. Go to **Deployments** tab
2. Find your latest deployment
3. Click the **⋯** (three dots) menu
4. Select **Redeploy**
5. Confirm redeployment

Or simply push a new commit to trigger automatic redeployment.

## Testing Your Configuration

After redeployment:
1. Visit your Vercel URL
2. Open browser DevTools (F12) → Console tab
3. Try creating a task
4. Check for any errors in the console
5. If you see CORS errors or connection errors, verify:
   - `VITE_API_URL` is set correctly
   - Backend URL includes `/api` at the end
   - Backend is running and accessible

## Common Issues

### Issue: "Failed to fetch tasks"
**Solution**: 
- Check that `VITE_API_URL` environment variable is set
- Verify the backend URL is correct and includes `/api`
- Ensure backend is deployed and running
- Check browser console for specific error messages

### Issue: Build fails
**Solution**:
- Verify Root Directory is set to `frontend`
- Check that `package.json` exists in the frontend folder
- Review build logs in Vercel dashboard

### Issue: Environment variable not working
**Solution**:
- Vite requires environment variables to start with `VITE_`
- After adding/updating environment variables, you MUST redeploy
- Environment variables are only available at build time, not runtime

## Quick Reference

| Setting | Value |
|---------|-------|
| Root Directory | `frontend` |
| Framework | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Environment Variable | `VITE_API_URL` = `https://your-backend-url/api` |
