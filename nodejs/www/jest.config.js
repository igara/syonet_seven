const tsconfig = require("./tsconfig.json");
const moduleNameMapper = require("tsconfig-paths-jest")(tsconfig);

module.exports = {
  roots: ["./specs"],
  notify: true,
  moduleFileExtensions: ["js", "ts", "tsx"],
  testEnvironment: "jest-environment-jsdom-global",
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  globals: {
    "ts-jest": {
      tsConfig: "jest.tsconfig.json",
      diagnostics: false,
    },
  },
  setupFiles: ["dotenv/config"],
  testMatch: ["**/specs/**/*.spec.ts"],
  moduleNameMapper,
};
