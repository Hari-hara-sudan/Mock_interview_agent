const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

// Block template field at the database level
exports.blockTemplateField = functions.firestore
  .document('interviews/{docId}')
  .onWrite(async (change, context) => {
    const after = change.after;
    const data = after.exists ? after.data() : null;
    
    if (data && data.hasOwnProperty('template')) {
      console.log(`🚫 Blocking template field in ${context.params.docId}`);
      
      // Remove template field immediately
      await after.ref.update({
        template: admin.firestore.FieldValue.delete()
      });
      
      console.log(`✅ Template field removed from ${context.params.docId}`);
    }
    
    return null;
  });