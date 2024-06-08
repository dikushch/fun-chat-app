const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const EslintWebpackPlugin = require('eslint-webpack-plugin');
// const CopyPlugin = require("copy-webpack-plugin");

module.exports = (env) => {
  return {
    mode: env.mode,
    entry: path.resolve(__dirname, 'src', 'app.ts'),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'app.js',
      clean: true,
    },
    plugins: [
      new HtmlWebpackPlugin({ template: path.resolve(__dirname, 'src', 'index.html') }),
      new MiniCssExtractPlugin(),
      new EslintWebpackPlugin({ extensions: '.ts' }),
      // new CopyPlugin({
      //   patterns: [
      //     {
      //       from: path.resolve(__dirname, 'src', 'assets'),
      //       to: path.resolve(__dirname, 'dist', 'assets'),
      //     },
      //   ],
      // }),
    ],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.scss$/i,
          use: [env.mode === 'production' ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader', 'sass-loader'],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
  };
}