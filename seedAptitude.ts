import { db } from './firebase/admin.js';
import { AptitudeQuestion, AptitudeTest } from './types/index.js';

const aptitudeQuestions: Omit<AptitudeQuestion, 'id' | 'createdAt' | 'updatedAt'>[] = [
  // Quantitative Questions
  {
    question: "If a man can paint a fence in 6 hours and another man can paint the same fence in 8 hours, how long will it take them to paint it together?",
    options: ["3.42 hours", "3.5 hours", "4 hours", "2.8 hours"],
    correctAnswer: 0,
    explanation: "Combined rate = 1/6 + 1/8 = 7/24 fences per hour. Time = 24/7 ≈ 3.42 hours",
    category: "quantitative",
    difficulty: "medium",
    points: 2
  },
  {
    question: "What is 15% of 240?",
    options: ["36", "30", "42", "38"],
    correctAnswer: 0,
    explanation: "15% of 240 = (15/100) × 240 = 36",
    category: "quantitative",
    difficulty: "easy",
    points: 1
  },
  {
    question: "A train travels 60 km in 45 minutes. What is its speed in km/hr?",
    options: ["75 km/hr", "80 km/hr", "85 km/hr", "90 km/hr"],
    correctAnswer: 1,
    explanation: "Speed = Distance/Time = 60 km ÷ (45/60) hr = 60 × (60/45) = 80 km/hr",
    category: "quantitative",
    difficulty: "medium",
    points: 2
  },
  {
    question: "If x² + 6x + 9 = 0, what is the value of x?",
    options: ["-3", "3", "-6", "9"],
    correctAnswer: 0,
    explanation: "(x + 3)² = 0, therefore x = -3",
    category: "quantitative",
    difficulty: "medium",
    points: 2
  },
  {
    question: "The ratio of boys to girls in a class is 3:2. If there are 15 boys, how many girls are there?",
    options: ["8", "10", "12", "9"],
    correctAnswer: 1,
    explanation: "If boys:girls = 3:2 and boys = 15, then 3x = 15, so x = 5. Girls = 2x = 10",
    category: "quantitative",
    difficulty: "easy",
    points: 1
  },

  // Logical Reasoning Questions
  {
    question: "All cats are animals. Some animals are dogs. Therefore:",
    options: ["All cats are dogs", "Some cats are dogs", "No cats are dogs", "None of the above can be concluded"],
    correctAnswer: 3,
    explanation: "From the given premises, we cannot conclude any relationship between cats and dogs",
    category: "logical-reasoning",
    difficulty: "medium",
    points: 2
  },
  {
    question: "Find the next number in the sequence: 2, 6, 12, 20, 30, ?",
    options: ["40", "42", "44", "46"],
    correctAnswer: 1,
    explanation: "Pattern: 1×2, 2×3, 3×4, 4×5, 5×6, 6×7 = 42",
    category: "logical-reasoning",
    difficulty: "medium",
    points: 2
  },
  {
    question: "If BOOK is coded as CPPL, how is PEN coded?",
    options: ["QFO", "QEO", "PEO", "QGP"],
    correctAnswer: 0,
    explanation: "Each letter is shifted by +1 in the alphabet: P→Q, E→F, N→O",
    category: "logical-reasoning",
    difficulty: "easy",
    points: 1
  },
  {
    question: "Which word does not belong with the others?",
    options: ["Apple", "Orange", "Carrot", "Banana"],
    correctAnswer: 2,
    explanation: "Carrot is a vegetable, while the others are fruits",
    category: "logical-reasoning",
    difficulty: "easy",
    points: 1
  },
  {
    question: "If A > B, B > C, and C > D, which statement is true?",
    options: ["D > A", "A > D", "C > A", "B > A"],
    correctAnswer: 1,
    explanation: "From the given relationships: A > B > C > D, therefore A > D",
    category: "logical-reasoning",
    difficulty: "easy",
    points: 1
  },

  // Verbal Ability Questions
  {
    question: "Choose the word that best completes the sentence: The mountain climber showed great _____ in reaching the summit despite the harsh weather.",
    options: ["tenacity", "fragility", "hostility", "futility"],
    correctAnswer: 0,
    explanation: "Tenacity means persistence and determination, which fits the context",
    category: "verbal-ability",
    difficulty: "medium",
    points: 2
  },
  {
    question: "What is the antonym of 'abundant'?",
    options: ["plentiful", "scarce", "generous", "ample"],
    correctAnswer: 1,
    explanation: "Scarce means lacking or insufficient, opposite of abundant",
    category: "verbal-ability",
    difficulty: "easy",
    points: 1
  },
  {
    question: "Choose the correctly spelled word:",
    options: ["accomodate", "accommodate", "acommodate", "acomodate"],
    correctAnswer: 1,
    explanation: "The correct spelling is 'accommodate' with double 'c' and double 'm'",
    category: "verbal-ability",
    difficulty: "medium",
    points: 2
  },
  {
    question: "Identify the grammatically correct sentence:",
    options: [
      "Neither of the students were present",
      "Neither of the students was present", 
      "Neither students were present",
      "Neither student were present"
    ],
    correctAnswer: 1,
    explanation: "'Neither' is singular and requires 'was', not 'were'",
    category: "verbal-ability",
    difficulty: "medium",
    points: 2
  },
  {
    question: "What does the idiom 'break the ice' mean?",
    options: ["To literally break ice", "To start a conversation", "To solve a problem", "To make someone angry"],
    correctAnswer: 1,
    explanation: "'Break the ice' means to initiate conversation or make people feel comfortable",
    category: "verbal-ability",
    difficulty: "easy",
    points: 1
  },

  // Technical Concepts Questions
  {
    question: "What does HTML stand for?",
    options: ["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlink and Text Markup Language"],
    correctAnswer: 0,
    explanation: "HTML stands for HyperText Markup Language",
    category: "technical-concepts",
    difficulty: "easy",
    points: 1
  },
  {
    question: "Which data structure follows LIFO (Last In First Out) principle?",
    options: ["Queue", "Stack", "Array", "Linked List"],
    correctAnswer: 1,
    explanation: "Stack follows LIFO principle - the last element added is the first one to be removed",
    category: "technical-concepts",
    difficulty: "easy",
    points: 1
  },
  {
    question: "What is the time complexity of binary search?",
    options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    correctAnswer: 1,
    explanation: "Binary search has O(log n) time complexity as it divides the search space in half each time",
    category: "technical-concepts",
    difficulty: "medium",
    points: 2
  },
  {
    question: "Which of the following is NOT a programming paradigm?",
    options: ["Object-Oriented", "Functional", "Procedural", "Sequential"],
    correctAnswer: 3,
    explanation: "Sequential is not a programming paradigm; it's a way of execution",
    category: "technical-concepts",
    difficulty: "medium",
    points: 2
  },
  {
    question: "What does API stand for?",
    options: ["Application Programming Interface", "Advanced Programming Integration", "Application Process Integration", "Advanced Process Interface"],
    correctAnswer: 0,
    explanation: "API stands for Application Programming Interface",
    category: "technical-concepts",
    difficulty: "easy",
    points: 1
  },

  // Data Interpretation Questions
  {
    question: "A bar chart shows sales for 5 months: Jan(100), Feb(150), Mar(120), Apr(180), May(200). What is the average monthly sales?",
    options: ["150", "160", "170", "140"],
    correctAnswer: 0,
    explanation: "Average = (100+150+120+180+200)/5 = 750/5 = 150",
    category: "data-interpretation",
    difficulty: "easy",
    points: 1
  },
  {
    question: "In a pie chart, if Marketing takes 25% and Sales takes 30%, what percentage do the remaining departments take?",
    options: ["45%", "40%", "50%", "35%"],
    correctAnswer: 0,
    explanation: "Remaining = 100% - 25% - 30% = 45%",
    category: "data-interpretation",
    difficulty: "easy",
    points: 1
  },
  {
    question: "A table shows: Product A sold 200 units at $10 each, Product B sold 150 units at $15 each. What's the total revenue?",
    options: ["$4250", "$4500", "$4000", "$4750"],
    correctAnswer: 0,
    explanation: "Revenue = (200 × $10) + (150 × $15) = $2000 + $2250 = $4250",
    category: "data-interpretation",
    difficulty: "medium",
    points: 2
  },
  {
    question: "A line graph shows temperature: Mon(25°C), Tue(28°C), Wed(22°C), Thu(30°C), Fri(26°C). What's the temperature range?",
    options: ["6°C", "8°C", "5°C", "7°C"],
    correctAnswer: 1,
    explanation: "Range = Highest - Lowest = 30°C - 22°C = 8°C",
    category: "data-interpretation",
    difficulty: "medium",
    points: 2
  },
  {
    question: "In a survey of 500 people, 60% like coffee, 40% like tea, and 20% like both. How many like only coffee?",
    options: ["200", "250", "150", "300"],
    correctAnswer: 0,
    explanation: "Only coffee = Total coffee - Both = (60% × 500) - (20% × 500) = 300 - 100 = 200",
    category: "data-interpretation",
    difficulty: "medium",
    points: 2
  },

  // General Awareness Questions
  {
    question: "Who invented the World Wide Web?",
    options: ["Bill Gates", "Steve Jobs", "Tim Berners-Lee", "Mark Zuckerberg"],
    correctAnswer: 2,
    explanation: "Tim Berners-Lee invented the World Wide Web in 1989",
    category: "general-awareness",
    difficulty: "medium",
    points: 2
  },
  {
    question: "What is the capital of Australia?",
    options: ["Sydney", "Melbourne", "Canberra", "Perth"],
    correctAnswer: 2,
    explanation: "Canberra is the capital city of Australia",
    category: "general-awareness",
    difficulty: "easy",
    points: 1
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1,
    explanation: "Mars is known as the Red Planet due to its reddish appearance",
    category: "general-awareness",
    difficulty: "easy",
    points: 1
  },
  {
    question: "What does 'www' stand for in web addresses?",
    options: ["World Wide Web", "World Wide Wait", "World Wide Width", "World Wide Wire"],
    correctAnswer: 0,
    explanation: "WWW stands for World Wide Web",
    category: "general-awareness",
    difficulty: "easy",
    points: 1
  },
  {
    question: "Which company developed the Android operating system?",
    options: ["Apple", "Microsoft", "Google", "Samsung"],
    correctAnswer: 2,
    explanation: "Google developed the Android operating system",
    category: "general-awareness",
    difficulty: "easy",
    points: 1
  }
];

const aptitudeTests: Omit<AptitudeTest, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: "General Aptitude Test",
    description: "Comprehensive assessment covering quantitative, logical reasoning, and verbal abilities",
    categories: ["quantitative", "logical-reasoning", "verbal-ability"],
    questionsPerCategory: 5,
    timeLimit: 45, // minutes
    passingScore: 60,
    isActive: true,
    difficulty: "medium"
  },
  {
    title: "Technical Aptitude Test",
    description: "Assessment focused on technical concepts and problem-solving skills",
    categories: ["technical-concepts", "logical-reasoning", "quantitative"],
    questionsPerCategory: 4,
    timeLimit: 30,
    passingScore: 70,
    isActive: true,
    difficulty: "medium"
  },
  {
    title: "Data Analysis Test",
    description: "Test your data interpretation and analytical skills",
    categories: ["data-interpretation", "quantitative", "logical-reasoning"],
    questionsPerCategory: 3,
    timeLimit: 25,
    passingScore: 65,
    isActive: true,
    difficulty: "medium"
  },
  {
    title: "Complete Assessment",
    description: "Full aptitude test covering all major areas",
    categories: ["quantitative", "logical-reasoning", "verbal-ability", "technical-concepts", "data-interpretation", "general-awareness"],
    questionsPerCategory: 3,
    timeLimit: 60,
    passingScore: 60,
    isActive: true,
    difficulty: "hard"
  },
  {
    title: "Quick Reasoning Test",
    description: "Fast-paced logical reasoning assessment",
    categories: ["logical-reasoning"],
    questionsPerCategory: 10,
    timeLimit: 20,
    passingScore: 70,
    isActive: true,
    difficulty: "easy"
  }
];

export async function seedAptitudeData() {
  console.log('🌱 Starting to seed aptitude data...');

  try {
    // Seed questions
    console.log('📝 Seeding aptitude questions...');
    const questionBatch = db.batch();
    
    for (const question of aptitudeQuestions) {
      const questionRef = db.collection('aptitudeQuestions').doc();
      const questionData = {
        ...question,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      questionBatch.set(questionRef, questionData);
    }
    
    await questionBatch.commit();
    console.log(`✅ Successfully seeded ${aptitudeQuestions.length} questions`);

    // Seed tests
    console.log('🧪 Seeding aptitude tests...');
    const testBatch = db.batch();
    
    for (const test of aptitudeTests) {
      const testRef = db.collection('aptitudeTests').doc();
      const testData = {
        ...test,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      testBatch.set(testRef, testData);
    }
    
    await testBatch.commit();
    console.log(`✅ Successfully seeded ${aptitudeTests.length} tests`);

    console.log('🎉 Aptitude data seeding completed successfully!');
    console.log('📊 Summary:');
    console.log(`   - Questions: ${aptitudeQuestions.length}`);
    console.log(`   - Tests: ${aptitudeTests.length}`);
    console.log(`   - Categories: 6 (quantitative, logical-reasoning, verbal-ability, technical-concepts, data-interpretation, general-awareness)`);
    
  } catch (error) {
    console.error('❌ Error seeding aptitude data:', error);
    throw error;
  }
}

// Run the seeding if this file is executed directly
if (require.main === module) {
  seedAptitudeData()
    .then(() => {
      console.log('Seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}
