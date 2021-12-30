'use strict';
import drawer from './libs/drawer';
// import loadingAnime from './libs/loading-anime';
import imagesLoaded from 'imagesloaded';
import setFillHeight from './libs/set-fill-height';
import highlightNav from './libs/highlight-nav';
import ScrollObserver from './libs/scroll-observer';
import ua from './libs/ua-parser';

import modernFunction from './debug_webpack/modern-function';
import headerChange from './libs/header-change';
import parallax from './libs/parallax';


document.addEventListener('DOMContentLoaded', function () {
  console.log('---------------------\nDOMContentLoaded\n---------------------');
  const main = new Main();
});

// クラスの生成
class Main {
  constructor() {
    this._observers = []; //オブザーバーで監視する要素が複数あるため配列にする
    this._init();
  }

  //オブザーバーする要素をすべて配列に入れる
  set observers(val) {
    this._observers.push(val);
  }
  //オブザーバーする要素を参照したときに関数を呼び出す
  get observers() {
    return this._observers;
  }
  // 初期化処理（ここに実行する処理を追記していく
  _init() {
    ua.init();
    setFillHeight();
    // すべての画像の読み込みが完了したタイミングで処理する（背景画像を含む
    const watchTarget = document.querySelector('.common-container');
    const imgLoad = imagesLoaded(watchTarget, { background: true });
    imgLoad.on('always', () => {
      console.log('---------------------\nDONE__imagesLoaded\n---------------------');
      // loadingAnime();
      highlightNav();
      parallax();
      drawer();
      headerChange();

      this._scrollInit();
    });
  }
  // is-showクラスを付ける
  _addClassInview(el, isShow) {
    if (isShow) {
      el.classList.add('is-show');
    }
  }

  // オブザーバー要素をすべて削除する
  _destroyObservers() {
    this.observers.forEach((ob) => {
      ob.destroy();
    });
  }
  destroy() {
    this._destroyObservers();
  }

  // スクロールで発火する処理をここにまとめて追記
  _scrollInit() {
    if (document.querySelector('.js-fadein')) {
      // インスタンス生成
      this.observers = new ScrollObserver(
        // 要素を指定
        '.js-fadein',
        // 実行するインスタンスを指定
        this._addClassInview
        // オプションを変更する場合の書き方
        // { routMargin: '-50% 0%', threshold: [0.4], once: false }
      );
    }
  }
}
