import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Шапка: прячется при скролле вниз, бургер-меню, плавные якоря
export function initHeader(lenis) {
  const header = document.querySelector(".header");
  const burger = header.querySelector(".burger");
  const menu = header.querySelector(".mobile-menu");
  const fab = document.querySelector(".fab");
  const hero = document.querySelector(".hero");
  let lastY = 0;

  const setMenu = (isOpen) => {
    menu.classList.toggle("is-open", isOpen);
    burger.setAttribute("aria-expanded", String(isOpen));
    burger.setAttribute("aria-label", isOpen ? "Закрыть меню" : "Открыть меню");
  };

  burger.addEventListener("click", () => setMenu(!menu.classList.contains("is-open")));

  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 40);
    if (!menu.classList.contains("is-open")) {
      header.classList.toggle("is-hidden", y > 400 && y > lastY);
    }
    fab.classList.toggle("is-visible", y > hero.offsetHeight * 0.6);
    lastY = y;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      const target = id === "#top" ? 0 : document.querySelector(id);
      if (target === null) return;
      e.preventDefault();
      setMenu(false);
      if (lenis) {
        lenis.scrollTo(target, { offset: -20, duration: 1.4 });
      } else {
        (target || document.body).scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}

// Плавное раскрытие вопросов FAQ
export function initFaq() {
  document.querySelectorAll(".faq-item").forEach((item) => {
    const summary = item.querySelector("summary");
    const body = item.querySelector(".faq-item__body");

    summary.addEventListener("click", (e) => {
      e.preventDefault();
      if (item.classList.contains("is-open")) {
        item.classList.remove("is-open");
        gsap.to(body, {
          height: 0,
          duration: 0.5,
          ease: "power3.inOut",
          onComplete: () => {
            item.open = false;
            ScrollTrigger.refresh();
          },
        });
      } else {
        item.open = true;
        item.classList.add("is-open");
        gsap.fromTo(
          body,
          { height: 0 },
          { height: "auto", duration: 0.6, ease: "power3.out", onComplete: () => ScrollTrigger.refresh() },
        );
      }
    });
  });
}
