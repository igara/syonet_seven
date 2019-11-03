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
    WEBPUSH_CONTACT: string;
    WEBPUSH_VAPIDKEYS_PUBLIC: string;
    WEBPUSH_VAPIDKEYS_PRIVATE: string;
    DISCORD_WEBHOCK: string;
  }
}

declare const process: NodeJS.Process;
declare global {
  const TEST: string;
}