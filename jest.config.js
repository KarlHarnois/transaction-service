module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>/test"],
  testMatch: ["**/*.test.ts"],
  moduleDirectories: ["node_modules", "src"],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  moduleNameMapper: {
    "@handlers/(.*)": "<rootDir>/src/handlers/$1",
    "@shared/(.*)": "<rootDir>/src/shared/$1",
    "@lib/(.*)": "<rootDir>/lib/$1",
    "@test/(.*)": "<rootDir>/test/$1",
  }
}
