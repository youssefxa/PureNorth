#!/usr/bin/env python3
"""
Bundles index.html + styles.css + script.js + assets/ into one
standalone file: purenorthvault-standalone.html

Run:  python3 build.py
Use it to preview or email the site without a server.
The multi-file version in this folder is the one to deploy.
"""
import base64, pathlib, re

here = pathlib.Path(__file__).parent
html = (here / "index.html").read_text()
css = (here / "styles.css").read_text()
js = (here / "script.js").read_text()

def data_uri(rel):
    p = here / rel
    mime = "image/png" if p.suffix.lower() == ".png" else "image/jpeg"
    return f"data:{mime};base64," + base64.b64encode(p.read_bytes()).decode()

# inline every assets/... reference in html, css and js
for path in sorted(here.glob("assets/*")):
    rel = f"assets/{path.name}"
    uri = data_uri(rel)
    html = html.replace(rel, uri)
    css = css.replace(rel, uri)
    js = js.replace(rel, uri)

# swap the <link> and <script src> for inline blocks
html = html.replace(
    '<link rel="stylesheet" href="styles.css">',
    f"<style>\n{css}\n</style>",
)
html = html.replace(
    '<script src="script.js"></script>',
    f"<script>\n{js}\n</script>",
)
# the favicon link now holds a huge data URI twice — leave it, it still works

out = here / "purenorthvault-standalone.html"
out.write_text(html)
print(f"built {out.name}  ({out.stat().st_size/1024:.0f} KB)")
