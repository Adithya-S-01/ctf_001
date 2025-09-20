# CTF Website Deployment Guide

## 🎯 Project Overview
This is a Capture The Flag (CTF) competition website with:
- **Frontend**: React application (deploy to Vercel)
- **Backend**: Node.js API with MongoDB (deploy to Render)
- **Challenge Services**: 3 Docker containers (deploy to Azure later)

## 📁 Project Structure
```
├── client/              # React frontend
├── server/              # Node.js backend API
├── cookie-challenge/    # Docker service 1
├── unfiltered_ping/     # Docker service 2  
├── web-challenge-1/     # Docker service 3
├── azure-container-template.yaml
└── deploy-to-azure.sh
```

## 🚀 Step-by-Step Deployment

### Phase 1: Deploy Backend to Render

1. **Go to [Render](https://render.com) and sign up/login**

2. **Create a new Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub account
   - Select repository: `Adithya-S-01/ctf_001`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

3. **Set Environment Variables in Render:**
   ```
   MONGODB_URI=mongodb+srv://mind-quest:Dheeraj2004@mindquest.oefn1.mongodb.net/ctf1?retryWrites=true&w=majority&appName=mindquest
   PORT=5000
   JWT_SECRET=Wk7v3Ztqf9x2R1uEYJh5Kp8mT6Xq0dLwNs4VgAz1FcByHrQe
   PUBLIC_API_URL=https://YOUR_RENDER_SERVICE_NAME.onrender.com
   ```
   
   ⚠️ **Replace `YOUR_RENDER_SERVICE_NAME` with your actual Render service name**

4. **Deploy and note your backend URL**: `https://your-service-name.onrender.com`

### Phase 2: Deploy Frontend to Vercel

1. **Go to [Vercel](https://vercel.com) and sign up/login**

2. **Import Project:**
   - Click "New Project"
   - Import from GitHub: `Adithya-S-01/ctf_001`
   - **Root Directory**: `client`
   - **Framework Preset**: `Create React App`

3. **Set Environment Variables in Vercel:**
   ```
   REACT_APP_API_URL=https://YOUR_RENDER_SERVICE_NAME.onrender.com
   ```
   
   ⚠️ **Use the exact URL from your Render deployment**

4. **Deploy and note your frontend URL**: `https://your-project-name.vercel.app`

### Phase 3: Update CORS Configuration

After both deployments are live:

1. **Update Backend CORS Settings:**
   - Go to your Render dashboard
   - Navigate to your web service
   - Go to Environment variables
   - Update or add:
   ```
   FRONTEND_URL=https://your-project-name.vercel.app
   ```

2. **Update the CORS configuration in `server/index.js`:**
   - Replace `'https://your-frontend-name.vercel.app'` with your actual Vercel URL
   - Redeploy the backend service

## 🔧 Environment Variables Summary

### Backend (Render):
- `MONGODB_URI`: Your MongoDB connection string
- `PORT`: 5000
- `JWT_SECRET`: Your JWT secret key
- `PUBLIC_API_URL`: Your Render backend URL
- `FRONTEND_URL`: Your Vercel frontend URL

### Frontend (Vercel):
- `REACT_APP_API_URL`: Your Render backend URL

## ✅ Testing Your Deployment

1. **Test Backend:** Visit `https://your-backend.onrender.com/api/map-data`
   - Should return JSON response (even if empty)

2. **Test Frontend:** Visit `https://your-frontend.vercel.app`
   - Should load the login page
   - Try logging in (create test account first via backend)

## 🐛 Common Issues & Solutions

### Frontend Issues:
- **CORS Errors**: Make sure backend CORS includes your Vercel URL
- **API Calls Failing**: Verify `REACT_APP_API_URL` environment variable
- **Build Failures**: Check React version compatibility

### Backend Issues:
- **MongoDB Connection**: Verify `MONGODB_URI` is correct
- **Port Issues**: Render automatically assigns PORT, don't hardcode it
- **Environment Variables**: Double-check all vars are set in Render dashboard

### Both Services:
- **Cold Starts**: Render free tier has cold starts, first request may be slow
- **HTTPS Required**: Both services should use HTTPS URLs

## 📝 Post-Deployment Checklist

- [ ] Backend deployed and accessible at Render URL
- [ ] Frontend deployed and accessible at Vercel URL  
- [ ] Environment variables configured correctly
- [ ] CORS updated with actual frontend URL
- [ ] Login functionality working
- [ ] API calls successful from frontend to backend
- [ ] File downloads working (challenge files)

## 🔄 Making Updates

### Frontend Updates:
- Push changes to GitHub
- Vercel auto-deploys from main branch

### Backend Updates:
- Push changes to GitHub  
- Render auto-deploys from main branch
- Check logs in Render dashboard for issues

## 🎮 CTF Features Enabled

- ✅ User authentication (login/signup)
- ✅ Challenge listing and details
- ✅ Flag submission
- ✅ Score tracking
- ✅ File downloads for challenges
- ✅ Responsive design

## 🚫 Not Yet Deployed (Phase 4 - Azure)

- Docker challenge services (cookie-challenge, unfiltered_ping, web-challenge-1)
- WebShell functionality (requires Docker)
- Container-based challenges

## 📞 Support

If you encounter issues:
1. Check service logs in Render/Vercel dashboards
2. Verify environment variables
3. Test API endpoints individually
4. Check browser console for frontend errors

---

**Next Steps**: Once frontend and backend are working, we'll set up Azure Container Instances for the Docker-based challenges.