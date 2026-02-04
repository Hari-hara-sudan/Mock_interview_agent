// Real-time Template Field Blocker - Client Side
// This runs in your Next.js app and monitors Firestore for template fields
"use client"
import { useEffect } from 'react';
import { auth, db } from '@/firebase/client';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export function useTemplateFieldBlocker() {
  useEffect(() => {
    // Feature flag: allow disabling the watcher entirely via env
    if (process.env.NEXT_PUBLIC_TEMPLATE_BLOCKER_ENABLED !== 'true') {
      return;
    }

    console.log('🛡️ Template Field Blocker - Starting real-time monitoring...');
    
    // Wait for auth; only monitor the current user's interviews
    let unsubSnapshot: undefined | (() => void);
    const off = onAuthStateChanged(auth, (user) => {
      if (!user) {
        console.log('🔒 Template Field Blocker: user not signed in; skipping');
        // If user signs out, ensure any active listener is stopped
        if (unsubSnapshot) { try { unsubSnapshot(); } catch {} }
        return;
      }

      const q = query(collection(db, 'interviews'), where('userId', '==', user.uid));
      unsubSnapshot = onSnapshot(
        q,
        async (snapshot) => {
          for (const change of snapshot.docChanges()) {
            if (change.type === 'added' || change.type === 'modified') {
              const docData = change.doc.data() as Record<string, any>;
              const docId = change.doc.id;

              if (Object.prototype.hasOwnProperty.call(docData, 'template')) {
                console.log('🚨 TEMPLATE FIELD DETECTED (owned doc). Requesting server cleanup for:', docId);
                try {
                  const res = await fetch('/api/interviews/sanitize', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ interviewId: docId })
                  });
                  if (!res.ok) {
                    const text = await res.text();
                    console.error('❌ Server cleanup failed:', res.status, text);
                  }
                } catch (e) {
                  console.error('❌ Failed to call sanitize endpoint:', e);
                }
              }
            }
          }
        },
        (error) => {
          // Log once and back off; permission errors can be caused by rules
          console.error('Template blocker snapshot error:', error);
        }
      );

      // Cleanup when auth user changes or unmounts
      return () => {
        try { if (unsubSnapshot) unsubSnapshot(); } catch {}
      };
    });

    return () => {
      console.log('🛑 Template Field Blocker stopped');
      try { off(); } catch {}
    };
  }, []);
}

// Hook to be used in your main layout or app component
export default function TemplateFieldBlocker() {
  useTemplateFieldBlocker();
  return null; // This component doesn't render anything
}