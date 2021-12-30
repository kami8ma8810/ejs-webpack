import $ from 'jquery';

export default () => {
  //ProvidePluginでjQuery($)を読み込んでいるかテスト
  $('body').addClass('jqueryyyyyyyyyy');

  // 以下Babelで変換されるかどうかのテストコード
  // クラス構文/テンプレート文字列/Promise/async,await を利用
  class User {
    constructor(name) {
      this.name = name;
    }
    sayHello() {
      return `Hello, ${this.name}`;
    }
    async fetch() {
      return await new Promise((resolve) => {
        setTimeout(() => {
          resolve('complite from async!');
        }, 1000);
      });
    }
  }

  const user = new User('Promise');
  console.log(user.sayHello());

  user.fetch().then((result) => {
    console.log(result);
  });
};
