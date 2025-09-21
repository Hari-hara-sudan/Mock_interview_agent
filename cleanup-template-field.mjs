import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, writeBatch, doc } from 'firebase/firestore';

// Use your existing Firebase config
const firebaseConfig = {
  // You'll need to add your Firebase config here
  // or import it from your existing config
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function removeTemplateField() {
  try {
    console.log('Starting cleanup: Removing template field from all interview documents...');
    
    // Get all documents from the interviews collection
    const interviewsRef = collection(db, 'interviews');
    const snapshot = await getDocs(interviewsRef);
    
    if (snapshot.empty) {
      console.log('No documents found in interviews collection.');
      return;
    }
    
    const batch = writeBatch(db);
    let count = 0;
    
    snapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      
      // Check if the document has a template field
      if (data.hasOwnProperty('template')) {
        console.log(`Removing template field from document: ${docSnapshot.id}`);
        
        // Create a new object without the template field
        const updatedData = { ...data };
        delete updatedData.template;
        
        // Add to batch update
        const docRef = doc(db, 'interviews', docSnapshot.id);
        batch.set(docRef, updatedData);
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
  }
}

// Run the cleanup
removeTemplateField();