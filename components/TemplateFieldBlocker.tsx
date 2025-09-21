// Real-time Template Field Blocker - Client Side
// This runs in your Next.js app and monitors Firestore for template fields
"use client"
import { useEffect } from 'react';
import { db } from '@/firebase/client';
import { collection, onSnapshot, doc, updateDoc, deleteField } from 'firebase/firestore';

export function useTemplateFieldBlocker() {
  useEffect(() => {
    console.log('🛡️ Template Field Blocker - Starting real-time monitoring...');
    
    // Monitor interviews collection for template fields
    const unsubscribe = onSnapshot(
      collection(db, 'interviews'),
      async (snapshot) => {
        for (const change of snapshot.docChanges()) {
          if (change.type === 'added' || change.type === 'modified') {
            const docData = change.doc.data();
            const docId = change.doc.id;
            
            // Check if document has template field
            if (docData.hasOwnProperty('template')) {
              console.log('🚨 TEMPLATE FIELD DETECTED! Removing from:', docId);
              console.log('Document data:', docData);
              
              try {
                // Remove template field immediately
                await updateDoc(doc(db, 'interviews', docId), {
                  template: deleteField()
                });
                
                console.log('✅ Template field removed from:', docId);
                
                // Also handle null userId if present
                if (docData.userId === null || docData.userId === undefined || docData.userId === '{{userid}}') {
                  console.log('⚠️ Also fixing null/placeholder userId in:', docId);
                  await updateDoc(doc(db, 'interviews', docId), {
                    needsUserIdFix: true,
                    fixedAt: new Date().toISOString()
                  });
                }
                
              } catch (error) {
                console.error('❌ Failed to remove template field:', error);
              }
            }
          }
        }
      },
      (error) => {
        console.error('Template blocker error:', error);
      }
    );
    
    return () => {
      console.log('🛑 Template Field Blocker stopped');
      unsubscribe();
    };
  }, []);
}

// Hook to be used in your main layout or app component
export default function TemplateFieldBlocker() {
  useTemplateFieldBlocker();
  return null; // This component doesn't render anything
}