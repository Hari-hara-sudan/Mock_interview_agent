// Simple script to seed aptitude data to Firestore
// Run this manually through Firebase console or via a Next.js API route

const aptitudeQuestions = [
  // Quantitative Questions
  {
    question: "If a man can paint a fence in 6 hours and another man can paint the same fence in 8 hours, how long will it take them to paint it together?",
    options: ["3.42 hours", "3.5 hours", "4 hours", "2.8 hours"],
    correctAnswer: 0,
    explanation: "Combined rate = 1/6 + 1/8 = 7/24 fences per hour. Time = 24/7 ≈ 3.42 hours",
    category: "quantitative",
    difficulty: "medium",
    points: 2,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z"
  },
  {
    question: "What is 15% of 240?",
    options: ["36", "30", "42", "38"],
    correctAnswer: 0,
    explanation: "15% of 240 = (15/100) × 240 = 36",
    category: "quantitative",
    difficulty: "easy",
    points: 1,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z"
  },
  {
    question: "A train travels 60 km in 45 minutes. What is its speed in km/hr?",
    options: ["75 km/hr", "80 km/hr", "85 km/hr", "90 km/hr"],
    correctAnswer: 1,
    explanation: "Speed = Distance/Time = 60 km ÷ (45/60) hr = 60 × (60/45) = 80 km/hr",
    category: "quantitative",
    difficulty: "medium",
    points: 2,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z"
  },
  {
    question: "The ratio of boys to girls in a class is 3:2. If there are 15 boys, how many girls are there?",
    options: ["8", "10", "12", "9"],
    correctAnswer: 1,
    explanation: "If boys:girls = 3:2 and boys = 15, then 3x = 15, so x = 5. Girls = 2x = 10",
    category: "quantitative",
    difficulty: "easy",
    points: 1,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z"
  },
  // Logical Reasoning Questions
  {
    question: "Find the next number in the sequence: 2, 6, 12, 20, 30, ?",
    options: ["40", "42", "44", "46"],
    correctAnswer: 1,
    explanation: "Pattern: 1×2, 2×3, 3×4, 4×5, 5×6, 6×7 = 42",
    category: "logical-reasoning",
    difficulty: "medium",
    points: 2,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z"
  },
  {
    question: "If BOOK is coded as CPPL, how is PEN coded?",
    options: ["QFO", "QEO", "PEO", "QGP"],
    correctAnswer: 0,
    explanation: "Each letter is shifted by +1 in the alphabet: P→Q, E→F, N→O",
    category: "logical-reasoning",
    difficulty: "easy",
    points: 1,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z"
  },
  // Verbal Ability Questions
  {
    question: "Choose the word that best completes the sentence: The mountain climber showed great _____ in reaching the summit despite the harsh weather.",
    options: ["tenacity", "fragility", "hostility", "futility"],
    correctAnswer: 0,
    explanation: "Tenacity means persistence and determination, which fits the context",
    category: "verbal-ability",
    difficulty: "medium",
    points: 2,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z"
  },
  {
    question: "What is the antonym of 'abundant'?",
    options: ["plentiful", "scarce", "generous", "ample"],
    correctAnswer: 1,
    explanation: "Scarce means lacking or insufficient, opposite of abundant",
    category: "verbal-ability",
    difficulty: "easy",
    points: 1,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z"
  },
  // Technical Concepts Questions
  {
    question: "What does HTML stand for?",
    options: ["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlink and Text Markup Language"],
    correctAnswer: 0,
    explanation: "HTML stands for HyperText Markup Language",
    category: "technical-concepts",
    difficulty: "easy",
    points: 1,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z"
  },
  {
    question: "Which data structure follows LIFO (Last In First Out) principle?",
    options: ["Queue", "Stack", "Array", "Linked List"],
    correctAnswer: 1,
    explanation: "Stack follows LIFO principle - the last element added is the first one to be removed",
    category: "technical-concepts",
    difficulty: "easy",
    points: 1,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z"
  }
];

const aptitudeTests = [
  {
    title: "General Aptitude Test",
    description: "Comprehensive assessment covering quantitative, logical reasoning, and verbal abilities",
    categories: ["quantitative", "logical-reasoning", "verbal-ability"],
    questionsPerCategory: 3,
    timeLimit: 30,
    passingScore: 60,
    isActive: true,
    difficulty: "medium",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z"
  },
  {
    title: "Technical Assessment",
    description: "Assessment focused on technical concepts and logical reasoning",
    categories: ["technical-concepts", "logical-reasoning"],
    questionsPerCategory: 2,
    timeLimit: 20,
    passingScore: 70,
    isActive: true,
    difficulty: "medium",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z"
  }
];

console.log('📝 Sample Aptitude Questions:');
console.log(JSON.stringify(aptitudeQuestions, null, 2));

console.log('\n🧪 Sample Aptitude Tests:');
console.log(JSON.stringify(aptitudeTests, null, 2));

console.log('\n📊 Summary:');
console.log(`   - Questions: ${aptitudeQuestions.length}`);
console.log(`   - Tests: ${aptitudeTests.length}`);
console.log(`   - Categories: quantitative, logical-reasoning, verbal-ability, technical-concepts`);

console.log('\n💡 Instructions:');
console.log('   1. Copy the questions data above');
console.log('   2. Go to Firebase Console > Firestore Database');
console.log('   3. Create collection "aptitudeQuestions" and add documents');
console.log('   4. Create collection "aptitudeTests" and add documents');
console.log('   5. Or create an API route to seed this data programmatically');
