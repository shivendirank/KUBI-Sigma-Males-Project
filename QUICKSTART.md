# ⚡ Quick Start Guide - Real-Time Confessions

Get your real-time confession platform running in **5 minutes**!

## Step 1: Create Firebase Project (2 minutes)

1. Go to https://console.firebase.google.com/
2. Click "Create a project" or "Add project"
3. Name it (e.g., "confession-slice")
4. Disable Google Analytics (optional) → Click "Create project"

## Step 2: Enable Firestore (1 minute)

1. In Firebase Console, click "Firestore Database" in left sidebar
2. Click "Create database"
3. **Choose "Start in test mode"** ✅
4. Select your region
5. Click "Enable"

## Step 3: Get Firebase Config (1 minute)

1. Click the **Web icon** (`</>`) at top of Firebase Console
2. Register app (name: "Confession Slice Web")
3. **Copy the entire `firebaseConfig` object**

## Step 4: Update Your Code (30 seconds)

Open `src/lib/firebase.ts` and paste your config:

```typescript
const firebaseConfig = {
  apiKey: "AIzaSy...",           // ← Your actual values
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

## Step 5: Test It! (30 seconds)

```bash
npm run dev
```

### Test Real-Time Sync:
1. Open http://localhost:5174 in Chrome
2. Open http://localhost:5174 in Incognito
3. Select team → Proceed
4. Post a confession in one window
5. **Watch it appear INSTANTLY in the other!** 🎉

## ✅ You're Live!

- 🟢 Green "Live" indicator = Successfully connected
- 🔴 Red "Connecting..." = Check Firebase config

## 🎯 What Works Now

✅ Real-time confessions across all users globally  
✅ Live voting (upvotes/downvotes)  
✅ Instant reply/roast synchronization  
✅ Multiple devices/browsers/users simultaneously  
✅ Persistent cloud storage  

## 🚀 Test with Friends

**Option 1: Same Network**
1. Get your IP: Run `ipconfig` (Windows) or `ifconfig` (Mac)
2. Share: `http://YOUR_IP:5174`
3. Friends on same WiFi can access!

**Option 2: Deploy to Vercel (Free, 2 minutes)**
```bash
npm install -g vercel
vercel
```

Add Firebase environment variables to Vercel:
1. Go to your project on Vercel Dashboard
2. Settings → Environment Variables
3. Add all `VITE_FIREBASE_*` variables
4. Redeploy

See **[VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)** for step-by-step guide.

Share your live URL: `https://your-project.vercel.app` 🌍

## 🐛 Issues?

**"Permission denied"**
→ Check Firestore is in "test mode"

**"Config not found"**  
→ Verify you updated `src/lib/firebase.ts`

**Not syncing**
→ Check browser console for errors
→ Ensure internet connection

## 📚 Full Documentation

- **[FIREBASE_SETUP.md](./FIREBASE_SETUP.md)** - Detailed Firebase setup
- **[REALTIME_FEATURES.md](./REALTIME_FEATURES.md)** - Complete features guide
- **[README.md](./README.md)** - Project overview

---

**Need help?** Check browser console (F12) for detailed error messages and logs.
