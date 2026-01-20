# 🔒 CRITICAL SECURITY FIXES - ACTION CHECKLIST

## ⏰ DO THIS NOW (Next 30 Minutes)

### Step 1: Set Up Environment Variables (5 minutes)
```bash
# Copy the example file
cp .env.local.example .env.local
```

Then open `.env.local` and fill in these values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyA7anO04p6sMyN38pIT-Yytp0LY4Zj_nXk
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=web-varnothsava.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=web-varnothsava
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=web-varnothsava.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=943741524490
NEXT_PUBLIC_FIREBASE_APP_ID=1:943741524490:web:fc064db962fa4177aeddf3
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-LQ0T4Q2KRJ
```

For the service account, copy the content from `src/lib/service-account.json` as a single line:
```env
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...entire JSON here...}'
```

**Status:** [ ] Done

---

### Step 2: Delete Exposed Service Account File (1 minute)
```bash
rm src/lib/service-account.json
```

**Status:** [ ] Done

---

### Step 3: Restart Development Server (1 minute)
```bash
# Press Ctrl+C to stop current server
# Then:
npm run dev
```

**Status:** [ ] Done

---

### Step 4: Test That Everything Works (5 minutes)

1. Open http://localhost:3000
2. Try to login/register
3. Check browser console for errors

**Status:** [ ] Done

---

## 🔥 DO THIS TODAY (Next 2 Hours)

### Step 5: Rotate Firebase Credentials (30 minutes)

⚠️ **CRITICAL:** Your credentials are exposed in Git history!

#### 5a. Generate New Firebase API Keys

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `web-varnothsava`
3. Go to **Project Settings** > **General**
4. Under "Your apps", click your web app
5. Click **"Regenerate API key"**
6. Update `.env.local` with new keys

**Status:** [ ] Done

---

#### 5b. Delete Exposed Service Account

1. Go to **Project Settings** > **Service Accounts**
2. Click **"Manage service account permissions"**
3. Find: `firebase-adminsdk-fbsvc@web-varnothsava.iam.gserviceaccount.com`
4. Click the three dots → **Delete**
5. Confirm deletion

**Status:** [ ] Done

---

#### 5c. Create New Service Account

1. In Google Cloud Console, click **"Create Service Account"**
2. Name: `firebase-admin-new`
3. Click **"Create and Continue"**
4. Role: **Firebase Admin SDK Administrator Service Agent**
5. Click **"Done"**
6. Click on the new service account
7. Go to **"Keys"** tab
8. Click **"Add Key"** → **"Create new key"** → **JSON**
9. Download the JSON file
10. Copy entire content to `.env.local` as `FIREBASE_SERVICE_ACCOUNT_KEY`

**Status:** [ ] Done

---

### Step 6: Update Firebase Security Rules (15 minutes)

1. Go to Firebase Console > **Firestore Database** > **Rules**

2. Replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    match /users/{userId} {
      allow read: if isOwner(userId);
      allow write: if isOwner(userId);
    }
    
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

3. Click **"Publish"**

**Status:** [ ] Done

---

### Step 7: Remove Service Account from Git History (30 minutes)

⚠️ **WARNING:** This rewrites Git history. Coordinate with your team!

```bash
# Backup your code first!
git branch backup-before-history-rewrite

# Remove the file from history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch src/lib/service-account.json" \
  --prune-empty --tag-name-filter cat -- --all

# Clean up
rm -rf .git/refs/original/
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push (⚠️ WARNING: Affects all team members)
git push origin --force --all
git push origin --force --tags
```

**Alternative if you can't force push:**
- Create a new repository
- Copy code (excluding .git folder)
- Push to new repo

**Status:** [ ] Done

---

## ✅ VERIFICATION

After completing all steps, verify:

- [ ] `.env.local` exists with all variables
- [ ] `src/lib/service-account.json` is deleted
- [ ] Development server starts without errors
- [ ] Login/registration works
- [ ] Firebase credentials are rotated
- [ ] Old service account is deleted
- [ ] New service account is created
- [ ] Firebase Security Rules are updated
- [ ] Service account removed from Git history
- [ ] No credentials visible in source code

---

## 🎯 QUICK REFERENCE

**Created Files:**
- `.env.local.example` - Template
- `src/middleware.ts` - Security middleware
- `src/lib/validation.ts` - Input validation
- `src/lib/errorHandler.ts` - Error handling

**Modified Files:**
- `src/lib/firebaseClient.tsx` - Uses env vars
- `src/app/api/register/route.ts` - Validation added
- `src/context/AppContext.tsx` - Removed password field
- `.gitignore` - Enhanced patterns

**Documentation:**
- `BACKEND_PRODUCTION_REVIEW.md` - Full audit (42/100 → 65/100)
- `SECURITY_SETUP_GUIDE.md` - Detailed instructions
- `SECURITY_FIXES_SUMMARY.md` - What was fixed
- `QUICK_ACTION_CHECKLIST.md` - This file

---

## 🆘 NEED HELP?

**Error: "Missing required Firebase environment variables"**
→ Create `.env.local` with all Firebase config

**Error: "Database collection not initialized"**
→ Add `FIREBASE_SERVICE_ACCOUNT_KEY` to `.env.local`

**Login not working**
→ Check Firebase credentials in `.env.local`

**CORS errors**
→ Access from `localhost:3000` only

---

## 📞 SUPPORT

If stuck, check:
1. `SECURITY_SETUP_GUIDE.md` - Detailed steps
2. `BACKEND_PRODUCTION_REVIEW.md` - Full explanation
3. Browser console for specific errors
4. Firebase Console for service errors

---

**Last Updated:** January 20, 2026  
**Estimated Time:** 2-3 hours total  
**Priority:** 🔴 CRITICAL - Do not deploy until complete
