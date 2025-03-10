const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    // Handle module aliases (this will be automatically configured for you soon)
    '^@/app/(.*)$': '<rootDir>/app/$1',
  },
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
    '<rootDir>/venv/',
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    'app/components/properties/property-card.tsx',
    'app/components/transportation/transportation-card.tsx',
    'app/components/ui/loading-skeleton.tsx',
    'app/components/ui/lazy-component.tsx',
    'app/lib/utils.ts',
    'app/utils/dynamic-import.ts',
    'app/utils/image-optimization.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
    // Specific thresholds for individual files or directories
    'app/components/properties/property-card.tsx': {
      branches: 70,
      functions: 40,
      lines: 80,
      statements: 80,
    },
    'app/components/transportation/transportation-card.tsx': {
      branches: 70,
      functions: 50,
      lines: 80,
      statements: 80,
    },
    'app/utils/': {
      branches: 80,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig); 