const { TypedCssModulesPlugin } = require("typed-css-modules-webpack-plugin");
const NextWorkboxPlugin = require("next-workbox-webpack-plugin");
const Dotenv = require("dotenv-webpack");

module.exports = {
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
    config.plugins.push(new Dotenv());

    const workboxOptions = {
      clientsClaim: true,
      skipWaiting: true,
      globPatterns: [".next/static/*", ".next/static/commons/*"],
      modifyUrlPrefix: {
        ".next": "/_next",
      },
      runtimeCaching: [
        {
          urlPattern: "/",
          handler: "networkFirst",
          options: {
            cacheName: "page",
          },
        },
        {
          urlPattern: /.*\.(?:css)/,
          handler: "cacheFirst",
          options: {
            cacheName: "css",
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        {
          urlPattern: /.*\.(?:js)/,
          handler: "cacheFirst",
          options: {
            cacheName: "js",
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        {
          urlPattern: /.*\.(?:png|jpg|jpeg|svg|gif|icon|ico)/,
          handler: "cacheFirst",
          options: {
            cacheName: "image",
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
      ],
    };
    if (!isServer) {
      config.node = {
        fs: "empty",
        net: "empty",
        tls: "empty",
      };

      config.plugins.push(
        new NextWorkboxPlugin({
          buildId,
          ...workboxOptions,
        }),
      );
    }
    return config;
  },
};
