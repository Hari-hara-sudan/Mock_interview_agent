import dotenv from 'dotenv';
dotenv.config({ path: './.env.lc' });
import admin from 'firebase-admin';

// Initialize Firebase Admin SDK (same as firebase/admin.ts)
function initFirebaseAdmin() {
  const apps = admin.apps;

  if (!apps.length) {
    // Check if environment variables are set
    if (!process.env.FIREBASE_PROJECT_ID) {
      throw new Error('FIREBASE_PROJECT_ID environment variable is not set');
    }
    if (!process.env.FIREBASE_CLIENT_EMAIL) {
      throw new Error('FIREBASE_CLIENT_EMAIL environment variable is not set');
    }
    if (!process.env.FIREBASE_PRIVATE_KEY) {
      throw new Error('FIREBASE_PRIVATE_KEY environment variable is not set');
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Replace newlines in the private key
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
    });
  }

  return admin.firestore();
}

const db = initFirebaseAdmin();

async function migrateUserIds() {
  try {
    console.log('FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID);
    console.log('FIREBASE_CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL);
    console.log('FIREBASE_PRIVATE_KEY:', process.env.FIREBASE_PRIVATE_KEY ? 'SET' : 'MISSING');
    console.log('Starting migration...');
    
    // 1. Build a map of displayName -> UID from your users collection
    console.log('Fetching users...');
    const usersSnapshot = await db.collection('users').get();
    const nameToUid = {};
    usersSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.displayName && doc.id) {
        nameToUid[data.displayName] = doc.id;
        console.log(`Mapped: ${data.displayName} -> ${doc.id}`);
      }
    });

    console.log(`Found ${Object.keys(nameToUid).length} users to map`);

    // 2. Update interviews
    console.log('Updating interviews...');
    const interviewsSnapshot = await db.collection('interviews').get();
    let interviewUpdates = 0;
    for (const doc of interviewsSnapshot.docs) {
      const data = doc.data();
      if (data.userId && nameToUid[data.userId]) {
        try {
          await doc.ref.update({ userId: nameToUid[data.userId] });
          console.log(`Updated interview ${doc.id}: userId '${data.userId}' -> '${nameToUid[data.userId]}'`);
          interviewUpdates++;
        } catch (err) {
          console.error(`Failed to update interview ${doc.id}:`, err);
        }
      }
    }

    // 3. Update feedback
    console.log('Updating feedback...');
    const feedbackSnapshot = await db.collection('feedback').get();
    let feedbackUpdates = 0;
    for (const doc of feedbackSnapshot.docs) {
      const data = doc.data();
      if (data.userId && nameToUid[data.userId]) {
        try {
          await doc.ref.update({ userId: nameToUid[data.userId] });
          console.log(`Updated feedback ${doc.id}: userId '${data.userId}' -> '${nameToUid[data.userId]}'`);
          feedbackUpdates++;
        } catch (err) {
          console.error(`Failed to update feedback ${doc.id}:`, err);
        }
      }
    }

    console.log(`Migration complete! Updated ${interviewUpdates} interviews and ${feedbackUpdates} feedback documents.`);
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

migrateUserIds(); 