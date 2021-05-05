const { TypedCssModulesPlugin } = require("typed-css-modules-webpack-plugin");
const withPWA = require("next-pwa");

module.exports = withPWA({
  pwa: {
    dest: "public",
  },
  env: {
    WWW_HOST: process.env.WWW_HOST,
  },
  webpackDevMiddleware: config => {
    config.watchOptions = {
      poll: 800,
      aggregateTimeout: 300,
    };
    return config;
  },
  webpack(config, { isServer, buildId }) {
    config.module.rules.push({
      test: /\.svg$/,
      loader: "svg-inline-loader",
    });
    config.plugins.push(
      new TypedCssModulesPlugin({
        globPattern: "styles/**/*.css",
      }),
    );

    if (!isServer) {
      config.node = {
        fs: "empty",
        net: "empty",
        tls: "empty",
      };
    }
    return config;
  },
});
