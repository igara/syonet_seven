const { TypedCssModulesPlugin } = require("typed-css-modules-webpack-plugin");
const withPWA = require("next-pwa");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, `../../.env.${process.env.NODE_ENV}`) });

module.exports = withPWA({
  future: {
    webpack5: true,
  },
  pwa: {
    dest: "public",
  },
  env: {
    API_HOST: process.env.API_HOST,
    WWW_HOST: process.env.WWW_HOST,
  },
  webpackDevMiddleware: config => {
    config.watchOptions = {
      aggregateTimeout: 200,
      poll: 1000,
      ignored: /node_modules/,
    };
    return config;
  },
  webpack(config, { isServer, buildId }) {
    config.watchOptions = {
      ignored: /node_modules/,
    };
    config.module.rules.push({
      test: /\.svg$/,
      loader: "svg-inline-loader",
    });
    config.plugins.push(
      new TypedCssModulesPlugin({
        globPattern: "styles/**/*.css",
      }),
    );

    return config;
  },
});
