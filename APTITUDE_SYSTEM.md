# Aptitude Testing System

## Overview
The aptitude testing system is a comprehensive assessment platform that evaluates users across multiple skill areas with timed tests, detailed scoring, and performance analytics.

## Features
- **Multiple Categories**: Quantitative, Logical Reasoning, Verbal Ability, Technical Concepts, Data Interpretation, General Awareness
- **Timed Tests**: Configurable time limits for realistic exam conditions
- **Instant Feedback**: Immediate results with explanations
- **Performance Analytics**: Category-wise breakdown and progress tracking
- **Flexible Test Configuration**: Customizable questions per category and difficulty levels

## System Components

### 1. Types (`types/index.d.ts`)
- `AptitudeCategory`: Union type for test categories
- `AptitudeQuestion`: Question structure with options, correct answers, explanations
- `AptitudeTest`: Test configuration with categories, time limits, passing scores
- `AptitudeAttempt`: User attempt tracking with answers and scoring

### 2. Server Actions (`lib/actions/aptitude.action.ts`)
- `getAptitudeTests()`: Fetch available tests
- `startAptitudeTest()`: Initialize a new test attempt
- `submitAnswer()`: Record individual question responses
- `finishAptitudeTest()`: Calculate final scores and complete attempt
- `getAptitudeAttempt()`: Retrieve attempt results

### 3. UI Components
- `AptitudeTestCard`: Display test information and start button
- `AptitudeQuestionComponent`: Interactive question interface with timer
- `AptitudeResults`: Comprehensive results display with analytics

### 4. Routes
- `/aptitude`: Main tests listing page
- `/aptitude/test/[testId]`: Test taking interface
- `/aptitude/results/[attemptId]`: Results and analytics page

## Database Schema

### aptitudeQuestions Collection
```json
{
  "id": "auto-generated",
  "question": "string",
  "options": ["option1", "option2", "option3", "option4"],
  "correctAnswer": 0, // index of correct option
  "explanation": "string",
  "category": "quantitative|logical-reasoning|verbal-ability|technical-concepts|data-interpretation|general-awareness",
  "difficulty": "easy|medium|hard",
  "points": 1, // points awarded for correct answer
  "createdAt": "ISO string",
  "updatedAt": "ISO string"
}
```

### aptitudeTests Collection
```json
{
  "id": "auto-generated",
  "title": "string",
  "description": "string",
  "categories": ["category1", "category2"],
  "questionsPerCategory": 5,
  "timeLimit": 30, // minutes
  "passingScore": 60, // percentage
  "difficulty": "easy|medium|hard",
  "isActive": true,
  "createdAt": "ISO string",
  "updatedAt": "ISO string"
}
```

### aptitudeAttempts Collection
```json
{
  "id": "auto-generated",
  "userId": "string",
  "testId": "string",
  "startedAt": "ISO string",
  "finishedAt": "ISO string",
  "answers": [
    {
      "questionId": "string",
      "selectedOption": 0,
      "timeTaken": 45, // seconds
      "isCorrect": true
    }
  ],
  "score": {
    "total": 10,
    "correct": 8,
    "percentage": 80,
    "categoryBreakdown": [
      {
        "category": "quantitative",
        "correct": 3,
        "total": 4,
        "percentage": 75
      }
    ]
  },
  "status": "in-progress|completed",
  "timeRemaining": 1800 // seconds
}
```

## Sample Data Setup

To populate the database with sample data, you can:

1. **Use the API route**: 
   ```bash
   POST /api/aptitude/seed
   Body: { "action": "seed-all" }
   ```

2. **Manual Firebase Console**:
   - Run `node aptitude-seed-data.js` to see sample data
   - Copy the JSON output to Firebase Console

3. **Sample Questions Available**:
   - 10 sample questions across 4 categories
   - 2 sample tests with different configurations
   - Proper difficulty levels and point assignments

## Test Flow

1. **User Access**: Navigate to `/aptitude`
2. **Test Selection**: Choose from available tests
3. **Test Start**: Initialize attempt and load questions
4. **Question Answering**: Navigate through questions with timer
5. **Test Completion**: Submit all answers or auto-submit on timeout
6. **Results Display**: View detailed performance analytics

## Configuration

Tests can be configured with:
- **Categories**: Which question types to include
- **Questions per Category**: How many questions from each category
- **Time Limit**: Total test duration in minutes
- **Passing Score**: Minimum percentage to pass
- **Difficulty Level**: Overall test difficulty indication

## Integration

The aptitude system integrates with:
- **Authentication**: User sessions for attempt tracking
- **Firebase**: Question storage and attempt persistence
- **Home Page**: Quick access card for aptitude tests
- **Navigation**: Seamless flow between test stages

## Usage Example

```typescript
// Start a test
const { attempt, questions } = await startAptitudeTest({
  userId: "user123",
  testId: "test456"
});

// Submit an answer
await submitAnswer({
  attemptId: attempt.id,
  questionId: "q1",
  selectedOption: 2,
  timeTaken: 45
});

// Finish test
const finalResult = await finishAptitudeTest(attempt.id);
```

## Benefits

- **Comprehensive Assessment**: Multiple skill areas in one platform
- **Real Exam Conditions**: Timed tests with immediate feedback
- **Progress Tracking**: Historical performance and improvement trends
- **Flexible Configuration**: Customizable tests for different purposes
- **Professional Results**: Detailed analytics and category breakdowns
