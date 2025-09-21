# Deploy Webshell to Railway (Alternative to Azure)

## Quick Railway Deployment (Recommended for Testing)

1. **Create Railway account**: Go to https://railway.app and sign up

2. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   ```

3. **Login to Railway**:
   ```bash
   railway login
   ```

4. **Navigate to webshell-service directory**:
   ```bash
   cd webshell-service
   ```

5. **Initialize Railway project**:
   ```bash
   railway init
   ```

6. **Deploy the service**:
   ```bash
   railway up
   ```

7. **Set environment variables in Railway dashboard**:
   - Go to your Railway project dashboard
   - Click on "Variables" tab
   - Add these variables:
     ```
     JWT_SECRET=Wk7v3Ztqf9x2R1uEYJh5Kp8mT6Xq0dLwNs4VgAz1FcByHrQe
     PORT=6000
     FRONTEND_URL=https://ctf-001-ten.vercel.app
     BACKEND_URL=https://ctf-001.onrender.com
     ```

8. **Get your Railway URL**:
   - In Railway dashboard, click "Settings" > "Domains"
   - Copy the generated URL (e.g., `https://webshell-service-production-xxxx.up.railway.app`)

## Alternative: Render Deployment

1. **Create new Web Service on Render**
2. **Connect your GitHub repository**
3. **Set Root Directory**: `webshell-service`
4. **Set Build Command**: `npm ci`
5. **Set Start Command**: `npm start`
6. **Add Environment Variables** (same as above)

## Alternative: Fly.io Deployment

1. **Install Fly CLI**: https://fly.io/docs/getting-started/installing-flyctl/
2. **Navigate to webshell-service directory**
3. **Initialize Fly app**:
   ```bash
   fly launch --no-deploy
   ```
4. **Set environment variables**:
   ```bash
   fly secrets set JWT_SECRET="Wk7v3Ztqf9x2R1uEYJh5Kp8mT6Xq0dLwNs4VgAz1FcByHrQe"
   fly secrets set PORT="6000"
   fly secrets set FRONTEND_URL="https://ctf-001-ten.vercel.app"
   fly secrets set BACKEND_URL="https://ctf-001.onrender.com"
   ```
5. **Deploy**:
   ```bash
   fly deploy
   ```

Once you choose a deployment method and get your webshell service URL, let me know and I'll update the frontend to connect to it!