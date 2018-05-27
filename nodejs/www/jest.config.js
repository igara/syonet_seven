// https://facebook.github.io/jest/docs/ja/configuration.html
module.exports = {
	verbose: true,
	roots: ['./specs'],
	notify: true,
	moduleFileExtensions: ['js'],
	testEnvironment: 'jest-environment-jsdom-global',
}
