const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    main: "./src/index.js",
    county: "./src/county.js",
  },
  output: {
    filename: "[name].js",
    path: __dirname + "/dist",
    publicPath: '/'
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
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      chunks: ['main'],
      template: "./src/html/index.html",
      filename: "./index.html",
    }),
    new HtmlWebPackPlugin({
      base: 'county',
      chunks: ['county'],
      template: "./src/html/county.html",
      filename: "./county.html",
    }),
  ],
  watch: true
};
