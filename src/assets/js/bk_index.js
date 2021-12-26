import setFillHeight from './libs/set-fill-height';
import highlightNav from './libs/highlight-nav';
// import pageTransition from "./libs/page-transition";
import markerAnime from './libs/marker-anime';
import drawer from './libs/drawer';
import headerChange from './libs/header-change';
import ScrollObserver from './libs/scroll-observer';
import scrollAnime from './libs/scroll-anime';
import scrollStagger from './libs/scroll-stagger';
import scrollGradient from './libs/scroll-gradient';
import parallax from './libs/parallax';
import ua from './libs/ua-parser';
import topFvAnime from './libs/top-fv-anime';
import imagesLoaded from 'imagesloaded';
import charaPinAnime from './libs/chara-pin-anime';
import historyLine from './libs/history-line';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
import barba from '@barba/core';
import barbaPrefetch from '@barba/prefetch';
// ----------------------------------------------------
// barba
// ----------------------------------------------------
// titleタグ以外のmetaタグの情報の書き換えを行う
const replaceHeadTags = (target) => {
  console.log('◆◆◆◆◆replace head tags◆◆◆◆◆');
  const head = document.head;
  const targetHead = target.html.match(/<head[^>]*>([\s\S.]*)<\/head>/i)[0];
  const newPageHead = document.createElement('head');
  newPageHead.innerHTML = targetHead;
  const removeHeadTags = [
    // 書き換える項目のみ指定する titleはbarbaのデフォルトで書き変わる
    "meta[name='keywords']",
    "meta[name='description']",
    "meta[name='robots']",
    "meta[property^='og']",
    "meta[name^='twitter']",
    "link[rel='prev']",
    "link[rel='next']",
    "script[src^='']",
    // 'meta[itemprop]',
    // "meta[property^='fb']",
    // 'link[itemprop]',
    // "link[rel='canonical']"
  ].join(',');
  const headTags = [...head.querySelectorAll(removeHeadTags)];
  headTags.forEach((item) => {
    head.removeChild(item);
  });
  const newHeadTags = [...newPageHead.querySelectorAll(removeHeadTags)];
  newHeadTags.forEach((item) => {
    head.appendChild(item);
  });
};

//遅延用。引数の時間が経ったらアニメーションが終了していなくてもプロミスを完了する
function delay(n) {
  n = n || 2000;
  return new Promise((done) => {
    setTimeout(() => {
      done();
    }, n);
  });
}

function setupFvAnime() {
  const header = document.querySelector('.js-header');
  const fvTitle = document.querySelectorAll('.js-fv-anime-title');
  const fvPurple = document.querySelectorAll('.js-fv-anime-person.purple');
  const fvBlue = document.querySelectorAll('.js-fv-anime-person.blue');
  const fvGreen = document.querySelectorAll('.js-fv-anime-person.green');
  const fvOrange = document.querySelectorAll('.js-fv-anime-person.orange');
  const fvYellow = document.querySelectorAll('.js-fv-anime-person.yellow');
  const fvMint = document.querySelectorAll('.js-fv-anime-person.mint');
  const fvRed = document.querySelectorAll('.js-fv-anime-person.red');
  // gsap.config({
  //   force3D: true,
  // });
  gsap.set(header, {
    autoAlpha: 0,
    yPercent: -101,
  });
  gsap.set(fvRed, {
    scale: 1.5,
  });
  gsap.set(fvMint, {
    xPercent: -20,
    scale: 1.6,
  });
  gsap.set(fvYellow, {
    yPercent: 20,
    scale: 1.6,
  });
  gsap.set(fvPurple, {
    xPercent: 20,
    scale: 1.6,
  });
  gsap.set(fvGreen, {
    yPercent: 20,
    scale: 1.6,
  });
  gsap.set(fvOrange, {
    xPercent: -20,
    scale: 1.6,
  });
  gsap.set(fvBlue, {
    yPercent: 10,
    scale: 1.5,
  });
  gsap.set(fvTitle, {
    xPercent: -50,
    y: 50,
    // scale: 0.8,
    scaleX: 0.5,
  });
}

// すべてのページでimagedLoadedで画像を読み込んだら行う処理
const loadingAnime = (container) => {
  const loadingEl = document.querySelector('.loading');
  const loadingImg = document.querySelector('.loading-img');

  // Images loaded の設定（background-imageも判定に含める
  const imgLoad = imagesLoaded(container, { background: true });

  // 読み込めた場合も破損しているファイルがある場合でも実行する
  return imgLoad.on('always', () => {
    console.log('===============\nDONE imagesLoaded \n===============');
    // TOPページはFVアニメ用にヘッダーを隠す
    if (document.querySelector('.js-fv-anime')) {
      setupFvAnime();
    }
    // ローディングを非表示にしてからonceAnimation実行
    const tl = gsap.timeline({
      onComplete: () => onceAnimation(),
    });
    tl.to(
      loadingImg,
      { duration: 0.2, autoAlpha: 0, ease: 'circ.out', scale: 0.9 },
      1.4
    )
      .to('body', { overflow: 'visible' })
      .to(loadingEl, { duration: 0.2, autoAlpha: 0 })
      .to(container, { duration: 0.2, autoAlpha: 1 }, '<');
    // .call(onceAnimation);
  });
};

// ページ遷移のアニメーション要素
const transitionContainer = document.querySelector('.page-transition');
const transitionLayers = document.querySelectorAll('.page-transition__layer');
// PERSONページを含む全体レイヤー
const transitionPersons = document.querySelector('.person-transition');

// 最初にページを読み込んだ（アクセスした）時の処理（once）
function onceAnimation() {
  // 現在のページとナビリンクを照会する
  highlightNav();
  // ドロワー
  drawer();
  // スクロール開始でヘッダー変化
  headerChange();
  // スクロール連動アニメーション
  if (document.querySelector('.js-fadein')) {
    scrollAnime();
  }
  if (document.querySelector('.js-stagger')) {
    scrollStagger();
  }
  // 画像パララックス
  if (document.querySelector('.js-parallax-section1')) {
    parallax();
  }
  // PERSONページのみ
  if (document.querySelector('.js-pin-anime') !== null) {
    charaPinAnime();
    markerAnime();
    scrollGradient();
  }
  // INTRODUCTIONページのみ
  if (document.querySelector('.js-history-line') !== null) {
    historyLine();
  }
  // ファーストビューアニメーション
  if (document.querySelector('.js-fv-anime')) {
    topFvAnime();
  }
  // ページ遷移のレイヤーを左側へセット
  gsap.set(transitionContainer, {
    xPercent: -101,
  });
}

// ページから離脱するときのアニメーション（leave）
function leaveAnimation(data) {
  // console.log('leaveAnimation');
  const tl = gsap.timeline();
  tl.to(transitionContainer, {
    autoAlpha: 1,
    xPercent: 0,
    duration: 0,
  }).to(transitionLayers, {
    stagger: 0.4,
    scaleX: 1,
    ease: 'circ.out',
  });
}

// ページが表示されるときのアニメーション（enter）
function enterAnimation(container) {
  console.log('-----enterAnimation-----');
  // console.log(container);
  const tl = gsap.timeline({
    onStart: () => console.log('START 共通のenterAnimation'),
    // ↓ページ遷移のアニメーションのあとに走る処理
    onComplete: () => {
      console.log('DONE 共通のenterAnimation');
      // スクロール連動アニメーション
      if (document.querySelector('.js-fadein')) {
        scrollAnime();
      }
    },
  });
  tl.to(transitionContainer, {
    xPercent: 120,
    skewX: 13,
    duration: 0.8,
    ease: 'circ.inOut',
  })
    .to(transitionContainer, { autoAlpha: 0, duration: 0 })
    .to(transitionContainer, { xPercent: -101, skewX: 0, duration: 0 })
    .to(transitionLayers, { scaleX: 0, duration: 0 });
}
// =================================================================
// barba設定
// =================================================================
// ビューポート内にリンク先が見えたらprefetchで遷移先を取得する
barba.use(barbaPrefetch);

// barba hooks すべてのページで発火
// barba.hooks.beforeEnter(() => {
//   console.log('----------\nhooks beforeEnter\n----------');
// });

barba.hooks.enter(() => {
  console.log('-----\nhooks enter\n-----');
  // スクロールトリガーをリセット
  ScrollTrigger.refresh(true, console.log('☆ScrollTrigger refreshed!'));

  //  IEのみpictureタグのpolyfillを再読み込みする
  if (ua.getBrowser() === 'ie') {
    console.log('IEで見てる！hooks enter');
    var picturePolyfill = document.body.querySelector(
      'script[src="https://cdnjs.cloudflare.com/ajax/libs/picturefill/3.0.2/picturefill.js"]'
    );
    // body直前にpolyfillが読み込まれていなけば生成
    if (!picturePolyfill) {
      var newEl = document.createElement('script');
      newEl.src =
        'https://cdnjs.cloudflare.com/ajax/libs/picturefill/3.0.2/picturefill.js';
      document.body.appendChild(newEl);
    }
  }
});

barba.hooks.after(() => {
  console.log('-----\nhooks after\n-----');
  // ページ遷移時にページの最上部に移動する
  window.scrollTo(0, 0);
  // safari用min-height:100vh調整
  setFillHeight();
  // ファーストビューアニメーション
  if (document.querySelector('.js-fv-anime')) {
    setupFvAnime();
    topFvAnime();
  }
  // 現在のページへのリンクを無効化
  highlightNav();
  // ドロワー
  drawer();
  // スクロール開始でヘッダー変化
  headerChange();
  // // スクロール連動アニメーション
  // if (document.querySelector('.js-fadein')) {
  //   scrollAnime();
  // }
  if (document.querySelector('.js-stagger')) {
    scrollStagger();
  }
  // 画像パララックス
  if (document.querySelector('.js-parallax-section1') !== null) {
    parallax();
  }
  // PERSONページのみ
  if (document.querySelector('.js-pin-anime') !== null) {
    charaPinAnime();
    markerAnime();
    scrollGradient();
  }
  // INTRODUCTIONページのみ
  if (document.querySelector('.js-history-line') !== null) {
    historyLine();
  }
});
barba.hooks.leave(() => {
  console.log('<<<<<<<<<<<<hooks leave>>>>>>>>>>>>></hooks>');
  // ページ遷移前にpicturefillのpolyfillを削除
  if (ua.getBrowser() === 'ie') {
    var picturePolyfill = document.body.querySelector(
      'script[src="https://cdnjs.cloudflare.com/ajax/libs/picturefill/3.0.2/picturefill.js"]'
    );
    if (picturePolyfill !== null) {
      picturePolyfill.remove();
    }
  }
});

// PERSONページにいくときのみ
const leaveToPerson = (nextNamespace) => {
  console.log('LEAVE! PERSON1へ');
  // gsap.config({
  //   force3D: true,
  // });
  let activePeronLayer = document.getElementsByClassName(nextNamespace)[0];
  // console.log(activePeronLayer);

  const tl = gsap.timeline({
    onStart: () => console.log('▼▼▼START Leave Anime▼▼▼'),
    onComplete: () => {
      console.log('▲▲▲DONE Leave Anime▲▲▲');
    },
    // defaults: {
    //   ease: 'expo.out',
    // },
  });

  tl.to(transitionPersons, { autoAlpha: 1, duration: 0.6, ease: 'circ.out' })
    .to(activePeronLayer, { autoAlpha: 1, duration: 0.001 })
    .to(activePeronLayer, {
      // autoAlpha: 1,
      scale: 1,
      duration: 0.4,
      // ease: 'power4.out',
      ease: 'expo.out',
      // ease: 'back.inOut(2.5)',
    });
  return tl;
};

const EnterToPerson = (container) => {
  console.log('ENTER! PERSON1へ');
  // gsap.config({
  //   force3D: true,
  // });
  const tl = gsap.timeline({
    onStart: () => console.log('▽▽▽START Enter Anime▽▽▽'),
    onComplete: () => {
      gsap.set('.person-transition__obj', {
        autoAlpha: 0,
        scale: 0.5,
      });
      console.log('△△△DONE Enter Anime△△△');
    },
    defaults: {
      ease: 'expo.in',
    },
  });
  tl.to(transitionPersons, { autoAlpha: 0, duration: 0.4 });
  return tl;
};

// ========================================================
// barba設定
// ========================================================
barba.init({
  // debug:true,
  sync: true,
  transitions: [
    {
      // ===================================
      // 初回読み込み時の処理
      // ===================================
      name: 'common-setting',
      once(data) {
        console.log('----------\nonce\n----------');
        // ------------------------------------------
        // ユーザーエージェント判定（sp/tb(tablet)/pc)
        // ------------------------------------------
        ua.init();
        // タブレットのみ実行
        // if (ua.getDevice() === 'tb') {
        //   console.log('tabletで見ています');
        //   // どんなタブレットでもビューポートを768pxに固定する
        //   let viewport = document.createElement('meta');
        //   viewport.setAttribute('name', 'viewport');
        //   viewport.setAttribute('content', 'width=768');
        //   document.getElementsByTagName('head')[0].appendChild(viewport);
        // }

        // safari用min-height:100vh調整
        setFillHeight();
        // すべてのページでimagedLoadedで画像を読み込んでから表示する
        loadingAnime(data.next.container);
      },
      // ===================================
      // ページを離脱するときの処理
      // ===================================
      async leave(data) {
        console.log('----------\nleave\n----------');
        const done = this.async();
        leaveAnimation();
        await delay(700);
        // await delay(1400);
        done();
      },
      // ===================================
      // ページを表示するときの処理
      // ===================================
      beforeEnter({ next }) {
        // console.log('----------\nbeforeEnter\n----------');
        // headタグを書き換える
        replaceHeadTags(next);
      },
      async enter({ next }) {
        // console.log('----------\nenter\n----------');
        await delay(400);
        enterAnimation(next.container);
      },
    },
    // =========================================
    // PERSONページのみ適用
    // =========================================
    {
      sync: false,
      name: 'persons',
      to: {
        namespace: [
          'page-person1',
          'page-person2',
          'page-person3',
          'page-person4',
          'page-person5',
          'page-person6',
          'page-person7',
        ],
      },
      // PERSONページではリロードでスクロールトップ
      // beforeOnce(data) {
      //   console.log('beforeOnce only PERSON Page!');
      //   window.scrollTo(0, 0);
      // },
      // leave: ({ current }) => leaveToPerson(current.container),
      // enter: ({ next }) => {
      //   EnterToPerson(next.container);
      // },
      async leave(data) {
        // console.log(data.next.namespace);
        await leaveToPerson(data.next.namespace);
      },
      async enter({ next }) {
        await delay(400);
        EnterToPerson(next.container);
      },
    },
  ],
  // views: [
  //   {
  //     namespace: 'page-person1',
  //     // viewsで有効なライフサイクルは以下４つ
  //     beforeLeave(data) {
  //       // console.log('★★★\nbeforeLeave views PERSON 1\n★★★');
  //     },
  //     afterLeave(data) {
  //       // console.log('▲▲▲\nafterLeave views PERSON 1\n▲▲▲');
  //     },
  //     beforeEnter(data) {
  //       // PERSONページではリロードでスクロールトップ
  //       // console.log('☆☆☆\nbeforeEnter views PERSON\n☆☆☆');
  //     },
  //     afterEnter(data) {
  //       // window.scrollTo(0, 0);
  //       // console.log('△△△\nafterEnter views PERSON 1\n△△△');
  //     },
  //   },
  // ],
});
