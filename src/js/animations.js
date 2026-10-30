import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Разбивает текст заголовка на слова, сохраняя <em> и <br>.
// Неразрывные пробелы (&nbsp;) не трогаем — слова, связанные ими, остаются вместе.
function splitWords(root) {
  const words = [];
  const walk = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/([ \t\n\r]+)/).forEach((part) => {
          if (!part) return;
          if (/^[ \t\n\r]+$/.test(part)) {
            frag.append(" ");
            return;
          }
          const outer = document.createElement("span");
          const inner = document.createElement("span");
          outer.className = "word";
          inner.textContent = part;
          outer.append(inner);
          frag.append(outer);
          words.push(inner);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== "BR") {
        walk(child);
      }
    });
  };
  walk(root);
  return words;
}

export function runPreloader(onReveal) {
  const el = document.querySelector(".preloader");
  const count = el.querySelector("[data-preloader-count]");
  const progress = { v: 0 };

  const fontsReady = Promise.race([
    document.fonts.ready,
    new Promise((r) => setTimeout(r, 1500)),
  ]);

  const tl = gsap.timeline({
    paused: true,
    onComplete: () => {
      el.remove();
      document.body.classList.remove("is-loading");
    },
  });

  tl.from(".preloader__inner > *", {
    y: 20,
    opacity: 0,
    stagger: 0.08,
    duration: 0.6,
    ease: "power3.out",
  })
    .to(
      progress,
      {
        v: 100,
        duration: 1.1,
        ease: "power2.inOut",
        onUpdate: () => (count.textContent = Math.round(progress.v)),
      },
      0,
    )
    .to(".preloader__inner", { y: -30, opacity: 0, duration: 0.45, ease: "power3.in" })
    .to(el, { yPercent: -100, duration: 1, ease: "expo.inOut" }, "-=0.1")
    .add(onReveal, "-=0.8");

  fontsReady.then(() => tl.play());
}

export function heroIntro() {
  const tl = gsap.timeline({ defaults: { ease: "expo.out", duration: 1.4 } });

  tl.fromTo(
    ".hero__card",
    { clipPath: "inset(5% 4% 5% 4% round 32px)" },
    { clipPath: "inset(0% 0% 0% 0% round 32px)", duration: 1.6, ease: "expo.inOut", clearProps: "clipPath" },
  )
    .from(".hero__title .line__in", { yPercent: 115, stagger: 0.1 }, 0.5)
    .from(".hero__pill", { width: 0, marginRight: 0, duration: 1.3 }, 0.9)
    .from(".hero__doctor", { yPercent: 14, opacity: 0, duration: 1.8 }, 0.6)
    .from(
      [".hero__eyebrow", ".hero__lead", ".hero__actions > *", ".hero__bottom > *"],
      { y: 24, opacity: 0, stagger: 0.07, duration: 1.1 },
      0.9,
    )
    .from(".hero__doctor .glass-tag", { scale: 0.8, opacity: 0, duration: 1 }, 1.4)
    .from(".hero__stats li", { x: 30, opacity: 0, stagger: 0.08, duration: 1.1 }, 1.1)
    .from(".header__bar", { yPercent: -160, duration: 1.2 }, 1);

  document.querySelectorAll(".hero [data-count]").forEach((el) => {
    const end = Number(el.dataset.count);
    const o = { v: 0 };
    tl.to(
      o,
      {
        v: end,
        duration: 2,
        ease: "power2.out",
        onUpdate: () => (el.textContent = Math.round(o.v)),
      },
      1.1,
    );
  });
}

export function initScrollAnimations() {
  // Параллакс в hero
  const heroScrub = { trigger: ".hero", start: "top top", end: "bottom top", scrub: true };
  gsap.to(".hero__doctor > img", { yPercent: 8, ease: "none", scrollTrigger: heroScrub });
  gsap.to(".hero__content", { y: -90, ease: "none", scrollTrigger: heroScrub });
  gsap.to(".hero__herbs", { y: 140, ease: "none", scrollTrigger: heroScrub });
  gsap.to(".hero__bg", { yPercent: 12, ease: "none", scrollTrigger: heroScrub });

  // Заголовки — по словам
  gsap.utils.toArray("[data-split]").forEach((el) => {
    const words = splitWords(el);
    gsap.from(words, {
      yPercent: 115,
      duration: 1.2,
      ease: "expo.out",
      stagger: 0.045,
      scrollTrigger: { trigger: el, start: "top 88%" },
    });
  });

  gsap.utils.toArray("[data-reveal]").forEach((el) => {
    gsap.from(el, {
      y: 40,
      opacity: 0,
      duration: 1.2,
      ease: "expo.out",
      scrollTrigger: { trigger: el, start: "top 90%" },
    });
  });

  gsap.utils.toArray("[data-stagger]").forEach((el) => {
    gsap.from(el.children, {
      y: 50,
      opacity: 0,
      duration: 1.1,
      ease: "expo.out",
      stagger: 0.07,
      scrollTrigger: { trigger: el, start: "top 86%" },
    });
  });

  // Карточки слайдеров выезжают справа
  [".directions__slider", ".gallery__slider", ".reviews__slider"].forEach((sel) => {
    gsap.from(`${sel} .swiper-slide`, {
      x: 120,
      opacity: 0,
      duration: 1.4,
      ease: "expo.out",
      stagger: 0.08,
      scrollTrigger: { trigger: sel, start: "top 85%" },
    });
  });

  gsap.utils.toArray("[data-parallax-y]").forEach((el) => {
    gsap.to(el, {
      yPercent: Number(el.dataset.parallaxY),
      ease: "none",
      scrollTrigger: { trigger: el.closest("section"), start: "top bottom", end: "center top", scrub: true },
    });
  });

  gsap.from(".doctor__photo", {
    y: 80,
    opacity: 0,
    duration: 1.6,
    ease: "expo.out",
    scrollTrigger: { trigger: ".doctor__visual", start: "top 75%" },
  });
  gsap.from(".doctor__circle", {
    scale: 0.6,
    opacity: 0,
    duration: 1.8,
    ease: "expo.out",
    scrollTrigger: { trigger: ".doctor__visual", start: "top 75%" },
  });

  gsap.to(".story__progress", {
    scaleX: 1,
    ease: "none",
    scrollTrigger: { trigger: ".story__list", start: "top 85%", end: "bottom 55%", scrub: true },
  });

  // Финальный CTA раскрывается и фон уходит в параллакс
  gsap.fromTo(
    ".cta__card",
    { clipPath: "inset(6% 5% 0% 5% round 32px)" },
    {
      clipPath: "inset(0% 0% 0% 0% round 32px)",
      ease: "none",
      scrollTrigger: { trigger: ".cta", start: "top bottom", end: "top 25%", scrub: true },
    },
  );
  gsap.fromTo(
    ".cta__bg",
    { yPercent: -6 },
    {
      yPercent: 6,
      ease: "none",
      scrollTrigger: { trigger: ".cta", start: "top bottom", end: "bottom top", scrub: true },
    },
  );
}

// «Магнитные» кнопки — только для устройств с мышью
export function initMagnetic() {
  if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  document.querySelectorAll("[data-magnetic]").forEach((el) => {
    const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3" });
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - r.left - r.width / 2) * 0.25);
      yTo((e.clientY - r.top - r.height / 2) * 0.35);
    });
    el.addEventListener("mouseleave", () => {
      xTo(0);
      yTo(0);
    });
  });
}
