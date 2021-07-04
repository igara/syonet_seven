const webpack = require("webpack");
const slsw = require("serverless-webpack");
const path = require("path");
const nodeExternals = require("webpack-node-externals");
const Dotenv = require("dotenv-webpack");

const enviroment = process.env.NODE_ENV || "development";

module.exports = {
  mode: "production",
  entry: slsw.lib.entries,
  target: "node",
  externals: [nodeExternals()],
  plugins: [
    new Dotenv({
      path: path.resolve(__dirname, `../../.env.${enviroment}`),
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
  },
};
