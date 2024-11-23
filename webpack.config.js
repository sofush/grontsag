import HtmlWebpackPlugin from 'html-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import process from 'process';
import path from 'path';

export default {
  mode: 'none',
  entry: {
    index: './public/index.jsx',
    register: './public/register.jsx',
    login: './public/login.jsx',
  },
  output: {
    filename: '[name].bundle.js',
    publicPath: '/dist/',
    path: path.resolve(process.cwd(), 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react'
            ],
          },
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      chunks: [ 'index' ],
    }),
    new HtmlWebpackPlugin({
      template: './public/login.html',
      filename: 'login.html',
      chunks: [ 'login' ],
    }),
    new HtmlWebpackPlugin({
      template: './public/register.html',
      filename: 'register.html',
      chunks: [ 'register' ],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './public/fonts/',
          to: 'fonts/'
        },
      ]
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './public/img/',
          to: 'img/'
        },
      ]
    }),
  ],
};
