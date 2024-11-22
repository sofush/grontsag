import HtmlWebpackPlugin from 'html-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import process from 'process';
import path from 'path';

export default {
  mode: 'none',
  entry: {
    about: './public/about.jsx',
    index: './public/index.jsx',
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
      chunks: ['index'],
    }),
    new HtmlWebpackPlugin({
      template: './public/about.html',
      filename: 'about.html',
      chunks: ['about'],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './public/fonts/',
          to: 'fonts/'
        },
      ]
    }),
  ],
};
