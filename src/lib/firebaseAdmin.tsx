import admin from "firebase-admin";
import fs from "fs";
import path from "path";

// --- SECURE BACKEND INITIALIZATION ---
let serviceAccount: any = null;

try {
    // 1. Try Environment Variable (Production/Local .env)
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        console.log("Found FIREBASE_SERVICE_ACCOUNT_KEY env var.");
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    }
    // 2. Try Local File (Development)
    else {
        const fullPath = path.join(process.cwd(), "src/lib/service-account.json");
        console.log("Checking for service account at:", fullPath);

        if (fs.existsSync(fullPath)) {
            const serviceAccountJson = fs.readFileSync(fullPath, 'utf8');
            serviceAccount = JSON.parse(serviceAccountJson);
            console.log("Successfully loaded service-account.json from filesystem.");
        } else {
            console.warn("CRITICAL: service-account.json NOT FOUND at", fullPath);
            // Check current directory listing for debugging
            try {
                const libFiles = fs.readdirSync(path.join(process.cwd(), "src/lib"));
                console.log("Files in src/lib:", libFiles);
            } catch (e) { }
        }
    }
} catch (err: any) {
    console.error("FATAL: Failed to load service account credentials:", err.message);
}

let firebaseAdminApp: admin.app.App | undefined;
let db: admin.firestore.Firestore | undefined;
let usersCollection: admin.firestore.CollectionReference | undefined;
let auth: admin.auth.Auth | undefined;

if (serviceAccount) {
    try {
        if (!admin.apps.length) {
            firebaseAdminApp = admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
            console.log("Firebase Admin: Initialized new app successfully.");
        } else {
            firebaseAdminApp = admin.app();
            console.log("Firebase Admin: Using existing app instance.");
        }
        db = admin.firestore();
        usersCollection = db.collection('users');
        auth = admin.auth();
        console.log("Firebase Admin: Services (DB, Auth, Collections) initialized.");
    } catch (error: any) {
        console.error("Firebase Admin: Initialization Error ->", error.message);
    }
} else {
    console.error("Firebase Admin: NOT Initialized - serviceAccount is still NULL.");
}

export async function verifyAuthToken(token: string): Promise<admin.auth.DecodedIdToken> {
    if (!auth) {
        throw new Error("Backend Authentication System (FIREBASE_ADMIN) is not initialized. Please ensure src/lib/service-account.json is present or FIREBASE_SERVICE_ACCOUNT_KEY is set.");
    }
    return auth.verifyIdToken(token);
}

export { firebaseAdminApp, db, usersCollection, auth as adminAuth, db as adminDb };