const path = require("path");
const { VueLoaderPlugin } = require("vue-loader");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = (env, arg) => {
  return {
    // mode: "development",
    entry: {
      main: {
        import: './main.js',
        filename: 'js/[name].js'
      },
      index: {
        import: './index.js',
        filename: 'js/[name].js'
      }
    },
    output: {
      path: path.resolve(__dirname, "./dist"),
      clean: true
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src/'),
      },
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          use: "vue-loader"
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        },
        {
          test: /\.(png)|(jpg)|(jpeg)|(gif)$/,
          type: 'asset/resource',
          generator: {
            filename: 'img/[hash]'
          }
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: arg.mode !== 'production' ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
            },
            {
              loader: "css-loader",
              options: {
                sourceMap: false,
              }
            }
          ]
        },
        {
          test: /\.less$/,
          use: [
            {
              loader: arg.mode !== 'production' ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
            },
            {
              loader: "css-loader",
              options: {
                sourceMap: false,
              }
            },
            {
              loader: "less-loader",
              options: {
                sourceMap: false,
              }
            }]
        },
      ]
    },
    performance: {
      hints: arg.mode === 'development' ? false : 'warning',
      maxEntrypointSize: 1024 * 1024,
      maxAssetSize: 1024 * 1024 * 2,
      assetFilter: function (assetFilename) {
        return assetFilename.endsWith('.js');
      },
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html',
        title: 'LibrarySeat',
        favicon: './public/library.ico',
        chunks: ['main']
      }),
      new HtmlWebpackPlugin({
        template: './public/redirect.html',
        filename: 'redirect.html',
        title: 'LibrarySeat',
        favicon: './public/library.ico',
        chunks: ['index']
      }),
      new VueLoaderPlugin(),
      new MiniCssExtractPlugin({
        filename: "css/[name].css",
      }),
      new webpack.DefinePlugin({
        __VUE_OPTIONS_API__: true,
        __VUE_PROD_DEVTOOLS__: true,
        // 'process.env.NODE_ENV': JSON.stringify('development')
      })
    ],
    devtool: arg.mode === 'development' ? 'eval-cheap-source-map' : 'source-map',
    devServer: {
      index: 'redirect.html',
      open: 'Chrome',
      hot: true,
      host: '10.136.21.90',
      port: 8080,
      stats: "minimal",
      contentBase: './public',
      overlay: true,
      disableHostCheck: true,
      clientLogLevel: 'silent'
    }
  }
};