const webpack = require("webpack");
const slsw = require("serverless-webpack");
const path = require("path");
const nodeExternals = require("webpack-node-externals");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

const enviroment = process.env.NODE_ENV || "development";

module.exports = {
  devtool: enviroment === "development" ? "source-map" : false,
  mode: enviroment,
  entry: slsw.lib.entries,
  target: "node",
  externals: [nodeExternals()],
  plugins: [],
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
