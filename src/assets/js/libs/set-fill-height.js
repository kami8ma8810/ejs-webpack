// 高さ100vhの調整をする(safariのフォールバックを含む
'use strict';

export default () => {
  const setFillHeight = () => {
    console.log('RUN__set-fill-height.js');
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  };

  // 画面のサイズ変動があった時に高さを再計算する
  window.addEventListener("resize", setFillHeight);

  // 初期化
  setFillHeight();
};
