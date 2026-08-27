# Pure North Vault — website

Static site. No build step, no dependencies, no server needed.

```
index.html      all the page copy and structure
styles.css      the whole design system (colours + type at the top)
script.js       inventory data, filtering, form, compass interaction
assets/         your product photos and logo
build.py        optional: bundles everything into one shareable file
```

## Run it

Double-click `index.html`, or from this folder:

```bash
python3 -m http.server 8000     # then open http://localhost:8000
```

## Deploy it

Drag this whole folder onto **netlify.com/drop** or **vercel.com** — it's live in
about ten seconds. Then point `purenorthvault.com` at it in the host's domain settings.
GitHub Pages and Cloudflare Pages work the same way.

## Add or remove a product

Everything on the inventory grid comes from the `PRODUCTS` array at the top of
`script.js`. Copy a block, change the fields:

```js
{
  line:  "footwear",              // "footwear" or "pokemon" — drives the filter chips
  name:  "Air Jordan 4 Nigel Sylvester",
  tag:   "Just in",               // badge on the photo, "" hides it
  hot:   true,                    // true = solid magenta badge
  specs: ["US 10", "DS", "OG box"],
  price: 750,                     // a number in CAD, or null for "Price on request"
  img:   "assets/aj4-nigel.jpg",
  imgAlt:"assets/aj4-nigel-2.jpg",// optional second photo, shows on hover
  alt:   "Air Jordan 4 Nigel Sylvester on a purple backdrop"
}
```

Drop the photo into `assets/` first. Shoot it on your usual backdrop and it'll
match the rest of the grid automatically.

## Change a review

The reviews are plain HTML in `index.html` — search for `class="vouch"`.
They're placed between sections on purpose so they break up the page.
**Replace the placeholder text with real customer quotes before you go live.**

## Change the email

The address appears in two places: the `EMAIL` constant at the top of `script.js`,
and the `mailto:` links in `index.html`. Find-and-replace
`inquires@purenorthvault.com` and you've got them all.

## The contact form

Right now it composes an email and opens the visitor's mail app — no backend, so
nothing to host or pay for. If you'd rather have submissions land in an inbox
automatically, sign up at formspree.io, then in `script.js` replace the
`window.location.href = ...` line in the submit handler with a `fetch()` POST to
your Formspree endpoint.

## Colours and type

Top of `styles.css`, in `:root`. Change one hex value and it updates everywhere.

```
--magenta #FF3D9A    --violet #6C3BE8    --ice #5FD6D0
--ink     #08071A    --vault  #140E33    --bone #EFEAF7
```

## One-file version

```bash
python3 build.py
```

Produces `purenorthvault-standalone.html` — the entire site including images in a
single file you can email, put on a USB stick, or open anywhere offline.
Deploy the multi-file version, not this one; it's ~900 KB and slower to load.
# PureNorth
