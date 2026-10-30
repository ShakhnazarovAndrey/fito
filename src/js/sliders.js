import Swiper from "swiper";
import { A11y, FreeMode, Keyboard, Navigation } from "swiper/modules";

export function initSliders() {
  ["directions", "reviews", "gallery"].forEach((name) => {
    const el = document.querySelector(`[data-slider="${name}"]`);
    if (!el) return;

    new Swiper(el, {
      modules: [Navigation, FreeMode, Keyboard, A11y],
      slidesPerView: "auto",
      spaceBetween: 16,
      grabCursor: true,
      freeMode: name === "reviews" ? false : { enabled: true, momentumRatio: 0.6 },
      keyboard: { enabled: true, onlyInViewport: true },
      navigation: {
        prevEl: `[data-prev="${name}"]`,
        nextEl: `[data-next="${name}"]`,
      },
      a11y: {
        prevSlideMessage: "Предыдущий слайд",
        nextSlideMessage: "Следующий слайд",
      },
    });
  });
}
