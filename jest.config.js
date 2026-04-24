module.exports = {
  preset: '@react-native/jest-preset',
  setupFilesAfterEnv: ['./jest.setup.ts'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/types.ts',
    '!src/**/*.entity.ts',
    '!src/**/__tests__/**',
    '!src/**/.gitkeep',
  ],
  coverageThreshold: {
    global: {
      lines: 80,
      branches: 75,
      functions: 80,
      statements: 80,
    },
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|@shopify/flash-list|react-native-safe-area-context|react-native-screens|react-native-gesture-handler|react-native-uuid|react-native-config|react-native-keychain|zustand)/)',
  ],
};
