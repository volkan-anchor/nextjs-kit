const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load ne
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  // Add more setup options before each test is run
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // if using TypeScript with a baseUrl set to the r
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/components/$1',
  },
};

// createJestConfig is exported this way to ensure t
module.exports = createJestConfig(customJestConfig);
