import gsap from "gsap";
import { products, orderLink } from "../data/products.js";

const cardTemplate = (p) => `
  <article class="product" tabindex="0" role="button" data-id="${p.id}" aria-label="Подробнее: ${p.title}, ${p.weight}">
    <div class="product__media">
      <img src="${p.image}" alt="${p.title}" loading="lazy" />
      <span class="tag">${p.tag}</span>
    </div>
    <div class="product__body">
      <span class="product__weight">${p.weight}</span>
      <h3 class="product__title">${p.title}</h3>
      <p class="product__short">${p.short}</p>
      <div class="product__foot">
        <span class="product__more">Подробнее <svg class="ico"><use href="#i-arrow" /></svg></span>
        <a class="product__order" href="${orderLink(p)}" target="_blank" rel="noopener" aria-label="Заказать в WhatsApp">
          <svg><use href="#i-wa" /></svg>
        </a>
      </div>
    </div>
  </article>`;

export function initProducts(lenis) {
  const grid = document.querySelector("[data-products]");
  const modal = document.querySelector(".modal");
  if (!grid || !modal) return;

  grid.innerHTML = products.map(cardTemplate).join("");

  const backdrop = modal.querySelector(".modal__backdrop");
  const panel = modal.querySelector(".modal__panel");
  const img = modal.querySelector(".modal__media img");
  const tag = modal.querySelector(".modal__tag");
  const title = modal.querySelector(".modal__title");
  const content = modal.querySelector(".modal__content");
  const order = modal.querySelector(".modal__order");
  const body = modal.querySelector(".modal__body");
  const closeBtn = modal.querySelector(".modal__close");
  let lastFocus = null;

  const open = (id) => {
    const p = products.find((item) => item.id === id);
    if (!p) return;

    img.src = p.image;
    img.alt = p.title;
    tag.textContent = p.tag;
    title.innerHTML = `${p.title}<small>${p.weight}</small>`;
    content.innerHTML =
      p.description.map((t) => `<p>${t}</p>`).join("") +
      `<dl>${p.specs.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("")}</dl>`;
    order.href = orderLink(p);
    body.scrollTop = 0;

    lastFocus = document.activeElement;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    lenis?.stop();

    gsap
      .timeline()
      .to(backdrop, { opacity: 1, duration: 0.4 })
      .fromTo(
        panel,
        { opacity: 0, y: 60, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "expo.out" },
        "<0.05",
      )
      .from(body.children, { y: 20, opacity: 0, stagger: 0.05, duration: 0.6, ease: "expo.out" }, "<0.15");

    closeBtn.focus({ preventScroll: true });
  };

  const close = () => {
    if (!modal.classList.contains("is-open")) return;
    gsap
      .timeline({
        onComplete: () => {
          modal.classList.remove("is-open");
          modal.setAttribute("aria-hidden", "true");
          lenis?.start();
          lastFocus?.focus({ preventScroll: true });
        },
      })
      .to(panel, { opacity: 0, y: 40, duration: 0.35, ease: "power3.in" })
      .to(backdrop, { opacity: 0, duration: 0.3 }, "<0.1");
  };

  grid.addEventListener("click", (e) => {
    if (e.target.closest(".product__order")) return;
    const card = e.target.closest(".product");
    if (card) open(card.dataset.id);
  });

  grid.addEventListener("keydown", (e) => {
    const card = e.target.closest(".product");
    if (card && e.target === card && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      open(card.dataset.id);
    }
  });

  modal.querySelectorAll("[data-modal-close]").forEach((el) => el.addEventListener("click", close));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}
