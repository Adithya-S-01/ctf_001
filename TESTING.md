# Deployment Testing Checklist

## 🌐 **Frontend Testing** - https://ctf-01.vercel.app/

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

**After testing, report which items work ✅ and which need fixes ❌**