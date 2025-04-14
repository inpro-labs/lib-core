// @ts-check
/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/lib', '<rootDir>/test'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testMatch: ['**/?(*.)+(spec|test).[tj]s'],
  coverageDirectory: '<rootDir>/test/_coverage',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/lib/$1',
  },
};
