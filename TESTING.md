# Deployment Testing Checklist
## 🗄️ **Backend Testing** - https://ctf-001.onrender.com## 🌐 **LIVE DEPLOYMENT URLS**
- **Frontend**: https://ctf-01.vercel.app
- **Backend**: https://ctf-001.onrender.com  
- **Webshell**: https://ctf01.azurewebsites.net

## 🌐 **Frontend Testing** - https://ctf-01.vercel.app

### ✅ **Basic Functionality:**
- [ ] Login page loads correctly
- [ ] Can navigate between pages
- [ ] No console errors in browser dev tools
- [ ] Responsive design works on mobile

### ✅ **Authentication:**
- [ ] Can log in with test credentials:
  - Username: `test` / Password: `test123`
  - Username: `admin` / Password: `admin123`
  - Username: `demo` / Password: `demo123`
- [ ] Invalid credentials show error message
- [ ] After login, redirected to story/map page

### ✅ **CTF Features:**
- [ ] Challenge map displays correctly
- [ ] Can click on challenge pins
- [ ] Challenge details page loads
- [ ] Can submit flags (test with correct/incorrect flags)
- [ ] File downloads work
- [ ] Leaderboard displays

## 🛠️ **Backend Testing** - https://ctf-001.onrender.com

### ✅ **API Endpoints:**
- [ ] Health check: `GET /api/health`
- [ ] Map data: `GET /api/map-data`
- [ ] Leaderboard: `GET /api/leaderboard`
- [ ] Login: `POST /api/login`
- [ ] Challenge details: `GET /api/challenge/1`
- [ ] File serving: `GET /files/initiate`

### ✅ **Database:**
- [ ] Challenges are auto-seeded
- [ ] Test users are created
- [ ] Login works with seeded users
- [ ] Score tracking functions

## 🔧 **Known Issues to Check:**

1. **CORS Errors**: Check browser console for cross-origin issues
2. **Environment Variables**: Ensure Render has all required env vars
3. **Cold Start**: First API call may be slow (Render free tier)
4. **File Downloads**: Challenge files should download correctly

## 🎯 **Test Scenarios:**

### **Complete User Journey:**
1. Visit frontend → Login page loads
2. Login with `test` / `test123` → Success
3. Navigate to map → Challenges display
4. Click challenge pin → Details page loads
5. Submit wrong flag → Error message
6. Submit correct flag → Success message
7. Check leaderboard → Score updated

### **Sample Test Flags:**
- Challenge 1: `flag{w3lc0me_t0_th3_r3scu3_m1ss10n}`
- Challenge 2: `flag{d3l3t3d_d4t4_n3v3r_d13s}`
- Challenge 3: `flag{n3v3r_tru5t_u53r_1nput}`
- Challenge 4: `flag{h1dd3n_1n_pl41n_s1ght}`

## 🚨 **Common Fixes:**

### **If login fails:**
- Check browser console for API errors
- Verify backend /api/health endpoint responds
- Check if Render service is running

### **If challenges don't load:**
- Backend may still be initializing database
- Wait 30 seconds and refresh
- Check /api/map-data endpoint directly

### **If CORS errors:**
- Redeploy backend after recent CORS fixes
- Check Render logs for errors

## 📞 **Debug Endpoints:**

- **Backend Health**: https://ctf-001.onrender.com/api/health
- **Challenge Data**: https://ctf-001.onrender.com/api/map-data
- **Sample File**: https://ctf-001.onrender.com/files/initiate

---

## Phase 3: Webshell Integration Testing (After Deployment)

### Prerequisites
- Webshell service deployed to your chosen platform
- REACT_APP_WEBSHELL_URL updated in frontend environment
- Frontend redeployed with new webshell URL

### Webshell Service Testing

1. **Health Check**:
   ```bash
   curl https://your-webshell-service-url/health
   ```
   Expected: `{"status":"healthy","service":"webshell-service"}`

2. **Authentication Test** (using test credentials):
   - Login with `testteam1` / `password123`
   - Navigate to any challenge (e.g., Challenge 1)
   - Click "Open Webshell" button
   - Should show webshell panel with terminal loading message

3. **Terminal Functionality**:
   - Terminal should start and load Kali Linux environment
   - Test basic commands: `ls`, `pwd`, `whoami`
   - Test file download: `curl http://host.docker.internal:5000/files/initiate -o initiate`
   - Test challenge tools: `strings`, `file`, `grep`, etc.

4. **Error Handling**:
   - Test with invalid token (should show 401 error)
   - Test stopping terminal (close button should work)
   - Test multiple terminal sessions (old ones should be cleaned up)

### Expected Webshell Behavior

✅ **Working States**:
- Health endpoint returns OK
- Authentication with valid JWT works
- Terminal starts and loads within 30 seconds
- Basic Linux commands work
- File downloads work
- Terminal cleanup on close

❌ **Common Issues**:
- CORS errors (check frontend URL in webshell CORS config)
- Authentication failures (verify JWT_SECRET matches backend)
- Docker daemon issues (Docker must be available in container)
- Port conflicts (ensure unique port allocation)
- Memory issues (containers need sufficient resources)

### Troubleshooting

**If webshell fails to start**:
1. Check webshell service logs
2. Verify Docker daemon is accessible
3. Check JWT_SECRET matches backend
4. Verify CORS configuration includes frontend URL

**If terminal doesn't load**:
1. Check if kali-ctf-webshell image is available
2. Verify port allocation and networking
3. Check container resource limits
4. Monitor for container startup errors

---

**After testing, report which items work ✅ and which need fixes ❌**