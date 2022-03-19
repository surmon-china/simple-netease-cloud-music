module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleFileExtensions: [
    "js",
    "ts",
    "json",
  ],
  transform: {
    "^.+\\.ts?$": "ts-jest"
  }
}
