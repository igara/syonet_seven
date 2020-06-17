declare module NodeJS {
  interface Global {
    TEST: string;
  }
  interface ProcessEnv {
    TEST: string;
    NODE_ENV: string;
    PORT: string;
    WWW_HOST: string;
    WWW_DOMAIN: string;
    DB_HOST: string;
    MYSQL_ROOT_PASSWORD: string;
    MYSQL_DATABASE: string;
    MYSQL_USER: string;
    MYSQL_PASSWORD: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    GOOGLE_CALLBACK: string;
    GOOGLE_SERVICE_CLIENT_EMAIL: string;
    GOOGLE_SERVICE_PRIVATE_KEY: string;
    GOOGLE_TAG_MANAGER_ID: string;
    FACEBOOK_APP_ID: string;
    FACEBOOK_APP_SECRET: string;
    FACEBOOK_CALLBACK: string;
    TWITTER_CONSUMER_KEY: string;
    TWITTER_CONSUMER_SECRET: string;
    TWITTER_CALLBACK: string;
    GITHUB_CLIENT_ID: string;
    GITHUB_CLIENT_SECRET: string;
    GITHUB_CALLBACK: string;
    TOKEN_AUDIENCE: string;
    TOKEN_ISSUER: string;
    TOKEN_SECRET: string;
    WEBPUSH_CONTACT: string;
    WEBPUSH_VAPIDKEYS_PUBLIC: string;
    WEBPUSH_VAPIDKEYS_PRIVATE: string;
    DISCORD_WEBHOCK: string;
    DISCORD_BOT_TOKEN: string;
    DISCORD_ADMIN_USER_ID: string;
    DISCORD_BOT_CHANNEL_ID: string;
    REMOTE_DEPLOY_COMMAND: string;
    IN_POM_PATH: string;
    OUT_POM_PATH: string;
  }
}

declare const process: NodeJS.Process;
declare global {
  const TEST: string;
}
