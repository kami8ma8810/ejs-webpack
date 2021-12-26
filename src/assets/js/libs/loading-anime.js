import { gsap } from 'gsap';

export default () => {
  console.log('RUN__loading-anime.js');
  const loadingElm = document.querySelector('.loading');
  const tl = gsap.timeline();
  tl.to(
    loadingElm,
    { duration: 0.5, autoAlpha: 0, ease: 'circ.out' },
    1 //←最低でもローディング時間を担保したい場合に設定
  )
  .to('body', { overflow: 'visible' });
};
