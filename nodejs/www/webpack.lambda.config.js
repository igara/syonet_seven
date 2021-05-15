const path = require("path");
const fs = require("fs");
const dev = process.env.NODE_ENV !== "production";

var nodeModules = {};
fs.readdirSync("node_modules")
  .filter(function(x) {
    return [".bin"].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = "commonjs " + mod;
  });

module.exports = {
  mode: dev ? "development" : "production",
  entry: {
    lambda: "./app-lambda.ts",
  },
  output: {
    filename: "[name].js",
    path: __dirname + "/dist",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: "ts-loader",
          options: {
            transpileOnly: true,
            configFile: "server.tsconfig.json",
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
    modules: [path.resolve(__dirname), "node_modules"],
    alias: {
      "@www": path.resolve(__dirname, "./"),
    },
    fallback: {
      http: require.resolve("stream-http"),
      path: require.resolve("path-browserify"),
      fs: false,
    },
  },
  externals: nodeModules,
};
