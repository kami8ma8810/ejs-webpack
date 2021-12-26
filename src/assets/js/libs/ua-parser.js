 //ユーザーエージェント分岐（bodyタグにデバイス・ブラウザに応じたclass付与
'use strict';
const UAParser = require('ua-parser-js');

const ua = (() => {
  class UA {
    constructor() {
      this.uaParser = UAParser();
      this.body = document.querySelector('body');
    }

    init() {
      this.setUA();
      console.log('RUN__ua-parser.js');
    }

    getBrowser() {
      return this.uaParser.browser.name.replace(/\s+/g, '').toLowerCase();
    }

    getDevice() {
      const type = this.uaParser.device.type;
      let type_result = '';
      if (type == 'mobile') {
        type_result = 'sp';
      } else if (type == 'tablet') {
        type_result = 'tb';
      } else {
        type_result = 'pc';
      }
      return type_result;
    }

    getModel() {
      return this.uaParser.device.model
        ? this.uaParser.device.model.replace(/\s+/g, '').toLowerCase()
        : '';
    }

    getOS() {
      return this.uaParser.os.name.replace(/\s+/g, '').toLowerCase();
    }

    setUA() {
      this.body.classList.add(`ua-${this.getBrowser()}`);
      this.body.classList.add(`ua-${this.getDevice()}`);
      if (this.getModel()) {
        this.body.classList.add(`ua-${this.getModel()}`);
      }
      this.body.classList.add(`ua-${this.getOS()}`);
    }
  }
  return new UA();
})();

export default ua;
