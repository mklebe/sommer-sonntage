const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");

/** @type {webpack.Configuration} */
const webpackConfiguration = {
  mode: "development",
  entry: "./src/index.tsx",
  devtool: "source-map",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "..", "..", "public", "client"),
    publicPath: "/",
  },
  module: {
    rules: [
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
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
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
      template: "src/index.html",
      title: "CMF-Design-App",
    }),
    new CompressionPlugin(),
  ],
};
module.exports = webpackConfiguration;
