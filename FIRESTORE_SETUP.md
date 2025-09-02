# Firestore Database Setup

This guide helps you set up Firestore indexes and collections for the Voice Interview Agent project.

## 📋 Required Collections

Your Firestore database needs these collections:

### Core Collections
- **users** - User profiles and authentication data
- **interviews** - Generated interview questions and templates
- **feedback** - Interview feedback and scores
- **messages** - Interview transcripts and conversations

### Aptitude System Collections
- **aptitudeTests** - Test configurations and metadata
- **aptitudeQuestions** - Question bank with categories
- **aptitudeAttempts** - User test attempts and scores

### Programming Challenges Collections
- **challenges** - Challenge problems and test cases
- **submissions** - Code submissions and results
- **userChallengeProgress** - User progress tracking

## 🔥 Deploy Firestore Indexes

### Prerequisites
1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project (if not done):
   ```bash
   firebase init firestore
   ```

### Deploy Indexes

**Option 1: Using the deployment script (Windows)**
```powershell
.\deploy-indexes.ps1
```

**Option 2: Using Firebase CLI directly**
```bash
firebase deploy --only firestore:indexes
```

**Option 3: Manual deployment**
1. Copy the contents of `firestore.indexes.json`
2. Go to [Firebase Console](https://console.firebase.google.com)
3. Navigate to Firestore Database > Indexes
4. Import the index definitions

## 📊 Index Overview

### Aptitude System Indexes
- `aptitudeTests`: `isActive` + `createdAt` (DESC)
- `aptitudeQuestions`: `category`
- `aptitudeAttempts`: `userId` + `startedAt` (DESC)

### Interview System Indexes
- `interviews`: `template` + `createdAt` (DESC)
- `interviews`: `userId` + `template` + `createdAt` (DESC)
- `feedback`: `interviewId` + `userId`

### Challenge System Indexes
- `challenges`: `difficulty` + `createdAt` (DESC)
- `challenges`: `type` + `createdAt` (DESC)
- `challenges`: `supportedLanguages` (array-contains) + `createdAt` (DESC)
- `submissions`: `userId` + `challengeId` + `submittedAt` (DESC)
- `submissions`: `challengeId` + `submittedAt` (DESC)
- `submissions`: `userId` + `submittedAt` (DESC)

## 🌱 Seed Sample Data

### Aptitude Questions
Run the seeding API or script:
```bash
# Using API endpoint
curl -X POST http://localhost:3000/api/aptitude/seed \
  -H "Content-Type: application/json" \
  -d '{"action": "seed-all"}'

# Or run the seed script
node aptitude-seed-data.js
```

### Challenges
The challenges are seeded from the static data in your training pages.

## 🚨 Security Rules

Make sure your Firestore security rules allow authenticated users to:
- Read/write their own data in `users`, `aptitudeAttempts`, `submissions`
- Read public data from `aptitudeTests`, `aptitudeQuestions`, `challenges`
- Read template interviews where `template == true`

Example security rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Public read access for tests and questions
    match /aptitudeTests/{testId} {
      allow read: if request.auth != null;
    }

    match /aptitudeQuestions/{questionId} {
      allow read: if request.auth != null;
    }

    // Users can read/write their own attempts
    match /aptitudeAttempts/{attemptId} {
      allow read, write: if request.auth != null &&
        resource.data.userId == request.auth.uid;
    }

    // Template interviews are public, user interviews are private
    match /interviews/{interviewId} {
      allow read: if request.auth != null && (
        resource.data.template == true ||
        resource.data.userId == request.auth.uid
      );
      allow write: if request.auth != null;
    }

    // Feedback is private to the user
    match /feedback/{feedbackId} {
      allow read, write: if request.auth != null &&
        resource.data.userId == request.auth.uid;
    }

    // Challenges are public read
    match /challenges/{challengeId} {
      allow read: if request.auth != null;
    }

    // Submissions are private to the user
    match /submissions/{submissionId} {
      allow read, write: if request.auth != null &&
        resource.data.userId == request.auth.uid;
    }
  }
}
```

## 🔍 Testing the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Visit the Firebase status page:
   ```
   http://localhost:3000/firebase-status
   ```

3. Test the connection and verify collections are accessible.

## 🆘 Troubleshooting

### Index Creation Errors
- Ensure you're authenticated: `firebase login`
- Verify project selection: `firebase use <project-id>`
- Check permissions in Firebase Console

### Query Performance Issues
- Monitor query performance in Firebase Console
- Add composite indexes for complex queries
- Use `explain` mode to analyze query plans

### Collection Access Issues
- Verify Firestore security rules
- Check user authentication status
- Ensure environment variables are set correctly

## 📚 Additional Resources

- [Firestore Indexes Documentation](https://firebase.google.com/docs/firestore/query-data/indexing)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
