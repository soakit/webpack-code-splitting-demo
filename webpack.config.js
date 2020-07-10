var path = require('path')
var webpack = require('webpack')
var { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    app: './src/main.js',
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    // publicPath: '/dist/',
    filename: '[name].[chunkhash:4].js',
    chunkFilename: '[name].[chunkhash:4].chunk.js',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map',

  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
  ],
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new BundleAnalyzerPlugin(),

    // node_modules的提取成vendor包
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors',
      minChunks: ({ resource }) => (
        resource &&
        resource.indexOf('node_modules') >= 0 &&
        resource.match(/\.js$/)
      ),
    }),
    // 懒加载的node_modules模块
    new webpack.optimize.CommonsChunkPlugin({
      // Webpack 2.5 以后 async chunk 需要指定 name。和 entry 同名
      name: 'app',
      async: 'vendors-lazy',
      minChunks: ({ resource } = {}) => (
        resource &&
        resource.includes('node_modules') &&
        /axios/.test(resource)
      ),
    }),
    // 使用了两次以上的
    new webpack.optimize.CommonsChunkPlugin({
      async: 'components',
      minChunks: (module, count) => (
        count >= 2
      ),
    }),

    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
