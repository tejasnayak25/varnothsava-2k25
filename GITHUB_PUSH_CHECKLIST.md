# 🚀 GITHUB PUSH CHECKLIST

## ⚠️ **CRITICAL: READ BEFORE PUSHING!**

---

## 🔴 **STEP 1: VERIFY SENSITIVE FILES ARE IGNORED**

### **Check these files are in `.gitignore`:**

```bash
# Run this command to verify:
git status --ignored
```

**Must be ignored:**
- ✅ `.env.local` (contains Firebase credentials)
- ✅ `service-account.json` (Firebase private key)
- ✅ `src/lib/service-account.json` (if exists)
- ✅ `node_modules/` (dependencies)
- ✅ `.next/` (build files)

---

## 🔴 **STEP 2: CHECK FOR EXPOSED SECRETS**

### **Run these checks:**

```bash
# 1. Check if .env.local is tracked
git ls-files | grep -E "\.env"

# 2. Check if service-account.json is tracked
git ls-files | grep -E "service-account"

# 3. Check for any .json files in src/lib
git ls-files | grep -E "src/lib/.*\.json"
```

**Expected output:** Nothing! If you see files, they're tracked and MUST be removed.

---

## 🔴 **STEP 3: REMOVE SENSITIVE FILES FROM GIT HISTORY**

### **If service-account.json was previously committed:**

```bash
# WARNING: This rewrites Git history!
# Only do this if the file was committed before

# Option 1: Using git filter-repo (recommended)
pip install git-filter-repo
git filter-repo --path src/lib/service-account.json --invert-paths

# Option 2: Using BFG Repo-Cleaner
# Download from: https://rtyley.github.io/bfg-repo-cleaner/
java -jar bfg.jar --delete-files service-account.json

# Option 3: Manual removal (if only in recent commits)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch src/lib/service-account.json" \
  --prune-empty --tag-name-filter cat -- --all
```

**After removing:**
```bash
git push origin --force --all
```

---

## 🔴 **STEP 4: DELETE SENSITIVE FILES LOCALLY**

```bash
# Delete service account file
rm src/lib/service-account.json

# Verify it's gone
ls src/lib/
```

---

## ✅ **STEP 5: VERIFY .gitignore IS WORKING**

```bash
# Create a test file
echo "test" > .env.local

# Check if it's ignored
git status

# Should NOT appear in untracked files
# Clean up
rm .env.local
```

---

## ✅ **STEP 6: PREPARE FOR PUSH**

### **1. Check what will be committed:**

```bash
git status
```

**Should see:**
- ✅ Source code files (`.tsx`, `.ts`, `.css`)
- ✅ Configuration files (`package.json`, `next.config.ts`)
- ✅ Documentation files (`.md`)
- ✅ `.gitignore`
- ✅ `.env.local.example` (template only)

**Should NOT see:**
- ❌ `.env.local`
- ❌ `service-account.json`
- ❌ `node_modules/`
- ❌ `.next/`

### **2. Stage your files:**

```bash
# Add all files (gitignore will protect sensitive ones)
git add .

# Verify again
git status
```

### **3. Commit:**

```bash
git commit -m "feat: Production-ready authentication system

- Implemented Google OAuth and Email/Password authentication
- Added complete user isolation (UID-based)
- Configured rate limiting (dev: 50/hour, prod: 3/hour)
- Added CORS protection and security headers
- Implemented input validation with Zod
- Added navigation and event registration protection
- Configured flexible validation for real-world data
- Added comprehensive error handling
- Documented all features and security measures

Security Score: 80/100
Production Ready: Yes (after credential rotation)"
```

---

## ✅ **STEP 7: PUSH TO GITHUB**

### **First time pushing:**

```bash
# Create repository on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### **Subsequent pushes:**

```bash
git push
```

---

## 🔴 **STEP 8: VERIFY ON GITHUB**

### **After pushing, check GitHub:**

1. **Go to your repository**
2. **Check these files are NOT visible:**
   - ❌ `.env.local`
   - ❌ `service-account.json`
   - ❌ Any file with credentials

3. **Check these files ARE visible:**
   - ✅ `.env.local.example` (template)
   - ✅ `.gitignore`
   - ✅ All documentation (`.md` files)
   - ✅ Source code

---

## 🔴 **STEP 9: ROTATE CREDENTIALS (CRITICAL!)**

**Since you're pushing to GitHub, you MUST rotate credentials:**

### **1. Firebase Credentials:**

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **Project Settings** → **Service Accounts**
4. Delete the current service account
5. Generate a new service account key
6. Download the new JSON file
7. **DO NOT commit it to Git!**
8. Store it securely (use environment variables in production)

### **2. Update Environment Variables:**

```bash
# Update .env.local with new credentials
# Then deploy to production with new credentials
```

---

## ✅ **STEP 10: FINAL VERIFICATION**

### **Run this final check:**

```bash
# 1. Clone your repo in a new folder
cd /tmp
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git test-clone
cd test-clone

# 2. Check for sensitive files
find . -name "*.env*" -not -name "*.example"
find . -name "*service-account*"

# 3. If nothing found, you're safe!
cd ..
rm -rf test-clone
```

---

## 📋 **COMPLETE CHECKLIST**

Before pushing to GitHub:

- [ ] `.gitignore` is updated
- [ ] `.env.local` is NOT tracked
- [ ] `service-account.json` is deleted
- [ ] No credentials in code
- [ ] `git status` shows only safe files
- [ ] Committed with descriptive message
- [ ] Pushed to GitHub
- [ ] Verified on GitHub (no sensitive files)
- [ ] Rotated Firebase credentials
- [ ] Updated production environment variables

---

## 🔒 **WHAT'S SAFE TO COMMIT**

### **✅ Safe Files:**
- Source code (`.tsx`, `.ts`, `.jsx`, `.js`)
- Styles (`.css`, `.scss`)
- Configuration (`.json`, `.config.ts`)
- Documentation (`.md`)
- `.env.local.example` (template only)
- `.gitignore`
- `package.json`
- `next.config.ts`
- Public assets (`/public/*`)

### **❌ NEVER Commit:**
- `.env.local` (real credentials)
- `service-account.json` (Firebase private key)
- Any file with API keys
- Any file with passwords
- Any file with tokens
- `node_modules/`
- `.next/` (build files)

---

## 🚨 **IF YOU ACCIDENTALLY PUSHED SECRETS**

### **Immediate Actions:**

1. **Rotate ALL credentials immediately**
   - Firebase API keys
   - Service account keys
   - Any other secrets

2. **Remove from Git history**
   ```bash
   git filter-repo --path .env.local --invert-paths
   git push origin --force --all
   ```

3. **Update `.gitignore`**

4. **Push new `.gitignore`**

5. **Verify on GitHub**

---

## 📞 **NEED HELP?**

If you see any sensitive files on GitHub:
1. **Delete the repository immediately**
2. **Rotate all credentials**
3. **Fix `.gitignore`**
4. **Create new repository**
5. **Push again**

---

## ✅ **YOU'RE READY!**

Follow this checklist step-by-step, and you'll safely push to GitHub! 🚀

**Remember:** Once pushed, assume all secrets are compromised. Always rotate credentials after pushing for the first time!
