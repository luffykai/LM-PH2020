const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  entry: {
    main: "./src/index.js",
    county: "./src/county.js",
    project: "./src/project.js",
    indicator: "./src/indicator.js",
  },
  output: {
    filename: "[name].js",
    path: __dirname + "/dist",
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
          },
        ],
      },
      {
        test: /\.css$/i,
        use: ['css-loader'],
      },
    ],
  },
  optimization: {
    minimize: false,
  },
  plugins: [
    new HtmlWebPackPlugin({
      chunks: ["main"],
      template: "./src/html/index.html",
      filename: "./index.html",
    }),
    new HtmlWebPackPlugin({
      base: "county",
      chunks: ["county"],
      template: "./src/html/county.html",
      filename: "./county.html",
    }),
    new HtmlWebPackPlugin({
      base: "project",
      chunks: ["project"],
      template: "./src/html/project.html",
      filename: "./project.html",
    }),
    new HtmlWebPackPlugin({
      base: "indicator",
      chunks: ["indicator"],
      template: "./src/html/indicator.html",
      filename: "./indicator.html",
    }),
  ],
  resolve: {
    alias: {
      react: path.resolve("./node_modules/react"),
    },
  },
  watch: true,
};
