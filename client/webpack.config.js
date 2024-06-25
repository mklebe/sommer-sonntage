const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const fs = require("fs");

const cwd = process.cwd();
const packageJson = JSON.parse(fs.readFileSync(path.resolve(cwd, "package.json")));

/** @type {webpack.Configuration} */
const webpackConfiguration = {
  context: path.resolve(__dirname),
  mode: "development",
  entry: path.resolve(cwd, "./src/index.tsx"),
  devtool: "source-map",
  output: {
    filename: "main.js",
    path: path.resolve(cwd, "dist"),
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.json$/,
        type: "json",
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
          options: {
            compilerOptions: {
              noEmit: false,
            },
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  devServer: {
    historyApiFallback: {
      index: "/",
    },
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      templateContent: `
        <!doctype html>
        <html lang="en">

        <head>
          <meta charset="utf-8" />
          <meta 
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=0, shrink-to-fit=no" 
          />
          <title>Bingo Client</title>
          <style>
            html,
            body,
            #root {
              width: 100%;
              height: 100%;
              padding: 0;
              margin: 0;
              overflow: hidden;
            }
          </style>
        </head>
        <body>
          <noscript>You need to enable JavaScript to run this app.</noscript>
          <bingo-client/>
        </body>
        </html>
      `,
    }),
    new CompressionPlugin(),
  ],
};
module.exports = webpackConfiguration;
