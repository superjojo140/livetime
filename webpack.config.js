const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './src/frontend/index.ts',
  devtool: 'inline-source-map',
  mode: 'production',
  watch: false,
  externals: {
    'bootstrap': 'bootstrap',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'livetime.js',
    path: path.resolve(__dirname, 'public'),
    libraryTarget: 'var',
    library: 'app'
  },
  optimization: {
    minimize: false
  },
  plugins: [
    new Dotenv()
  ]
};