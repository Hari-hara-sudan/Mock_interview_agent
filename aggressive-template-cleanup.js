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

async function aggressiveTemplateCleanup() {
  try {
    console.log('🧹 AGGRESSIVE TEMPLATE CLEANUP STARTING...');
    
    const db = initFirebaseAdmin();
    
    // Get ALL documents from the interviews collection
    const interviewsRef = db.collection('interviews');
    const snapshot = await interviewsRef.get();
    
    if (snapshot.empty) {
      console.log('No documents found in interviews collection.');
      return;
    }
    
    console.log(`📄 Found ${snapshot.size} total documents in interviews collection`);
    
    let documentsWithTemplate = 0;
    let documentsWithNullUserId = 0;
    let documentsToUpdate = [];
    
    // First, analyze what we have
    snapshot.forEach((doc) => {
      const data = doc.data();
      console.log(`\n📋 Document: ${doc.id}`);
      console.log(`   - userId: ${data.userId || 'NULL'}`);
      console.log(`   - template: ${data.template !== undefined ? data.template : 'UNDEFINED'}`);
      console.log(`   - role: ${data.role || 'N/A'}`);
      console.log(`   - createdAt: ${data.createdAt || 'N/A'}`);
      
      if (data.hasOwnProperty('template')) {
        documentsWithTemplate++;
        documentsToUpdate.push(doc);
      }
      
      if (!data.userId || data.userId === null) {
        documentsWithNullUserId++;
      }
    });
    
    console.log(`\n📊 ANALYSIS:`);
    console.log(`   - Documents with template field: ${documentsWithTemplate}`);
    console.log(`   - Documents with null userId: ${documentsWithNullUserId}`);
    console.log(`   - Documents to update: ${documentsToUpdate.length}`);
    
    if (documentsToUpdate.length === 0) {
      console.log('✅ No documents found with template field. Already clean!');
      return;
    }
    
    // Batch update to remove template fields
    const batch = db.batch();
    
    documentsToUpdate.forEach((doc) => {
      console.log(`🔧 Scheduling template field removal for: ${doc.id}`);
      batch.update(doc.ref, {
        template: FieldValue.delete()
      });
    });
    
    console.log(`\n🚀 Updating ${documentsToUpdate.length} documents...`);
    await batch.commit();
    console.log(`✅ Successfully removed template field from ${documentsToUpdate.length} documents.`);
    
    // Verify cleanup
    console.log('\n🔍 VERIFICATION: Re-checking collection...');
    const verifySnapshot = await interviewsRef.get();
    let remainingTemplateFields = 0;
    
    verifySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.hasOwnProperty('template')) {
        remainingTemplateFields++;
        console.log(`⚠️  Document ${doc.id} still has template field: ${data.template}`);
      }
    });
    
    if (remainingTemplateFields === 0) {
      console.log('🎉 CLEANUP SUCCESSFUL! No template fields remain.');
    } else {
      console.log(`❌ ${remainingTemplateFields} documents still have template field.`);
    }
    
  } catch (error) {
    console.error('💥 Error during aggressive cleanup:', error);
  } finally {
    console.log('\n🏁 Aggressive cleanup completed.');
    process.exit(0);
  }
}

// Run the aggressive cleanup
aggressiveTemplateCleanup();