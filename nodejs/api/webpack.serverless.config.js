const webpack = require("webpack");
const slsw = require("serverless-webpack");
const path = require("path");
const nodeExternals = require("webpack-node-externals");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const enviroment = process.env.NODE_ENV || "dev";

module.exports = {
  devtool: enviroment === "dev" ? "source-map" : false,
  mode: enviroment,
  entry: slsw.lib.entries,
  target: "node",
  externals: [nodeExternals()],
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "ormconfig.js",
          to: "./",
          context: "./",
        },
        {
          from: "NotoSansJP-Regular.otf",
          to: "./src/ogp",
          context: "./src/ogp",
        },
        {
          from: "ogp.png",
          to: "./src/ogp",
          context: "./src/ogp",
        },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: "ts-loader",
        options: {
          configFile: "tsconfig.json",
        },
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js", ".json"],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: "tsconfig.json",
      }),
    ],
  },
};
