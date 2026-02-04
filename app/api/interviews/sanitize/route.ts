import { NextRequest, NextResponse } from 'next/server';
import { auth as adminAuth, db } from '@/firebase/admin';

// Server-side sanitizer to remove stray 'template' fields on interview docs.
// Verifies the session cookie and ownership before writing.
export async function POST(req: NextRequest) {
  try {
    const { interviewId } = await req.json();
    if (!interviewId) {
      return NextResponse.json({ success: false, message: 'Missing interviewId' }, { status: 400 });
    }

    const sessionCookie = req.cookies.get('session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
    }

    // Verify session cookie
    const claims = await adminAuth.verifySessionCookie(sessionCookie, true);

    const ref = db.collection('interviews').doc(interviewId);
    const snap = await ref.get();
    if (!snap.exists) {
      return NextResponse.json({ success: false, message: 'Interview not found' }, { status: 404 });
    }

    const data = snap.data() as any;
    if (data.userId !== claims.uid) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const updates: Record<string, any> = {};
    let needsUpdate = false;

    if (Object.prototype.hasOwnProperty.call(data, 'template')) {
      updates['template'] = adminAuth.app.options.credential ? (adminAuth as any).FIELD_VALUE?.delete() : null;
      // Fallback: If FieldValue.delete() not reachable from adminAuth, do an explicit field deletion via update with FieldValue
      needsUpdate = true;
    }

    // Minimal approach: use Firestore FieldValue.delete()
    if (needsUpdate) {
      const { FieldValue } = await import('firebase-admin/firestore');
      await ref.update({ template: FieldValue.delete() });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Sanitize error:', error);
    return NextResponse.json({ success: false, message: 'Internal error' }, { status: 500 });
  }
}
