import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export default function () {
  console.log('RUN__pararallx.js');
  // const parallaxSection1 = document.querySelector(".js-parallax-section1");
  // const parallaxSection2 = document.querySelector(".js-parallax-section2");
  // const parallaxSection3 = document.querySelector(".js-parallax-section3");
  // const parallaxImg1 = document.querySelector(".js-parallax-img1");
  // const parallaxImg2 = document.querySelector(".js-parallax-img2");
  // const parallaxImg3 = document.querySelector(".js-parallax-img3");
  // const parallaxImg4 = document.querySelector(".js-parallax-img4");

  gsap.to('body', {
    backgroundColor: 'black',
    duration: 5,
  });
  // gsap.fromTo(
  //   parallaxImg1,
  //   { yPercent: 50 },
  //   {
  //     yPercent: -50,
  //     ease: "none",
  //     scrollTrigger: {
  //       trigger: parallaxSection1,
  //       start: "top bottom",
  //       end: "bottom top",
  //       scrub: 0.5,
  //     },
  //   }
  // );
  // gsap.fromTo(
  //   parallaxImg2,
  //   { yPercent: 50 },
  //   {
  //     yPercent: -50,
  //     ease: "none",
  //     scrollTrigger: {
  //       trigger: parallaxSection2,
  //       start: "top bottom",
  //       end: "bottom top",
  //       scrub: 0.5,
  //     },
  //   }
  // );
  // gsap.fromTo(
  //   parallaxImg3,
  //   { yPercent: 70 },
  //   {
  //     yPercent: -70,
  //     ease: "none",
  //     scrollTrigger: {
  //       trigger: parallaxSection3,
  //       start: "top bottom",
  //       end: "bottom top",
  //       scrub: 0.5,
  //     },
  //   }
  // );
  // gsap.fromTo(
  //   parallaxImg4,
  //   { yPercent: 70 },
  //   {
  //     yPercent: -70,
  //     ease: "none",
  //     scrollTrigger: {
  //       trigger: parallaxSection3,
  //       start: "top bottom",
  //       end: "bottom top",
  //       scrub: 1.2,
  //     },
  //   }
  // );
}
