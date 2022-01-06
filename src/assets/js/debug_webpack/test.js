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