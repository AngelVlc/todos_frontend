module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: ['src/**/*.{js,jsx}', '!src/**/*.d.ts'],
  setupFiles: ['whatwg-fetch'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  testEnvironment: 'jsdom',
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx}',
    '<rootDir>/src/**/*.{spec,test}.{js,jsx}',
  ],
  transform: {
    '^.+\\.(js|jsx|mjs|cjs)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs)$',
  ],
  moduleNameMapper: {
    axios: 'axios/dist/node/axios.cjs',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  moduleFileExtensions: ['js', 'jsx', 'mjs', 'cjs', 'json', 'node'],
  resetMocks: true,
};
