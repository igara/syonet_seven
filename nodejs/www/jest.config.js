const tsconfig = require("./tsconfig.json");
const moduleNameMapper = require("tsconfig-paths-jest")(tsconfig);

module.exports = {
	roots: ["./specs"],
	notify: true,
	moduleFileExtensions: ["js", "ts"],
	testEnvironment: "jest-environment-jsdom-global",
	transform: {
		"^.+\\.ts$": "ts-jest"
	},
	globals: {
		TEST: "test"
	},
	testMatch: ["**/specs/**/*.spec.ts"],
	moduleNameMapper
};
