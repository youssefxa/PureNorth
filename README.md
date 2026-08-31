# Pure North Vault

Static multi-page site. No build step, no dependencies, no framework.

```
index.html        Home: hero, categories, pre-order teaser
about.html        Buy / Sell / Trade
inventory.html    Filterable product grid
preorders.html    30th Anniversary + sourcing blocks
reviews.html      All Instagram reviews
contact.html      Details + email form
styles.css        The whole design system
script.js         Product data, filters, countdown, form
vercel.json       Clean URLs + image caching
assets/           Logo and product photos
```

## Run locally

Open `index.html`, or use the Live Server extension in VS Code.

## Deploy

Push to GitHub. Vercel picks it up automatically. Framework preset: **Other**,
build command empty, output directory empty.

`vercel.json` turns on clean URLs, so `/inventory.html` becomes `/inventory` in
production. Links still work either way.

## Change stock or pricing

Everything on the inventory page comes from the `PRODUCTS` array at the top of
`script.js`.

```js
{
  line:    "footwear",        // "footwear" or "tcg" - drives the filter chips
  name:    "Kobe 4 Protro 'Draft Pack'",
  tag:     "Footwear",        // badge, top left of the photo
  hot:     true,              // true = solid magenta badge
  specs:   ["US 9.5", "US 12"],
  price:   260,               // CAD. Use null when out of stock.
  inStock: true,              // false greys the card and hides the price
  cta:     "Request your size", // optional, defaults to "Inquire"
  img:     "assets/kobe4-gift-of-mamba.jpg",
  imgAlt:  "assets/second-photo.jpg",  // optional, shows on hover
  alt:     "Description for screen readers"
}
```

**To mark something sold out:** set `inStock: false` and `price: null`.
**To put it back:** set `inStock: true` and give it a price.

Add new photos to `assets/` first. Shoot them on your usual backdrop and they
match the rest of the grid automatically. Keep filenames lowercase with hyphens,
no spaces. Vercel's servers are case-sensitive even though your Mac is not.

## Change the pre-order release date

In `preorders.html`, find `data-release="2026-09-16T00:00:00-04:00"` and change
the date. The countdown updates itself. Prices and item names are plain HTML
just below it.

## Add a review

Reviews live in two places:

- **reviews.html** has the full list. Copy a `<figure class="rev">` block and
  swap the handle and text.
- **Floating reviews** appear on the other pages as `<figure class="vouch">`.
  Search for `class="vouch"` to find them.

## Change the email address

`inquires@purenorthvault.com` appears in the `EMAIL` constant in `script.js` and
in `mailto:` links across the HTML files. Use find-and-replace across the folder
(Cmd+Shift+F in VS Code) to catch them all.

## Editing the nav or footer

They are repeated in all six HTML files, since there is no build step. Change one,
change all six. Cmd+Shift+F makes this quick.

## Colours and type

Top of `styles.css`, in `:root`.

```
--magenta #FF3D9A    --violet #6C3BE8    --ice #5FD6D0
--ink     #08071A    --vault  #140E33    --bone #EFEAF7
```

## The contact form

Composes an email and opens the visitor's mail app. No backend to host or pay for.
To get submissions in your inbox automatically instead, sign up at formspree.io and
replace the `window.location.href` line in the submit handler with a `fetch()` POST
to your endpoint.
