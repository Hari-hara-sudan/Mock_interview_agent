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

async function superAggressiveTemplateBlocker() {
  try {
    console.log('🛡️ SUPER AGGRESSIVE TEMPLATE BLOCKER - ACTIVATED');
    console.log('🚫 This will PREVENT any document with template field from existing\n');
    
    const db = initFirebaseAdmin();
    const interviewsRef = db.collection('interviews');
    
    // Clean up all existing documents first
    console.log('1️⃣ CLEANING ALL EXISTING DOCUMENTS...');
    const snapshot = await interviewsRef.get();
    
    const batch = db.batch();
    let cleanupCount = 0;
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      
      if (data.hasOwnProperty('template')) {
        console.log(`🧹 Cleaning: ${doc.id} (template: ${data.template})`);
        batch.update(doc.ref, {
          template: FieldValue.delete()
        });
        cleanupCount++;
      }
    });
    
    if (cleanupCount > 0) {
      await batch.commit();
      console.log(`✅ Cleaned ${cleanupCount} documents\n`);
    }
    
    // Set up ultra-aggressive monitoring
    console.log('2️⃣ SETTING UP ULTRA-AGGRESSIVE MONITORING...');
    console.log('🔥 ANY document with template field will be IMMEDIATELY corrected');
    console.log('⚡ Template fields will be deleted within MILLISECONDS\n');
    
    // Monitor with immediate action
    const unsubscribe = interviewsRef.onSnapshot(async (snapshot) => {
      for (const change of snapshot.docChanges()) {
        if (change.type === 'added' || change.type === 'modified') {
          const doc = change.doc;
          const data = doc.data();
          
          // IMMEDIATE ACTION on template field
          if (data.hasOwnProperty('template')) {
            console.log('\n🚨 IMMEDIATE THREAT DETECTED!');
            console.log(`📍 Document: ${doc.id}`);
            console.log(`⚠️ Template: ${data.template}`);
            console.log(`⚠️ UserId: ${data.userId}`);
            
            // INSTANTLY remove template field
            try {
              await doc.ref.update({
                template: FieldValue.delete()
              });
              console.log('✅ THREAT ELIMINATED - Template field destroyed');
              
              // Also fix userId if null
              if (data.userId === null || data.userId === undefined) {
                console.log('🔧 Also detected null userId - flagging for review');
                await doc.ref.update({
                  needsReview: true,
                  reviewReason: 'Created with null userId - needs manual assignment'
                });
              }
              
            } catch (error) {
              console.error('❌ FAILED TO ELIMINATE THREAT:', error);
            }
            
            console.log('---');
          }
        }
      }
    });
    
    console.log('🔴 BLOCKER IS ACTIVE - Press Ctrl+C to stop');
    console.log('📊 Statistics will be shown every 30 seconds\n');
    
    // Statistics every 30 seconds
    let totalBlocked = 0;
    setInterval(async () => {
      console.log(`📊 Status Report: ${totalBlocked} template fields blocked so far`);
    }, 30000);
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down template blocker...');
      console.log(`📊 Final stats: ${totalBlocked} template fields blocked total`);
      unsubscribe();
      process.exit(0);
    });
    
  } catch (error) {
    console.error('💥 BLOCKER FAILED:', error);
    process.exit(1);
  }
}

// Activate the blocker
superAggressiveTemplateBlocker();