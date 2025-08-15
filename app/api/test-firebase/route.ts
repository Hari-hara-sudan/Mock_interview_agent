import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/firebase/admin';

export async function GET() {
  try {
    // Test Firebase connection by trying to access a collection
    const testCollection = db.collection('test');
    const snapshot = await testCollection.limit(1).get();
    
    // Check if we can write to the database
    const testDoc = await testCollection.add({
      test: true,
      timestamp: new Date().toISOString(),
      message: 'Firebase connection test successful'
    });

    // Delete the test document
    await testDoc.delete();

    return NextResponse.json({
      success: true,
      message: 'Firebase connection is working properly',
      projectId: process.env.FIREBASE_PROJECT_ID,
      connected: true
    });

  } catch (error) {
    console.error('Firebase connection error:', error);
    return NextResponse.json({
      success: false,
      message: 'Firebase connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      connected: false
    }, { status: 500 });
  }
}
