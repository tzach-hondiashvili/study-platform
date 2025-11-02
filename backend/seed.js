// Seed the database with sample questions
const { Question, Answer, sequelize } = require('./models');

const sampleQuestions = [
  {
    text: 'What is the capital of France?',
    answers: [
      { text: 'Paris', isCorrect: true },
      { text: 'London', isCorrect: false },
      { text: 'Berlin', isCorrect: false },
      { text: 'Madrid', isCorrect: false },
    ],
  },
  {
    text: 'Which planet is known as the Red Planet?',
    answers: [
      { text: 'Mars', isCorrect: true },
      { text: 'Venus', isCorrect: false },
      { text: 'Jupiter', isCorrect: false },
      { text: 'Saturn', isCorrect: false },
    ],
  },
  {
    text: 'What is 2 + 2?',
    answers: [
      { text: '4', isCorrect: true },
      { text: '3', isCorrect: false },
      { text: '5', isCorrect: false },
      { text: '22', isCorrect: false },
    ],
  },
  {
    text: 'Who wrote "Romeo and Juliet"?',
    answers: [
      { text: 'William Shakespeare', isCorrect: true },
      { text: 'Charles Dickens', isCorrect: false },
      { text: 'Jane Austen', isCorrect: false },
      { text: 'Mark Twain', isCorrect: false },
    ],
  },
  {
    text: 'What is the largest ocean on Earth?',
    answers: [
      { text: 'Pacific Ocean', isCorrect: true },
      { text: 'Atlantic Ocean', isCorrect: false },
      { text: 'Indian Ocean', isCorrect: false },
      { text: 'Arctic Ocean', isCorrect: false },
    ],
  },
  {
    text: 'Which programming language is known for its use in web development?',
    answers: [
      { text: 'JavaScript', isCorrect: true },
      { text: 'Assembly', isCorrect: false },
      { text: 'COBOL', isCorrect: false },
      { text: 'Fortran', isCorrect: false },
    ],
  },
  {
    text: 'What year did World War II end?',
    answers: [
      { text: '1945', isCorrect: true },
      { text: '1944', isCorrect: false },
      { text: '1946', isCorrect: false },
      { text: '1943', isCorrect: false },
    ],
  },
  {
    text: 'Which element has the chemical symbol "O"?',
    answers: [
      { text: 'Oxygen', isCorrect: true },
      { text: 'Gold', isCorrect: false },
      { text: 'Osmium', isCorrect: false },
      { text: 'Silver', isCorrect: false },
    ],
  },
  {
    text: 'What is the square root of 64?',
    answers: [
      { text: '8', isCorrect: true },
      { text: '6', isCorrect: false },
      { text: '10', isCorrect: false },
      { text: '7', isCorrect: false },
    ],
  },
  {
    text: 'Which country is home to the kangaroo?',
    answers: [
      { text: 'Australia', isCorrect: true },
      { text: 'New Zealand', isCorrect: false },
      { text: 'South Africa', isCorrect: false },
      { text: 'Brazil', isCorrect: false },
    ],
  },
];

async function seedDatabase() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();

    console.log('Syncing database...');
    await sequelize.sync({ force: false });

    console.log('Checking existing questions...');
    const count = await Question.count();

    if (count > 0) {
      console.log(`Database already has ${count} questions. Skipping seed.`);
      console.log('To reset, delete the database.sqlite file and run this script again.');
      process.exit(0);
    }

    console.log('Seeding database with sample questions...');

    for (const q of sampleQuestions) {
      const question = await Question.create({
        text: q.text,
        createdBy: 0,
      });

      for (const a of q.answers) {
        await Answer.create({
          text: a.text,
          isCorrect: a.isCorrect,
          questionId: question.id,
        });
      }

      console.log(`✓ Added: ${q.text}`);
    }

    console.log(`\n✓ Successfully seeded ${sampleQuestions.length} questions!`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();

