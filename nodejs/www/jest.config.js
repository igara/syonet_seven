// https://facebook.github.io/jest/docs/ja/configuration.html
module.exports = {
	roots: ['./specs'],
	notify: true,
	moduleFileExtensions: ['js'],
	testEnvironment: 'jest-environment-jsdom-global',
	transform: {
		'^.+\\.js$': 'babel-jest',
	},
	collectCoverageFrom: [
		'**/*.{js,jsx}',
		'!<rootDir>/node_modules/',
		'!<rootDir>/flow-typed/**',
		'!<rootDir>/frontend/syonet/statics/**',
	],
	globals: {
		TEST: 'test',
	},
}
