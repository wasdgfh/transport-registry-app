module.exports = {
  testEnvironment: 'node',
  setupFiles: ['./jest.setup.js'],
  setupFilesAfterEnv: ['./jest.setup.after.js'],
  maxWorkers: 1
};
