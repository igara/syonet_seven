const Dotenv = require("dotenv-webpack");
const path = require("path");

const dev = process.env.NODE_ENV !== "production";
module.exports = {
  mode: dev ? "development" : "production",
  entry: {
    notification: "./workers/notification.ts",
    sw_register: "./workers/sw_register.ts",
  },
  output: {
    filename: "[name].js",
    path: __dirname + "/dist",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
      },
    ],
  },
  plugins: [new Dotenv()],
  resolve: {
    extensions: [".ts"],
    alias: {
      "@www": path.resolve(__dirname, "./"),
    },
  },
};
