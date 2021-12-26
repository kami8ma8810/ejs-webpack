import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

// // スクロール開始でヘッダー背景を黒、サイズを小さくする
export default function () {
  console.log("header-change.js");
  ScrollTrigger.create({
    trigger: document.body,
    start: "1px top",
    end: "bottom+=10000 top",
    toggleClass: { targets: ".js-header", className: "is-scroll" },
    pinSpacing:false,
    pinSpacer:false,
    // markers: true,
  });
  window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
  });
}
