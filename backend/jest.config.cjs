module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': ['babel-jest', {
      presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
      plugins: ['@babel/plugin-transform-modules-commonjs']
    }]
  },
  moduleFileExtensions: ['js', 'cjs', 'mjs'],
  testMatch: ['**/tests/**/*.test.js'],
  setupFilesAfterEnv: ['./src/tests/setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(@prisma|dotenv|jsonwebtoken|bcryptjs|multer|supertest)/)'
  ],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  testTimeout: 10000,
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons']
  },
  globals: {
    'jest': true,
    'process.env.NODE_ENV': 'test'
  }
}; 