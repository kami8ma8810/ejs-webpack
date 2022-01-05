'use strict';
// gulpコマンドの省略
const { src, dest, watch, lastRun, series, parallel } = require('gulp');

// EJS
const fs = require('fs'); //Node.jsでファイルを操作するための公式モジュール
const htmlMin = require('gulp-htmlmin');
const prettify = require('gulp-prettify');
const ejs = require('gulp-ejs');
const rename = require('gulp-rename');
const replace = require('gulp-replace');

// Sass
const sass = require('gulp-dart-sass');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const postCss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const gcmq = require('gulp-group-css-media-queries');
const cssNano = require('gulp-cssnano');

// JavaScript
const babel = require('gulp-babel');
const terser = require('gulp-terser'); //ES6(ES2015)の圧縮に対応
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');
const webpackStream = require('webpack-stream');

// 画像
const imageMin = require('gulp-imagemin');
const pngQuant = require('imagemin-pngquant');
const mozJpeg = require('imagemin-mozjpeg');
const svgo = require('gulp-svgo');
const webp = require('gulp-webp'); //webpに変換
const changed = require('gulp-changed');

// ブラウザ同期
const browserSync = require('browser-sync').create();

// 削除
const clean = require('gulp-clean');
const del = require('del');

//パス設定
const paths = {
  ejs: {
    src: ['./src/**/*.ejs', '!./src/**/_*.ejs'],
    dist: './public/',
    watch: './src/**/*.ejs',
  },
  styles: {
    src: './src/assets/scss/**/*.scss',
    copy: './src/assets/css/vendors/*.css',
    dist: './public/assets/css/',
    distCopy: './public/assets/css/vendors/',
  },
  scripts: {
    src: ['./src/assets/js/**/*.js', '!./src/assets/js/**/vendors/*.js'], //外部のライブラリファイルはコンパイルしない
    copy: './src/assets/js/**/vendors/*.js',
    dist: './public/assets/js/',
  },
  images: {
    src: './src/assets/images/**/*.{jpg,jpeg,png,gif,svg}',
    srcWebp: './src/assets/images/**/*.{jpg,jpeg,png}',
    dist: './public/assets/images/',
    // distWebp: './public/assets/images/webp/',
  },
  fonts: {
    src: './src/assets/fonts/*.{off,ttf,woff,woff2}',
    dist: './public/assets/fonts/',
  },
  clean: {
    all: './public/',
    assets: ['./public/assets/css/', './public/assets/js/'],
    html: './public/!(assets)**',
    css: './public/assets/css/',
    js: './public/assets/js/',
    images: './public/assets/images/',
    fonts: './public/assets/fonts/',
  },
};

// ejsコンパイル
const ejsCompile = () => {
  // ejsの設定を読み込む
  const data = JSON.parse(fs.readFileSync('./ejs-config.json'));
  return src(paths.ejs.src)
    .pipe(
      plumber({
        // エラーがあっても処理を止めない
        errorHandler: notify.onError('Error: <%= error.message %>'),
      })
    )
    .pipe(ejs(data)) //ejsをまとめる
    .pipe(
      rename({
        extname: '.html',
      })
    )
    .pipe(
      htmlMin({
        //圧縮時のオプション
        minifyCSS: true, //style要素とstyle属性の圧縮
        minifyJS: true, //js要素とjs属性の圧縮
        removeComments: true, //コメントを削除
        collapseWhitespace: true, //余白を詰める
        collapseInlineTagWhitespace: true, //inline要素間のスペース削除（spanタグ同士の改行などを詰める
        preserveLineBreaks: true, //タグ間の余白を詰める
        /*
         *オプション参照：https://github.com/kangax/html-minifier
         */
      })
    )
    .pipe(replace(/[\s\S]*?(<!DOCTYPE)/, '$1'))
    .pipe(dest(paths.ejs.dist))
    .pipe(browserSync.stream()); //変更があった所のみコンパイル
};

// Sassコンパイル
const sassCompile = () => {
  return (
    src(paths.styles.src, {
      // ソースマップの出力の有無
      sourcemaps: true,
    })
      .pipe(
        plumber({
          // エラーがあっても処理を止めない
          errorHandler: notify.onError('Error: <%= error.message %>'),
        })
      )
      // scss→cssコンパイル
      .pipe(
        sass({
          //出力時の形式（下記詳細）
          /*
           *https://utano.jp/entry/2018/02/hello-sass-output-style/
           */
          outputStyle: 'compressed',
        }).on('error', sass.logError)
      )
      .pipe(
        postCss([
          autoprefixer({
            //ベンダープレフィックス追加※設定はpackage.jsonに記述
            cascade: false, // プロパティのインデントを整形しない
            grid: 'autoplace', // IE11のgrid対応
          }),
        ])
      )
      //メディアクエリをまとめる
      .pipe(gcmq())
      //圧縮
      .pipe(cssNano())
      .pipe(
        dest(paths.styles.dist, {
          // ソースマップを出力する場合のパス
          sourcemaps: './map',
        })
      )
      //変更があった所のみコンパイル
      .pipe(browserSync.stream())
  );
};

// JavaScriptコンパイル
const jsCompile = () => {
  return src(paths.scripts.src)
    .pipe(
      plumber({
        // エラーがあっても処理を止めない
        errorHandler: notify.onError('Error: <%= error.message %>'),
      })
    )
    .pipe(
      babel({
        presets: ['@babel/preset-env'],
      })
    )
    .pipe(terser()) //圧縮
    .pipe(dest(paths.scripts.dist));
};

// webpack
const jsBundle = (done) => {
  //webpackStreamの第2引数にwebpackを渡す
  webpackStream(webpackConfig, webpack)
    // .on('error', function (e) {
    //   this.emit('end');
    // })
    .pipe(dest(paths.scripts.dist));
  done();
};

// 画像圧縮
const imagesCompress = () => {
  return src(
    paths.images.src
    // , {since: lastRun(imagesCompress)}//gulp起動中にファイルを追加しても圧縮されないため無効化
  )
    .pipe(changed(paths.images.dist)) //新しく変更があったもののみ適用
    .pipe(
      plumber({
        // エラーがあっても処理を止めない
        errorHandler: notify.onError('Error: <%= error.message %>'),
      })
    )
    .pipe(
      imageMin(
        [
          // JPG,JPEGの圧縮
          mozJpeg({
            quality: 80, //画質
          }),
          // PNGの圧縮
          pngQuant(
            [0.6, 0.8] //画質の最小,最大
          ),
        ],
        {
          verbose: true, //メタ情報削除
        }
      )
    )
    .pipe(
      // SVGの圧縮
      svgo({
        plugins: [
          {
            removeViewbox: false, //フォトショやイラレで書きだされるviewboxを消すかどうか※表示崩れの原因になるのでfalse推奨。以降はお好みで。
          },
          {
            removeMetadata: false, //<metadata>を削除するかどうか
          },
          {
            convertColors: false, //rgbをhexに変換、または#ffffffを#fffに変換するかどうか
          },
          {
            removeUnknownsAndDefaults: false, //不明なコンテンツや属性を削除するかどうか
          },
          {
            convertShapeToPath: false, //コードが短くなる場合だけ<path>に変換するかどうか
          },
          {
            collapseGroups: false, //重複や不要な`<g>`タグを削除するかどうか
          },
          {
            cleanupIDs: false, //SVG内に<style>や<script>がなければidを削除するかどうか
          },
          // {
          //   mergePaths: false,//複数のPathを一つに統合
          // },
        ],
      })
    )
    .pipe(dest(paths.images.dist));
};

// 画像webp変換（gif,svgを除く）
const webpConvert = () => {
  return src(
    paths.images.srcWebp
    // , {since: lastRun(webpConvert)}//gulp起動中にファイルを追加しても圧縮されないため無効化
  )
    .pipe(
      plumber({
        // エラーがあっても処理を止めない
        errorHandler: notify.onError('Error: <%= error.message %>'),
      })
    )
    .pipe(webp())
    .pipe(dest(paths.images.dist));
};

// CSSファイルコピー（外部ファイルをsrcから取り込む場合、vendorsフォルダの中身はコンパイルしない。swiper,slickなど
const cssCopy = () => {
  return src(paths.styles.copy).pipe(dest(paths.styles.distCopy));
};

// JSファイルコピー（外部ファイルをsrcから取り込む場合、vendorsフォルダの中身はコンパイルしない
const jsCopy = () => {
  return src(paths.scripts.copy).pipe(dest(paths.scripts.dist));
};

// 画像コピー（webpに変換しないものはそのままdistへ移行
const imagesCopy = () => {
  return src(paths.images.src).pipe(dest(paths.images.dist));
};
// fontコピー（ローカルフォント使用する場合
const fontsCopy = () => {
  return src(paths.fonts.src).pipe(dest(paths.fonts.dist));
};

// ローカルサーバー起動
const browserSyncFunc = (done) => {
  browserSync.init({
    //デフォルトの connected のメッセージ非表示
    notify: false,
    server: {
      baseDir: './',
    },
    startPath: './public/index.html',
    reloadOnRestart: true,
  });
  done();
};

// ブラウザ自動リロード
const browserReloadFunc = (done) => {
  browserSync.reload();
  done();
};

// -----------------------
// ファイル削除
// -----------------------
// public 内をすべて削除
const cleanAll = (done) => {
  src(paths.clean.all, { read: false }).pipe(clean());
  done();
};
// HTML フォルダ、ファイルのみ削除（ assets 以外削除）
const cleanHtml = (done) => {
  src(paths.clean.html, { read: false }).pipe(clean());
  done();
};
//public 内の CSS と JS を削除
const cleanCssJs = (done) => {
  src(paths.clean.assets, { read: false }).pipe(clean());
  done();
};
//public 内の画像を削除
const cleanImages = (done) => {
  src(paths.clean.images, { read: false }).pipe(clean());
  done();
};

// ファイル監視
const watchFiles = () => {
  watch(paths.ejs.watch, series(ejsCompile, browserReloadFunc));
  watch(paths.styles.src, series(sassCompile));
  watch(paths.styles.copy, series(cssCopy));
  watch(paths.scripts.src, series(jsBundle, browserReloadFunc));
  watch(paths.scripts.copy, series(jsCopy, browserReloadFunc));
  // watch(paths.images.src, series(imagesCopy, webpConvert, browserReloadFunc));
  watch(
    paths.images.src,
    series(cleanImages, imagesCompress, webpConvert, browserReloadFunc)
  );
  watch(paths.fonts.src, series(fontsCopy, browserReloadFunc));
};

// npx gulp のコマンドで実行される処理
exports.default = series(
  parallel(
    ejsCompile,
    sassCompile,
    cssCopy,
    jsBundle,
    jsCopy,
    // imagesCopy,
    imagesCompress,
    webpConvert,
    fontsCopy
  ),
  parallel(watchFiles, browserSyncFunc)
);

// その他のコマンド 例： npx gulp cleanAll の形で入力
exports.cleanAll = series(cleanAll); //public内すべて削除
exports.cleanExcludeHtml = series(cleanHtml); //assets以外削除
exports.cleanCssJs = series(cleanCssJs); //css,jsを削除
exports.cleanImages = series(cleanImages); //imagesを削除
