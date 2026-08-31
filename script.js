/* =========================================================
   PURE NORTH VAULT - script.js
   Shared by every page. Edit PRODUCTS below to change stock.
   ========================================================= */

const EMAIL = "inquires@purenorthvault.com";

/* ---------------------------------------------------------
   INVENTORY
   line    : "footwear" or "tcg"   - drives the filter chips
   tag     : badge on the top left of the photo
   hot     : true = solid magenta badge, false = outline badge
   specs   : small chips under the title (sizes, condition)
   price   : number in CAD. Leave as null when out of stock.
   inStock : false greys the card and hides the price
   cta     : text on the button. Defaults to "Inquire".
   img     : main photo   imgAlt : optional second photo on hover
   --------------------------------------------------------- */
const PRODUCTS = [
  {
    line: "footwear",
    name: "Kobe 4 Protro \u2018Draft Pack\u2019",
    tag: "Footwear",
    hot: true,
    specs: ["US 9.5", "US 12"],
    price: 260,
    inStock: true,
    img: "assets/kobe4-gift-of-mamba.jpg",
    alt: "Kobe 4 Protro Draft Pack in white and gold, heel detail"
  },
  {
    line: "footwear",
    name: "Jordan 1 Low x Travis \u2018Tropical Pink\u2019",
    tag: "Footwear",
    hot: false,
    specs: ["Sizing on request"],
    price: null,
    inStock: false,
    cta: "Request your size",
    img: "assets/aj1-low-reverse-swoosh.jpg",
    alt: "Jordan 1 Low x Travis Scott Tropical Pink on its box"
  },
  {
    line: "tcg",
    name: "Chaos Rising PC Exclusive ETB",
    tag: "Mega Evolution",
    hot: true,
    specs: ["Sealed", "Pok\u00e9mon Center"],
    price: 200,
    inStock: true,
    img: "assets/chaos-rising-etb.jpg",
    imgAlt: "assets/chaos-rising-etb-accessories.jpg",
    alt: "Pok\u00e9mon Center Chaos Rising Elite Trainer Box, sealed"
  },
  {
    line: "tcg",
    name: "Surging Sparks ETB + Booster Bundle",
    tag: "Scarlet & Violet",
    hot: false,
    specs: ["Sealed", "ETB + 2-pack"],
    price: 240,
    inStock: true,
    img: "assets/surging-sparks-2pack.jpg",
    alt: "Surging Sparks Elite Trainer Box with a booster bundle 2-pack"
  },
  {
    line: "tcg",
    name: "Prismatic Evolutions Super-Premium Collection",
    tag: "Scarlet & Violet",
    hot: true,
    specs: ["Sealed", "Super-Premium"],
    price: 360,
    inStock: true,
    img: "assets/prismatic-evolutions-spc.jpg",
    alt: "Prismatic Evolutions Super-Premium Collection box, sealed"
  },
  {
    line: "tcg",
    name: "First Partners Illustration Series 1",
    tag: "Mega Evolution",
    hot: false,
    specs: ["Sealed", "3 promo cards"],
    price: null,
    inStock: false,
    cta: "Ask about restock",
    img: "assets/first-partner-illustration.jpg",
    alt: "Two First Partner Illustration Collection Series 1 boxes"
  }
];

/* ---------------------------------------------------------
   SCROLL REVEAL
   --------------------------------------------------------- */
const watcher = new IntersectionObserver(
  entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("is-in");
        watcher.unobserve(e.target);
      }
    });
  },
  { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
);

document
  .querySelectorAll(".pillar, .cat, .stat, .vouch, .rev, .po, .form, .h2, .section__lede")
  .forEach(el => {
    el.classList.add("reveal");
    watcher.observe(el);
  });

/* ---------------------------------------------------------
   INVENTORY GRID (inventory.html only)
   --------------------------------------------------------- */
const grid = document.getElementById("grid");

const money = n =>
  new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0
  }).format(n);

function cardHTML(p) {
  const badge = p.tag
    ? `<span class="card__tag${p.hot ? " card__tag--hot" : ""}">${p.tag}</span>`
    : "";
  const soldOut = p.inStock ? "" : `<span class="card__out">Out of stock</span>`;
  const second = p.imgAlt
    ? `<img class="alt" src="${p.imgAlt}" alt="" loading="lazy" decoding="async">`
    : "";
  const specs = p.specs.map(s => `<li>${s}</li>`).join("");
  const price = p.inStock && p.price ? money(p.price) : "Out of stock";
  const cta = p.cta || "Inquire";
  const subject = encodeURIComponent(`${p.inStock ? "Inquiry" : "Request"}: ${p.name}`);
  const body = encodeURIComponent(`Item: ${p.name}\nSize / quantity:\nYour city:\n`);

  return `
  <article class="card reveal${p.inStock ? "" : " is-out"}" data-line="${p.line}">
    <div class="card__media">
      ${badge}${soldOut}
      <img src="${p.img}" alt="${p.alt}" loading="lazy" decoding="async">
      ${second}
    </div>
    <div class="card__body">
      <p class="card__line">${p.line === "footwear" ? "Footwear" : "Sealed TCG"}</p>
      <h3 class="card__name">${p.name}</h3>
      <ul class="card__specs">${specs}</ul>
      <div class="card__foot">
        <span class="card__price${p.inStock ? "" : " is-gone"}">${price}</span>
        <a class="card__cta" href="mailto:${EMAIL}?subject=${subject}&body=${body}">${cta}</a>
      </div>
    </div>
  </article>`;
}

function render(filter = "all") {
  if (!grid) return;
  const items = filter === "all" ? PRODUCTS : PRODUCTS.filter(p => p.line === filter);
  grid.innerHTML = items.length
    ? items.map(cardHTML).join("")
    : `<p class="grid__empty">Nothing listed in this category right now. <a href="mailto:${EMAIL}?subject=Sourcing%20request">Ask us to source it.</a></p>`;
  grid.querySelectorAll(".reveal").forEach(el => watcher.observe(el));
}

document.querySelectorAll(".chip").forEach(chip => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".chip").forEach(c => {
      c.classList.remove("is-on");
      c.setAttribute("aria-selected", "false");
    });
    chip.classList.add("is-on");
    chip.setAttribute("aria-selected", "true");
    render(chip.dataset.filter);
  });
});

render();

/* ---------------------------------------------------------
   PRE-ORDER COUNTDOWN (preorders.html only)
   Change the date in the data-release attribute in the HTML.
   --------------------------------------------------------- */
const cd = document.getElementById("countdown");

function tickCountdown() {
  const gap = new Date(cd.dataset.release) - new Date();
  if (gap <= 0) {
    cd.innerHTML = `<p class="cd__label">Released. Message us for current stock.</p>`;
    return;
  }
  const d = Math.floor(gap / 86400000);
  const h = Math.floor((gap % 86400000) / 3600000);
  const m = Math.floor((gap % 3600000) / 60000);
  cd.innerHTML =
    `<div class="cd__unit"><b>${d}</b><span>days</span></div>` +
    `<div class="cd__unit"><b>${h}</b><span>hrs</span></div>` +
    `<div class="cd__unit"><b>${m}</b><span>min</span></div>` +
    `<p class="cd__label">until release day</p>`;
}

if (cd) {
  tickCountdown();
  setInterval(tickCountdown, 30000);
}

/* ---------------------------------------------------------
   COMPASS - the needle points at your cursor (home page)
   --------------------------------------------------------- */
const star = document.getElementById("roseStar");
const compass = document.getElementById("compass");
const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (star && compass && !calm) {
  let frame;
  window.addEventListener(
    "pointermove",
    e => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const box = compass.getBoundingClientRect();
        const angle =
          Math.atan2(
            e.clientY - (box.top + box.height / 2),
            e.clientX - (box.left + box.width / 2)
          ) *
            (180 / Math.PI) +
          90;
        star.style.transform = `rotate(${angle}deg)`;
        frame = null;
      });
    },
    { passive: true }
  );
}

/* ---------------------------------------------------------
   NAV
   --------------------------------------------------------- */
const nav = document.getElementById("nav");
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

navToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(open));
});
navLinks.addEventListener("click", e => {
  if (e.target.tagName === "A") {
    navLinks.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});
addEventListener("scroll", () => nav.classList.toggle("is-stuck", scrollY > 8), {
  passive: true
});

/* ---------------------------------------------------------
   CONTACT FORM - composes an email, no backend needed
   --------------------------------------------------------- */
const form = document.getElementById("contactForm");
const note = document.getElementById("formNote");

if (form) {
  form.addEventListener("submit", e => {
    e.preventDefault();

    const fields = ["f-name", "f-email", "f-msg"].map(id => document.getElementById(id));
    let ok = true;

    fields.forEach(f => {
      const bad = !f.value.trim() || (f.type === "email" && !f.checkValidity());
      f.parentElement.classList.toggle("is-bad", bad);
      if (bad) ok = false;
    });

    if (!ok) {
      note.textContent = "Fill in your name, a valid email, and the details.";
      note.classList.add("is-bad");
      fields.find(f => f.parentElement.classList.contains("is-bad")).focus();
      return;
    }

    note.classList.remove("is-bad");
    note.textContent = "Opening your email app...";

    const name = document.getElementById("f-name").value.trim();
    const from = document.getElementById("f-email").value.trim();
    const topic = document.getElementById("f-topic").value;
    const msg = document.getElementById("f-msg").value.trim();

    const subject = encodeURIComponent(`${topic}: ${name}`);
    const body = encodeURIComponent(`${msg}\n\n--\n${name}\n${from}`);

    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
  });
}

/* ---------------------------------------------------------
   BOOT
   --------------------------------------------------------- */
document.getElementById("year").textContent = new Date().getFullYear();
