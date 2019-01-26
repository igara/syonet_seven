const tsconfig = require('./tsconfig.json')
const moduleNameMapper = require('tsconfig-paths-jest')(tsconfig)

module.exports = {
	roots: ['./specs'],
	notify: true,
	moduleFileExtensions: ['js', 'ts'],
	testEnvironment: 'jest-environment-jsdom-global',
	transform: {
		'^.+\\.js$': 'babel-jest',
		'^.+\\.ts$': 'ts-jest',
	},
	collectCoverageFrom: [
		'**/*.{js}',
		'**/*.{ts}',
		'!<rootDir>/node_modules/',
		'!<rootDir>/flow-typed/**',
		'!<rootDir>/frontend/syonet/statics/**',
	],
	globals: {
		TEST: 'test',
	},
	testMatch: ['**/specs/**/*.ts'],
	moduleNameMapper,
}
