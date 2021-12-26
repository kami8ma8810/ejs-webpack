// スクロールで発火するIntersectionObserverの設定
'use strict';
class ScrollObserver {
  constructor(els, cb, options) {
    // 監視する要素の設定
    this.els = document.querySelectorAll(els);
    // intersectionObserverのデフォルトオプション設定
    const defaultOptions = {
      root: null,
      rootMargin: "-20% 0%",
      threshold: 0,
      once: true, //個別で追加したoption。一度監視したら解除するかどうか。
    };
    this.cb = cb; //コールバック設定
    this.options = Object.assign(defaultOptions, options); //デフォルト以外のオプションを設定した場合、デフォルトオプションにマージする。
    this.once = this.options.once; //追加オプションをデフォルトオプションに設定
    this._init(); //初期化
  }
  _init() {
    console.log('RUN__scroll-observer.js');
    const callback = function (entries, observer) {
      entries.forEach((entry) => {
        // 監視範囲と交差したときの処理
        if (entry.isIntersecting) {
          this.cb(entry.target, true);
          // もしonceオプションがtrueなら監視をやめる
          if (this.once) {
            observer.unobserve(entry.target);
          }
        }
        // 監視範囲と交差していないときの処理
        else {
          this.cb(entry.target, false);
        }
      });
    };
    // IntersectionObserverインスタンス化
    this.io = new IntersectionObserver(callback.bind(this), this.options);

    // polyfill用の設定 @see https://github.com/w3c/IntersectionObserver/tree/master/polyfill
    this.io.POLL_INTERVAL = 100;

    // 監視する全ての要素を処理にかける
    this.els.forEach(el => this.io.observe(el));
  }
  // インスタンスを削除する
  destroy(){
    this.io.disconnect();
  }
}

export default ScrollObserver;
