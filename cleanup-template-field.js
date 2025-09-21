require('dotenv').config({ path: '.env.local' });
const { initializeApp, getApps, cert } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

// Initialize Firebase Admin SDK using your existing config
function initFirebaseAdmin() {
  console.log('Checking environment variables...');
  console.log('PROJECT_ID:', process.env.FIREBASE_PROJECT_ID);
  console.log('CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL);
  console.log('PRIVATE_KEY exists:', !!process.env.FIREBASE_PRIVATE_KEY);
  
  const apps = getApps();

  if (!apps.length) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Replace newlines in the private key
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
  }

  return getFirestore();
}

async function removeTemplateField() {
  try {
    console.log('Starting cleanup: Removing template field from all interview documents...');
    
    const db = initFirebaseAdmin();
    
    // Get all documents from the interviews collection
    const interviewsRef = db.collection('interviews');
    const snapshot = await interviewsRef.get();
    
    if (snapshot.empty) {
      console.log('No documents found in interviews collection.');
      return;
    }
    
    const batch = db.batch();
    let count = 0;
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      
      // Check if the document has a template field
      if (data.hasOwnProperty('template')) {
        console.log(`Removing template field from document: ${doc.id}`);
        console.log(`  Current data:`, { 
          id: doc.id, 
          template: data.template, 
          userId: data.userId,
          role: data.role 
        });
        
        // Use FieldValue.delete() to remove the field
        batch.update(doc.ref, {
          template: FieldValue.delete()
        });
        count++;
      }
    });
    
    if (count > 0) {
      console.log(`Updating ${count} documents...`);
      await batch.commit();
      console.log(`Successfully removed template field from ${count} documents.`);
    } else {
      console.log('No documents found with template field.');
    }
    
  } catch (error) {
    console.error('Error removing template field:', error);
  } finally {
    console.log('Cleanup completed.');
    process.exit(0);
  }
}

// Run the cleanup
removeTemplateField();