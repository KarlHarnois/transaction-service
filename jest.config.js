module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>/test"],
  testMatch: ["**/*.test.ts"],
  moduleDirectories: ["node_modules", "src"],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  moduleNameMapper: {
    "@lambdas/(.*)": "<rootDir>/src/lambdas/$1",
    "@shared/(.*)": "<rootDir>/src/shared/$1"
  }
}
