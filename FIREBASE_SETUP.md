# Firebase Setup Instructions

Follow these steps to enable real-time multi-user functionality:

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name (e.g., "confession-slice")
4. Accept terms and click "Continue"
5. Disable Google Analytics (optional) and click "Create project"
6. Wait for project to be created, then click "Continue"

## 2. Register Your Web App

1. In the Firebase Console, click the **Web icon** (`</>`) to add a web app
2. Register app name (e.g., "Confession Slice Web")
3. **Check** "Also set up Firebase Hosting" (optional)
4. Click "Register app"
5. Copy the `firebaseConfig` object shown on screen

## 3. Enable Firestore Database

1. In Firebase Console left sidebar, click **"Firestore Database"**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
   - This allows read/write access for 30 days
4. Select a location (choose closest to your users)
5. Click "Enable"

## 4. Update Firebase Configuration

1. Open `src/lib/firebase.ts` in your project
2. Replace the `firebaseConfig` object with your actual config from step 2
3. Save the file

Example:
```typescript
const firebaseConfig = {
  apiKey: "AIzaSyC1234567890abcdefghij",
  authDomain: "confession-slice.firebaseapp.com",
  projectId: "confession-slice",
  storageBucket: "confession-slice.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456"
};
```

## 5. Optional: Set Up Production Security Rules

For production, update Firestore Security Rules:

1. Go to Firebase Console > Firestore Database > Rules tab
2. Replace with these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to all confessions
    match /confessions/{confessionId} {
      allow read: if true;
      allow create: if request.resource.data.timestamp == request.time;
      allow update: if request.resource.data.userVote != resource.data.userVote;
    }
    
    // Allow read/write access to user tokens (authenticated or anonymous)
    match /users/{userId} {
      allow read, write: if true;
    }
  }
}
```

3. Click "Publish"

## 6. Test Your Setup

1. Restart your dev server: `npm run dev`
2. Open the app in multiple browser tabs or different browsers
3. Post a confession in one tab
4. Watch it appear instantly in other tabs! 🎉

## Troubleshooting

- **"Firebase: Error (auth/configuration-not-found)"**: Update firebase.ts with your config
- **"Missing or insufficient permissions"**: Check Firestore rules are in "test mode"
- **Changes not syncing**: Check browser console for Firebase errors
- **Need help?**: Check [Firebase Documentation](https://firebase.google.com/docs/firestore)
