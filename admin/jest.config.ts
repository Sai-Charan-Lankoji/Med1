// jest.config.ts
import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.+)$': '<rootDir>/src/app/$1', // General alias for @/
    '^../lib/ThemeContext$': '<rootDir>/src/app/lib/ThemeContext', // For Navbar.tsx relative import
  },
  moduleDirectories: ['node_modules', '<rootDir>/src'],
};

export default createJestConfig(config);