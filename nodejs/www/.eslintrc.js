module.exports = {
	extends: [
		"eslint:recommended",
		"plugin:prettier/recommended",
		"plugin:react/recommended"
	],
	plugins: ["@typescript-eslint"],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		sourceType: "module",
		project: "./tsconfig.json"
	},
	rules: { "react/prop-types": false },
	ecmaFeatures: {
		jsx: true
	},
	env: {
		es6: true,
		node: true
	}
};
