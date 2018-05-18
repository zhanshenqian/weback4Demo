const path = require('path')
const VENOR = []
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin')
var CleanWebpackPlugin = require('clean-webpack-plugin')
var ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
var cssExtract = new ExtractTextWebpackPlugin('[name].[chunkhash].css');
var lessExtract = new ExtractTextWebpackPlugin('[name].[chunkhash].css');
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');



module.exports = {
  entry: {
    index: './app/index.js',
    common: './app/common.js',
    cutword: './app/cutword.js'
    // vendor: VENOR,
  },
  output: {
    path: path.resolve(__dirname, 'dist/newIndex'),
    filename: '[name].[chunkhash].js',
    // publicPath: './',
  },
  devServer: {
    // contentBase: path.resolve(__dirname,'dist/newIndex'),// 配置开发服务运行时的文件根目录
    port: 8180,
    disableHostCheck: true,
    host: 'localhost',
    compress: true,
    // proxy: {
    //   "/api": "http://localhost:9000",
    // }
    proxy: {
      '/cutword': {
        target: '',
        changeOrigin: true,
        pathRewrite: {
          '^/cutword': '/cutword'
        }
      }
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ["es2015", "env", "stage-0"], // env --> es6, stage-0 --> es7
          }
        },
        exclude: /node_modules/
      },
      {
        // 图片格式正则
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            // 配置 url-loader 的可选项
            options: {
              // 限制 图片大小 10000B，小于限制会将图片转换为 base64格式
              limit: 10000,
              // 超出限制，创建的文件格式
              // build/images/[图片名].[hash].[图片格式]
              name: 'images/[name].[hash].[ext]',
              publicPath: './',
            }
          }
        ]
      },
      {
        test: /\.css$/,
        loader: cssExtract.extract({
          use: ['css-loader?minimize', 'postcss-loader'],
          fallback: 'style-loader'
        }),
        // include:path.join(__dirname,"client/src"),
      },
      {
        test: /\.less$/,
        use: lessExtract.extract({
          fallback: 'style-loader',
          use: ['css-loader?minimize', 'less-loader', 'postcss-loader'],
        })
      },
      {
        test: /\.html$/,
        exclude: /node_modules/,
        loader: 'html-loader'
      },
      {
        test: /\.ejs$/,
        exclude: /node_modules/,
        loader: 'ejs-loader'
      }
    ]
  },
  // 插件列表
  plugins: [
    cssExtract,
    lessExtract,
    // new webpack.optimize.CommonsChunkPlugin({
    //   // vendor 的意义和之前相同
    //   // manifest文件是将每次打包都会更改的东西单独提取出来，保证没有更改的代码无需重新打包，这样可以加快打包速度
    //   names: ['vendor', 'manifest'],
    //   // 配合 manifest 文件使用
    //   minChunks: Infinity
    // }),
    // 只删除 dist 文件夹下的 bundle 和 manifest 文件
    new CleanWebpackPlugin([path.join(__dirname, 'dist')]),
    // 我们这里将之前的 HTML 文件当做模板
    // 注意在之前 HTML 文件中请务必删除之前引入的 JS 文件
    new HtmlWebpackPlugin({
      template: 'index.ejs',
      filename: 'index.html',
      inject: 'true',
      // chunks: ["bundle.[chunkhash].js"],
      chunks: ['common', 'base', 'index', 'public', 'jquery'],     // 在产出的HTML文件里引入哪些代码块
      hash: true,                     // 名称是否哈希值
      minify: {                       // 对html文件进行压缩
        removeAttributeQuotes: true // 移除双引号
      }
    }),
    // new HtmlWebpackPlugin({
    //   template: 'home.ejs',
    //   filename: 'home.html',
    //   inject: 'true',
    //   // chunks: ["bundle.[chunkhash].js"],
    //   chunks: ['common', 'base', 'home', 'public', 'jquery'],     // 在产出的HTML文件里引入哪些代码块
    //   hash: true,                     // 名称是否哈希值
    //   minify: {                       // 对html文件进行压缩
    //     removeAttributeQuotes: true // 移除双引号
    //   }
    // }),
    new HtmlWebpackPlugin({
      template: 'cutword.ejs',
      filename: 'cutword.html',
      inject: 'true',
      dateData: new Date(),
      // chunks: ["bundle.[chunkhash].js"],
      chunks: ['common', 'cutword', 'public', 'jquery'],     // 在产出的HTML文件里引入哪些代码块
      hash: true,                     // 名称是否哈希值
      minify: {                       // 对html文件进行压缩
        removeAttributeQuotes: true // 移除双引号
      }
    }),
    // 生成全局变量
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("process.env.NODE_ENV")
    }),
    // 压缩提取出的 CSS，并解决ExtractTextPlugin分离出的 JS 重复问题
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    }),
    // 压缩 JS 代码
    new UglifyjsWebpackPlugin({
      uglifyOptions: {
        ie8: false,
        ecma: 5,
        compress: {
          warnings: false
        }
      }
    }),
    new CopyWebpackPlugin([{
      from: path.join(__dirname, 'public'),       // 从哪里复制
      to: path.join(__dirname, 'dist/newIndex', 'public')  // 复制到哪里
    }])
  ]
}