// @flow
declare var process: {
	env: {
		NODE_ENV: string,
		PORT: string,
		WWW_ENV: string,
		DB_DOMAIN: string,
		GOOGLE_CLIENT_ID: string,
		GOOGLE_CLIENT_SECRET: string,
		GOOGLE_CALLBACK: string,
		FACEBOOK_APP_ID: string,
		FACEBOOK_APP_SECRET: string,
		FACEBOOK_CALLBACK: string,
		TWITTER_CONSUMER_KEY: string,
		TWITTER_CONSUMER_SECRET: string,
		TWITTER_CALLBACK: string,
		GITHUB_CLIENT_ID: string,
		GITHUB_CLIENT_SECRET: string,
		GITHUB_CALLBACK: string
	},
	exit(code?: number): void
};
 