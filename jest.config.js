module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>/test"],
  testMatch: ["**/*.test.ts"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  // test double for lambda function environment variable
  setupFiles: ["<rootDir>/test/.jest/lambda-env-vars.ts"],
};
