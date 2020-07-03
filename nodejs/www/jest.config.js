const tsconfig = require("./tsconfig.json");
const moduleNameMapper = require("tsconfig-paths-jest")(tsconfig);
const path = require("path");

module.exports = {
  roots: ["./specs"],
  notify: true,
  moduleFileExtensions: ["js", "ts", "tsx", "json"],
  testEnvironment: "jest-environment-jsdom-global",
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  globals: {
    "ts-jest": {
      tsConfig: path.join(__dirname, "jest.tsconfig.json"),
      diagnostics: false,
    },
  },
  setupFiles: ["dotenv/config"],
  testMatch: ["**/specs/**/*.spec.ts"],
  moduleNameMapper,
};
