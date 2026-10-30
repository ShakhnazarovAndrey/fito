import "swiper/css";
import "./styles/main.scss";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

import { heroIntro, initMagnetic, initScrollAnimations, runPreloader } from "./js/animations.js";
import { initProducts } from "./js/products.js";
import { initSliders } from "./js/sliders.js";
import { initFaq, initHeader } from "./js/ui.js";

const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

if ("scrollRestoration" in history) history.scrollRestoration = "manual";
window.scrollTo(0, 0);

let lenis = null;
if (!reducedMotion) {
  lenis = new Lenis({ lerp: 0.1 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  lenis.stop();
}

initProducts(lenis);
initSliders();
initHeader(lenis);
initFaq();

const year = document.querySelector("[data-year]");
if (year) year.textContent = new Date().getFullYear();

if (reducedMotion) {
  document.querySelector(".preloader")?.remove();
  document.body.classList.remove("is-loading");
} else {
  initScrollAnimations();
  initMagnetic();
  runPreloader(() => {
    lenis.start();
    heroIntro();
  });
}

// После загрузки картинок пересчитываем позиции триггеров
window.addEventListener("load", () => ScrollTrigger.refresh());
