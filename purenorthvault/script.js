/* =========================================================
   PURE NORTH VAULT — script.js
   Edit the PRODUCTS array below to change the inventory.
   Nothing else needs to be touched to add or remove items.
   ========================================================= */

const EMAIL = "inquires@purenorthvault.com";

/* ---------------------------------------------------------
   INVENTORY
   line   : "footwear" or "pokemon"  (drives the filter chips)
   tag    : small badge on the photo — set to "" to hide it
   hot    : true = magenta badge instead of outline badge
   specs  : short chips under the title (size, condition, etc.)
   price  : a number in CAD, or null for "Price on request"
   img    : main photo · imgAlt : optional second photo on hover
   --------------------------------------------------------- */
const PRODUCTS = [
  {
    line: "footwear",
    name: "Nike Kobe 4 Protro \u2018Gift of Mamba\u2019",
    tag: "Deadstock",
    hot: true,
    specs: ["US 10", "DS", "OG box"],
    price: null,
    img: "assets/kobe4-gift-of-mamba.jpg",
    alt: "Nike Kobe 4 Protro Gift of Mamba, white and gold, heel detail"
  },
  {
    line: "footwear",
    name: "Air Jordan 1 Low OG SP \u2014 Reverse Swoosh",
    tag: "Deadstock",
    hot: false,
    specs: ["US 9", "DS", "With box"],
    price: null,
    img: "assets/aj1-low-reverse-swoosh.jpg",
    alt: "Air Jordan 1 Low OG in sail and pink with a red reverse swoosh, on its box"
  },
  {
    line: "pokemon",
    name: "Chaos Rising \u2014 Pok\u00e9mon Center ETB",
    tag: "Centre exclusive",
    hot: true,
    specs: ["Sealed", "ETB", "Multiples"],
    price: null,
    img: "assets/chaos-rising-etb.jpg",
    imgAlt: "assets/chaos-rising-etb-accessories.jpg",
    alt: "Pok\u00e9mon Center Chaos Rising Elite Trainer Box, sealed"
  },
  {
    line: "pokemon",
    name: "Surging Sparks \u2014 ETB + Booster Bundle",
    tag: "Bundle",
    hot: false,
    specs: ["Sealed", "ETB + 2-pack"],
    price: null,
    img: "assets/surging-sparks-2pack.jpg",
    alt: "Surging Sparks Elite Trainer Box bundled with a booster bundle 2-pack"
  },
  {
    line: "pokemon",
    name: "Prismatic Evolutions \u2014 Super-Premium Collection",
    tag: "Grail",
    hot: true,
    specs: ["Sealed", "Super-Premium"],
    price: null,
    img: "assets/prismatic-evolutions-spc.jpg",
    alt: "Prismatic Evolutions Super-Premium Collection box, sealed"
  },
  {
    line: "pokemon",
    name: "First Partner Illustration Collection",
    tag: "In stock",
    hot: false,
    specs: ["Sealed", "3 promos", "Qty 2"],
    price: null,
    img: "assets/first-partner-illustration.jpg",
    alt: "Two First Partner Illustration Collection Series 1 boxes"
  }
];

/* ---------------------------------------------------------
   RENDER THE GRID
   --------------------------------------------------------- */
const grid = document.getElementById("grid");

const money = n =>
  new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 }).format(n);

function cardHTML(p) {
  const badge = p.tag
    ? `<span class="card__tag${p.hot ? " card__tag--hot" : ""}">${p.tag}</span>`
    : "";
  const second = p.imgAlt
    ? `<img class="alt" src="${p.imgAlt}" alt="" loading="lazy" decoding="async">`
    : "";
  const specs = p.specs.map(s => `<li>${s}</li>`).join("");
  const price = p.price ? money(p.price) : "Price on request";
  const subject = encodeURIComponent(`Inquiry: ${p.name}`);
  const body = encodeURIComponent(`Item: ${p.name}\nSize / quantity:\nYour city:\n`);

  return `
  <article class="card reveal" data-line="${p.line}">
    <div class="card__media">
      ${badge}
      <img src="${p.img}" alt="${p.alt}" loading="lazy" decoding="async">
      ${second}
    </div>
    <div class="card__body">
      <p class="card__line">${p.line === "footwear" ? "Footwear" : "Pok\u00e9mon"}</p>
      <h3 class="card__name">${p.name}</h3>
      <ul class="card__specs">${specs}</ul>
      <div class="card__foot">
        <span class="card__price">${price}</span>
        <a class="card__cta" href="mailto:${EMAIL}?subject=${subject}&body=${body}">Inquire</a>
      </div>
    </div>
  </article>`;
}

function render(filter = "all") {
  const items = filter === "all" ? PRODUCTS : PRODUCTS.filter(p => p.line === filter);
  grid.innerHTML = items.map(cardHTML).join("");
  grid.querySelectorAll(".reveal").forEach(el => watcher.observe(el));
}

/* ---------------------------------------------------------
   FILTER CHIPS
   --------------------------------------------------------- */
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
  .querySelectorAll(".pillar, .stat, .vouch, .po, .form, .h2, .section__lede")
  .forEach(el => {
    el.classList.add("reveal");
    watcher.observe(el);
  });

/* ---------------------------------------------------------
   COMPASS — the needle points at your cursor
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
          Math.atan2(e.clientY - (box.top + box.height / 2), e.clientX - (box.left + box.width / 2)) *
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
   NAV — mobile toggle + stuck border
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
addEventListener("scroll", () => nav.classList.toggle("is-stuck", scrollY > 8), { passive: true });

/* ---------------------------------------------------------
   CONTACT FORM — composes an email, no backend needed
   Swap this for a Formspree / Netlify Forms endpoint later.
   --------------------------------------------------------- */
const form = document.getElementById("contactForm");
const note = document.getElementById("formNote");

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
  note.textContent = "Opening your email app\u2026";

  const name = document.getElementById("f-name").value.trim();
  const from = document.getElementById("f-email").value.trim();
  const topic = document.getElementById("f-topic").value;
  const msg = document.getElementById("f-msg").value.trim();

  const subject = encodeURIComponent(`${topic} — ${name}`);
  const body = encodeURIComponent(`${msg}\n\n—\n${name}\n${from}`);

  window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
});

/* ---------------------------------------------------------
   BOOT
   --------------------------------------------------------- */
document.getElementById("year").textContent = new Date().getFullYear();
render();
