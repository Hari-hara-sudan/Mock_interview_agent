require('dotenv').config({ path: '.env.local' });
const { initializeApp, getApps, cert } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

// Initialize Firebase Admin SDK
function initFirebaseAdmin() {
  const apps = getApps();

  if (!apps.length) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
  }

  return getFirestore();
}

async function monitorAndCleanupTemplateFields() {
  try {
    console.log('🔍 ULTIMATE TEMPLATE CLEANUP - Starting real-time monitoring...');
    
    const db = initFirebaseAdmin();
    const interviewsRef = db.collection('interviews');
    
    // First, clean up all existing documents
    console.log('\n1️⃣ CLEANING UP EXISTING DOCUMENTS...');
    const snapshot = await interviewsRef.get();
    
    let cleanupCount = 0;
    const batch = db.batch();
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      
      if (data.hasOwnProperty('template')) {
        console.log(`❌ FOUND TEMPLATE FIELD in ${doc.id}:`, {
          id: doc.id,
          template: data.template,
          userId: data.userId,
          role: data.role,
          createdAt: data.createdAt
        });
        
        batch.update(doc.ref, {
          template: FieldValue.delete()
        });
        cleanupCount++;
      }
    });
    
    if (cleanupCount > 0) {
      console.log(`🧹 Cleaning up ${cleanupCount} documents with template field...`);
      await batch.commit();
      console.log(`✅ Cleanup complete!`);
    } else {
      console.log('✅ No documents found with template field');
    }
    
    // Now set up real-time monitoring
    console.log('\n2️⃣ SETTING UP REAL-TIME MONITORING...');
    console.log('🔥 Listening for new documents with template field...');
    console.log('💡 Create a new interview to test - I will catch it instantly!\n');
    
    // Listen for new documents
    const unsubscribe = interviewsRef.onSnapshot(async (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === 'added' || change.type === 'modified') {
          const doc = change.doc;
          const data = doc.data();
          
          // Check if this document has template field
          if (data.hasOwnProperty('template')) {
            console.log('\n🚨 ALERT: NEW DOCUMENT WITH TEMPLATE FIELD DETECTED!');
            console.log('📋 Document details:', {
              id: doc.id,
              template: data.template,
              userId: data.userId,
              role: data.role,
              type: data.type,
              level: data.level,
              createdAt: data.createdAt,
              finalized: data.finalized,
              timestamp: new Date().toISOString()
            });
            
            // Immediately remove the template field
            try {
              await doc.ref.update({
                template: FieldValue.delete()
              });
              console.log('✅ TEMPLATE FIELD AUTOMATICALLY REMOVED!');
            } catch (error) {
              console.error('❌ Error removing template field:', error);
            }
            
            console.log('---');
          } else {
            console.log(`✅ New clean document created: ${doc.id} (no template field)`);
          }
        }
      });
    });
    
    // Keep the script running
    console.log('⏰ Monitoring active. Press Ctrl+C to stop.');
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n🛑 Stopping monitoring...');
      unsubscribe();
      process.exit(0);
    });
    
  } catch (error) {
    console.error('💥 Error in monitoring:', error);
    process.exit(1);
  }
}

// Run the monitor
monitorAndCleanupTemplateFields();