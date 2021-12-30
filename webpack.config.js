// Node.js に組み込まれているモジュール。出力先などの指定をするために利用する。
const path = require('path');
// JavaScritpt を圧縮するプラグイン
const TerserPlugin = require('terser-webpack-plugin');
// webpack利用
const Webpack = require('webpack');

module.exports = {
  // モードの設定
  mode: 'production',
  // mode: 'development',

  // エントリーポイントの設定
  entry: {
    index: './src/assets/js/index.js',
  },
  // 出力の設定
  output: {
    // 出力先のパス（絶対パスを指定しないとエラーが出るので注意）
    // `__dirname + public`のように書くと、OS によって
    // パスが異なってしまうことがあるので、必ず`path`モジュールを利用する。
    path: path.resolve(__dirname, 'public/assets/js'),
    // 出力するファイル名
    // [name] には entry に指定した名前が入る
    // このサンプルでは、entry に index と app を指定しているため、
    // index.bundle.js と app.bundle.js が出力される
    filename: '[name].bundle.js',
  },
  target: ['web', 'es5'],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    // targets: {
                    //   ie: 11,
                    //   esmodules: true,
                    // },
                    useBuiltIns: 'usage',
                    corejs: 3,
                    // corejs: { version: '3', proposals: true },
                  },
                ],
              ],
            },
          },
        ],
      },
    ],
  },

  // plugins: [
  //   // まとめてインポートする
  //   new Webpack.ProvidePlugin({
  //     jQuery: 'jquery',
  //     $: 'jquery',
  //   }),
  // ],
  optimization: {
    splitChunks: {
      // 共通モジュールとして分割する対象。以下の値を指定できる。
      // initial: 静的にインポートしているモジュール、async: 動的（ダイナミック）にインポートしているモジュール、all: すべて
      // node_modules 配下のモジュールをバンドル対象とする（webpack5では all 推奨
      chunks: 'all',
      minSize: 0,
      minChunks: 1,
      cacheGroups: {
        // プロパティ名の vendors は任意
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          // 今回は 'vendor' で、output.filename が '[name].bundle.js' のため、 vendor.bundle.js が出力される。
          name: 'vendors',
        },
        default: false,
      },
    },
    minimize: true, // JavaScritpt を圧縮
    minimizer: [
      new TerserPlugin({
        // ライブラリのライセンスコメントなどを抽出した「xxx.LICENSE.txt」のようなファイルが出力されないようにする
        extractComments: false,
        terserOptions: {
          compress: {
            // console.logを削除する
            // drop_console: true,
          },
        },
      }),
    ],
  },
  //webpackの中に画像の圧縮処理など、重い処理を含めるとwarningが表示されるため、それを回避する設定
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
};
