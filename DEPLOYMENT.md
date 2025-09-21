# CTF Website Deployment Guide

## 🎯 Project Overview
This is a Capture The Flag (CTF) competition website with:
- **Frontend**: React application (deploy to Vercel)
- **Backend**: Node.js API with MongoDB (deploy to Render) 
- **Challenge Services**: 3 Docker containers (deploy to Azure)
- **Webshell Service**: Docker-based terminal service (deploy to Azure later)

## 📁 Project Structure
```
├── client/              # React frontend → VERCEL
├── server/              # Node.js backend API → RENDER (NO DOCKERFILE)
├── cookie-challenge/    # Docker service 1 → AZURE
├── unfiltered_ping/     # Docker service 2 → AZURE
├── web-challenge-1/     # Docker service 3 → AZURE
├── webshell-service/    # Docker webshell → AZURE (comprehensive)
├── azure-container-template.yaml
└── deploy-to-azure.sh
```

## ⚠️ **IMPORTANT SEPARATION**

- **`server/`**: Pure Node.js API for Render (NO Docker files)
- **`webshell-service/`**: Complete Docker service for Azure
- **Challenge services**: Individual Docker containers for Azure

## 🚀 Step-by-Step Deployment

### Phase 1: Deploy Backend to Render (Main API)

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
   - Should return JSON response with challenges

2. **Test Frontend:** Visit `https://your-frontend.vercel.app`
   - Should load the login page
   - Challenge map should work (webshell temporarily disabled)

## 🎮 CTF Features Currently Working

- ✅ User authentication (login/signup)
- ✅ Challenge listing and details
- ✅ Flag submission and scoring
- ✅ Leaderboard
- ✅ File downloads for challenges
- ✅ Responsive design

## 🚫 Features for Later Deployment (Azure Phase)

- ❌ WebShell functionality (requires Docker service)
- ❌ Docker-based challenge containers
- ❌ Live challenge environments

## 📞 Support

If you encounter issues:
1. Check service logs in Render/Vercel dashboards
2. Verify environment variables
3. Test API endpoints individually
4. Check browser console for frontend errors

---

## Phase 3: Deploy Webshell Service to Azure Container Instances

### Prerequisites
- Azure account with active subscription
- Azure CLI installed and configured
- Docker Desktop installed (for building images)

### Step 1: Build and Push Webshell Docker Image

1. **Navigate to webshell-service directory**:
   ```bash
   cd webshell-service
   ```

2. **Build the Docker image**:
   ```bash
   docker build -t ctf-webshell-service .
   ```

3. **Tag for Azure Container Registry** (replace `yourregistry` with your ACR name):
   ```bash
   docker tag ctf-webshell-service yourregistry.azurecr.io/ctf-webshell-service:latest
   ```

4. **Push to Azure Container Registry**:
   ```bash
   az acr login --name yourregistry
   docker push yourregistry.azurecr.io/ctf-webshell-service:latest
   ```

### Step 2: Deploy to Azure Container Instances

1. **Create Azure Container Instance**:
   ```bash
   az container create \
     --resource-group your-resource-group \
     --name ctf-webshell-service \
     --image yourregistry.azurecr.io/ctf-webshell-service:latest \
     --dns-name-label ctf-webshell-001 \
     --ports 6000 \
     --environment-variables \
       JWT_SECRET="Wk7v3Ztqf9x2R1uEYJh5Kp8mT6Xq0dLwNs4VgAz1FcByHrQe" \
       PORT="6000" \
       FRONTEND_URL="https://ctf-001-ten.vercel.app" \
       BACKEND_URL="https://ctf-001.onrender.com" \
     --cpu 1 \
     --memory 2 \
     --registry-login-server yourregistry.azurecr.io \
     --registry-username yourregistry \
     --registry-password "your-acr-password"
   ```

2. **Get the public URL**:
   ```bash
   az container show --resource-group your-resource-group --name ctf-webshell-service --query ipAddress.fqdn
   ```

   Your webshell service will be available at: `http://ctf-webshell-001.region.azurecontainer.io:6000`

### Step 3: Build and Deploy Kali Webshell Container

1. **Build the Kali webshell image**:
   ```bash
   docker build -f kali-webshell.Dockerfile -t kali-ctf-webshell .
   ```

2. **Tag and push to ACR**:
   ```bash
   docker tag kali-ctf-webshell yourregistry.azurecr.io/kali-ctf-webshell:latest
   docker push yourregistry.azurecr.io/kali-ctf-webshell:latest
   ```

### Step 4: Update Frontend Configuration

Once your webshell service is deployed, you'll need to update the frontend to use the Azure URL instead of localhost. This step will be covered in the next phase.

### Testing Your Azure Deployment

1. **Check webshell service health**:
   ```bash
   curl http://ctf-webshell-001.region.azurecontainer.io:6000/health
   ```

2. **Expected response**:
   ```json
   {"status":"healthy","service":"webshell-service"}
   ```

---

**Next Steps**: Once webshell service is deployed on Azure, we'll update the frontend to connect to it and enable the webshell UI.