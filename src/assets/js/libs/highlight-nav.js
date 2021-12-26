// 現在表示しているのページをハイライトしてaタグにclass付与
export default () => {
  console.log('RUN__highlight-nav.js');
  // クラス名を定義
  const CLASS_NAME = 'is-current';
  // 現在のページのhrefを取得
  let currentHref = location.href;

  const parentRecruit = document.querySelector('.js-sub-recruit');
  const parentPerson = document.querySelector('.js-sub-person');

  // 現在のページのすべてのヘッダーナビのhrefを取得
  const navLinks = document.querySelectorAll('.js-nav-link');

  // 現在のページのナビの項目にis-currentのクラスを付与、
  // 下層ページを表示している場合は親メニューにis-currentを付与
  for (let i = 0; i < navLinks.length; i++) {
    let navHref = navLinks[i].href;
    if (currentHref === navHref) {
      // 現在のページと一致しているナビメニューにis-currentを付与
      navLinks[i].classList.add(CLASS_NAME);
      if(currentHref.match(/recruiting|requirements/g)){
        // Recruitの下層ページの場合はナビメニューRecruitにis-currentを付与
        parentRecruit.classList.add(CLASS_NAME)
      }else if(currentHref.match(/person/g)){
        // Personの下層ページの場合はナビメニューPersonにis-currentを付与
        parentPerson.classList.add(CLASS_NAME)
      }
    }
  }
};
