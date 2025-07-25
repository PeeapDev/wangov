const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[contenthash].js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      components: path.resolve(__dirname, 'src/components/'),
      pages: path.resolve(__dirname, 'src/pages/'),
      layouts: path.resolve(__dirname, 'src/layouts/'),
      services: path.resolve(__dirname, 'src/services/'),
      utils: path.resolve(__dirname, 'src/utils/'),
      contexts: path.resolve(__dirname, 'src/contexts/'),
      hooks: path.resolve(__dirname, 'src/hooks/'),
      types: path.resolve(__dirname, 'src/types/'),
      assets: path.resolve(__dirname, 'src/assets/')
    }
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: 'ts-loader'
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new MiniCssExtractPlugin({
      filename: 'styles.[contenthash].css'
    })
  ],
  devServer: {
    historyApiFallback: true,
    port: 3001,
    hot: true,
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
};
