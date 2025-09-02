# Firestore Indexes Deployment Script (PowerShell)
# This script deploys the indexes defined in firestore.indexes.json

Write-Host "🔥 Deploying Firestore Indexes..." -ForegroundColor Yellow

# Check if Firebase CLI is installed
try {
    firebase --version | Out-Null
} catch {
    Write-Host "❌ Firebase CLI not installed. Please install it first:" -ForegroundColor Red
    Write-Host "npm install -g firebase-tools" -ForegroundColor Cyan
    exit 1
}

# Check if logged in
try {
    firebase projects:list | Out-Null
} catch {
    Write-Host "❌ Not logged in to Firebase. Please login first:" -ForegroundColor Red
    Write-Host "firebase login" -ForegroundColor Cyan
    exit 1
}

# Deploy indexes
Write-Host "📄 Deploying indexes from firestore.indexes.json..." -ForegroundColor Blue
firebase deploy --only firestore:indexes

Write-Host "✅ Firestore indexes deployment completed!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Deployed indexes for collections:" -ForegroundColor Cyan
Write-Host "   - aptitudeTests (isActive + createdAt)" -ForegroundColor White
Write-Host "   - aptitudeQuestions (category)" -ForegroundColor White
Write-Host "   - aptitudeAttempts (userId + startedAt)" -ForegroundColor White
Write-Host "   - interviews (template + createdAt, userId + template + createdAt)" -ForegroundColor White
Write-Host "   - feedback (interviewId + userId)" -ForegroundColor White
Write-Host "   - challenges (difficulty/type + createdAt, supportedLanguages + createdAt)" -ForegroundColor White
Write-Host "   - submissions (userId + challengeId + submittedAt, challengeId + submittedAt, userId + submittedAt)" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Your Firestore database is now optimized for queries!" -ForegroundColor Green
