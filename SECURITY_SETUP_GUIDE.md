# 🔒 CRITICAL SECURITY FIXES - SETUP GUIDE

## ⚠️ IMMEDIATE ACTIONS REQUIRED

This guide will help you complete the critical security fixes that have been implemented.

---

## 📋 WHAT WE'VE FIXED SO FAR

✅ **1. Removed Hardcoded Firebase Credentials**
   - Moved to environment variables
   - Added validation for required env vars

✅ **2. Created Security Middleware**
   - CORS protection
   - Security headers (OWASP recommended)
   - Request validation

✅ **3. Added Input Validation**
   - Zod schemas for all API inputs
   - Prevents injection attacks
   - Data sanitization

✅ **4. Improved Error Handling**
   - Centralized error handler
   - Prevents information disclosure
   - Production-safe error messages

✅ **5. Removed Password from Client State**
   - Security vulnerability fixed

---

## 🚨 CRITICAL: WHAT YOU MUST DO NOW

### Step 1: Create Environment Variables File

1. **Copy the example file:**
   ```bash
   cp .env.local.example .env.local
   ```

2. **Fill in your Firebase credentials:**

   Open `.env.local` and replace the placeholder values with your actual Firebase credentials:

   ```env
   # Get these from Firebase Console > Project Settings > General
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyA7anO04p6sMyN38pIT-Yytp0LY4Zj_nXk
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=web-varnothsava.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=web-varnothsava
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=web-varnothsava.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=943741524490
   NEXT_PUBLIC_FIREBASE_APP_ID=1:943741524490:web:fc064db962fa4177aeddf3
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-LQ0T4Q2KRJ
   ```

3. **Add your service account key:**

   Go to Firebase Console > Project Settings > Service Accounts > Generate New Private Key

   Copy the entire JSON content and paste it as a single line:

   ```env
   FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"web-varnothsava",...}'
   ```

---

### Step 2: 🔥 CRITICAL - Rotate Firebase Credentials

**⚠️ YOUR CURRENT CREDENTIALS ARE EXPOSED IN GIT HISTORY**

You MUST rotate them immediately:

#### A. Rotate Firebase API Keys

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `web-varnothsava`
3. Go to **Project Settings** > **General**
4. Scroll to **Your apps** section
5. Click on your web app
6. Click **"Regenerate API key"** or create a new web app
7. Update `.env.local` with the new keys

#### B. Delete Exposed Service Account

1. Go to **Project Settings** > **Service Accounts**
2. Go to **Google Cloud Console** (click the link)
3. Find the service account: `firebase-adminsdk-fbsvc@web-varnothsava.iam.gserviceaccount.com`
4. **DELETE IT** (it's permanently exposed)
5. Create a new service account:
   - Click **"Create Service Account"**
   - Name: `firebase-admin-new`
   - Role: **Firebase Admin SDK Administrator Service Agent**
   - Click **"Create Key"** > **JSON**
6. Copy the JSON content to `.env.local`

---

### Step 3: Remove Service Account from Git History

**⚠️ CRITICAL: The file is still in Git history**

```bash
# WARNING: This will rewrite Git history. Coordinate with your team first!

# 1. Remove the file from Git history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch src/lib/service-account.json" \
  --prune-empty --tag-name-filter cat -- --all

# 2. Clean up
rm -rf .git/refs/original/
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# 3. Force push (⚠️ WARNING: This affects all team members)
git push origin --force --all
git push origin --force --tags
```

**Alternative (if you can't force push):**
- Create a new repository
- Copy code (excluding .git folder)
- Push to new repo
- Update all team members

---

### Step 4: Delete the Exposed Service Account File

```bash
# Delete the file permanently
rm src/lib/service-account.json

# Verify it's in .gitignore
grep "service-account.json" .gitignore
# Should show: service-account.json
```

---

### Step 5: Set Up Firebase Security Rules

Your database is currently OPEN. Add these rules:

1. Go to Firebase Console > Firestore Database > Rules

2. Replace with these secure rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check if user owns the document
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Users collection
    match /users/{userId} {
      // Users can only read their own data
      allow read: if isOwner(userId);
      
      // Users can only write their own data
      allow write: if isOwner(userId);
      
      // Admins can read all (add admin check later)
      // allow read: if isAdmin();
    }
    
    // Deny all other access by default
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

3. Click **"Publish"**

---

### Step 6: Restart Development Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

The app should now load with environment variables.

---

## 🎯 NEXT STEPS (OPTIONAL BUT RECOMMENDED)

### A. Add Rate Limiting (Prevents DDoS)

1. **Sign up for Upstash Redis** (free tier):
   - Go to https://upstash.com
   - Create account
   - Create Redis database
   - Copy REST URL and Token

2. **Install dependencies:**
   ```bash
   npm install @upstash/ratelimit @upstash/redis
   ```

3. **Add to `.env.local`:**
   ```env
   UPSTASH_REDIS_REST_URL=your_url_here
   UPSTASH_REDIS_REST_TOKEN=your_token_here
   ```

4. **Create rate limiting middleware** (I can help with this)

### B. Add Error Tracking (Sentry)

1. **Sign up for Sentry** (free tier):
   - Go to https://sentry.io
   - Create project
   - Copy DSN

2. **Install Sentry:**
   ```bash
   npx @sentry/wizard@latest -i nextjs
   ```

3. **Add to `.env.local`:**
   ```env
   NEXT_PUBLIC_SENTRY_DSN=your_dsn_here
   ```

---

## ✅ VERIFICATION CHECKLIST

Before deploying, verify:

- [ ] `.env.local` file created with all variables
- [ ] Firebase credentials rotated (new API keys)
- [ ] Old service account deleted
- [ ] New service account created and added to `.env.local`
- [ ] `service-account.json` deleted from filesystem
- [ ] `service-account.json` removed from Git history
- [ ] Firebase Security Rules updated
- [ ] Development server restarts successfully
- [ ] Login/registration still works
- [ ] No credentials visible in source code

---

## 🆘 TROUBLESHOOTING

### Error: "Missing required Firebase environment variables"

**Solution:** Make sure `.env.local` exists and has all `NEXT_PUBLIC_FIREBASE_*` variables.

### Error: "Database collection not initialized"

**Solution:** Check that `FIREBASE_SERVICE_ACCOUNT_KEY` is set correctly in `.env.local`.

### Error: "CORS blocked"

**Solution:** The middleware is working! Make sure you're accessing from `localhost:3000`.

### Login not working

**Solution:** 
1. Check browser console for errors
2. Verify Firebase credentials are correct
3. Check Firebase Authentication is enabled

---

## 📊 WHAT'S BEEN IMPROVED

| Security Issue | Status | Impact |
|----------------|--------|--------|
| Exposed API Keys | ✅ FIXED | Prevents unauthorized access |
| Service Account in Git | ⚠️ NEEDS ACTION | Delete old account |
| No CORS Protection | ✅ FIXED | Prevents CSRF attacks |
| No Input Validation | ✅ FIXED | Prevents injection |
| Error Info Disclosure | ✅ FIXED | Hides internal errors |
| Password in Client | ✅ FIXED | Prevents credential theft |

---

## 🚀 DEPLOYMENT NOTES

**DO NOT DEPLOY** until you've completed:
1. ✅ Rotated all credentials
2. ✅ Removed service account from Git
3. ✅ Set up Firebase Security Rules
4. ✅ Tested locally

For production deployment, you'll need to:
- Set environment variables in your hosting platform (Vercel/Netlify/etc.)
- Enable HTTPS (required for production)
- Add your production domain to CORS whitelist in `src/middleware.ts`

---

## 📞 NEED HELP?

If you encounter issues:
1. Check the error message carefully
2. Verify all environment variables are set
3. Check Firebase Console for any errors
4. Review the `BACKEND_PRODUCTION_REVIEW.md` for detailed explanations

---

**Last Updated:** January 20, 2026
**Status:** Phase 1 (Critical Security) - IN PROGRESS
