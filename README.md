# Kupkop PH — Marketing Website

The public, pre-launch marketing site for **Kupkop PH**, an animal-welfare community
for Filipino fur parents (the *Sagip* module). It explains the product, builds trust
with shelters and fur parents, and funnels visitors into two Google Forms: a **waitlist**
and a **partner application**.

It's a plain static site — **no build step, no dependencies**. Just HTML, one CSS file,
and a small JS file.

---

## Pages

| File | Purpose |
|------|---------|
| `index.html` | Home — hero, mission, how-it-works summary, feature teaser |
| `how-it-works.html` | The Sagip rescue → adopt → support flow in depth |
| `features.html` | Full feature set (rescue, adoption, donations, walks, lost & found, etc.) |
| `shelters.html` | The pitch for shelters & rescue orgs |
| `partner.html` | Partner application page (who/what/how + FAQ + apply) |
| `about.html` | Mission, what we're building, trust & safety |
| `waitlist.html` | Waitlist signup (links to the Google Form) |
| `privacy.html` | Privacy Policy (RA 10173 — starter template) |
| `terms.html` | Terms of Service (starter template) |
| `404.html` | Branded "page not found" page |

### Other files
- `robots.txt` — allows all crawlers, points to the sitemap
- `sitemap.xml` — lists all public pages (uses `https://kupkop.ph`)
- `gen-assets.js` — regenerates the share image + favicons (`node gen-assets.js`)

### Shared assets
- `assets/styles.css` — all styling (single source of truth; design tokens are CSS
  variables in `:root`)
- `assets/app.js` — mobile menu toggle + footer year
- `assets/kupkop-logo-only.png` — header/icon mark
- `assets/kupkop-logo.png` — full logo (footer, hero card)
- `assets/og-cover.png` — 1200×630 social-share image (Facebook/Instagram/Twitter previews)
- `assets/favicon-32.png`, `assets/apple-touch-icon.png` — browser-tab + mobile icons

---

## Run locally

From this `website/` folder:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>. (Any static server works — e.g. `npx serve`.)

---

## Forms

Both forms are Google Forms, linked out via buttons (they open in a new tab).
The owning inbox is **team.kupkopph@gmail.com**.

| Form | Linked from | Where the URL lives |
|------|-------------|---------------------|
| Waitlist | "Join the waitlist" buttons | `<a>` in `waitlist.html` |
| Partner application | "Partner with us" buttons | `<a>` in the `#apply` section of `partner.html` |

**To change a form link:** edit the `href` on the relevant button.

> ⚠️ Make sure each Google Form is set to **"Anyone can respond"** (not restricted to an
> organization), or visitors will hit a Google sign-in wall. Test each link in an
> incognito window.

---

## Domain & social previews

The Open Graph / Twitter tags and `sitemap.xml` / `robots.txt` use the absolute base URL
**`https://kupkop.ph`**. Social platforms (Facebook, Instagram, Messenger, Twitter/X)
**require absolute URLs** for the share image to appear.

> ⚠️ If you deploy to a different domain (e.g. a Netlify/Vercel subdomain), find-and-replace
> `https://kupkop.ph` across all `.html` files, `sitemap.xml`, and `robots.txt` with your
> real URL — otherwise link previews and the sitemap will point to the wrong place.

After deploying, paste your URL into the **[Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)**
to preview the share card and refresh Facebook's cache.

To regenerate the share image or favicons (e.g. after a logo change): `node gen-assets.js`.

---

## Social media

Footer icon links appear on **every** page (the `.social` block in each footer; styled by
the `.social` rules in `assets/styles.css`).

| Platform | URL |
|----------|-----|
| Facebook | <https://www.facebook.com/share/18pbnFj2VZ/?mibextid=wwXIfr> |
| Instagram | <https://www.instagram.com/kupkopph?utm_source=qr> |

**To change a social link:** update the `href` in the `<div class="social">` block — and
because the footer is duplicated, change it in **every** HTML file (or do a find-and-replace
across the folder).

---

## Editing tips

- **Colors / spacing:** change the CSS variables in `:root` at the top of
  `assets/styles.css` — they cascade everywhere.
- **Nav & footer:** these are duplicated in each HTML file (no templating). If you change
  a nav item or footer link, update it in **every** page. The active nav item uses
  `class="lnk active"`.
- **Contact email:** `team.kupkopph@gmail.com` appears in footers and legal pages.
- **Legal pages:** `privacy.html` and `terms.html` are **starter templates, not legal
  advice** — expand and have them reviewed before the app collects real user data.

---

## Deploy

It's a static folder, so any static host works (Netlify, Cloudflare Pages, Vercel,
GitHub Pages, S3 + CloudFront…). **No build command; the site files are at the repo root,
so the publish/output directory is `/`.**

**Recommended host: Netlify** — easiest to set up and maintain for a pre-launch site.

### Step-by-step: deploy to Netlify + connect `kupkop.ph`

**A. Push the repo to GitHub** (this folder is already a git repo)
```bash
git remote add origin https://github.com/<your-username>/kupkop-website.git
git push -u origin main
```

**B. Deploy on Netlify**
1. Sign up at [netlify.com](https://www.netlify.com) (use **team.kupkopph@gmail.com**).
2. **Add new site → Import from Git →** pick the `kupkop-website` repo.
   (Or **drag-and-drop** the `website/` folder if you'd rather skip Git.)
3. Build command: **none** · Publish directory: **`/`** · Deploy.
4. You'll get a temporary URL like `kupkopph.netlify.app` — open it and confirm everything works.

**C. Register the domain**
- Register **`kupkop.ph`** at the official registrar **[domains.dot.ph](https://domains.dot.ph)**
  (~₱1,200–2,500/yr). Register it to **team.kupkopph@gmail.com**.

**D. Connect the domain in Netlify**
- Netlify → site → **Domain settings → Add a custom domain →** `kupkop.ph`. Then either:
  - **Option A (recommended) — Netlify DNS:** copy the 4 nameservers Netlify shows, log into
    dot.ph, and replace the domain's nameservers with them. Netlify manages DNS + SSL.
  - **Option B — keep DNS at dot.ph:** add an `A` record for `@` → `75.2.60.5`, and a
    `CNAME` for `www` → `your-site.netlify.app`.

**E. After it's live**
- Netlify auto-issues a free **SSL certificate** (wait a few minutes → `https://kupkop.ph`).
- Set `www` to redirect to the root domain (Netlify does this automatically).
- DNS can take a few hours to propagate — be patient.
- Validate the share card at the
  [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/).

> The OG tags, `sitemap.xml`, and `robots.txt` already use `https://kupkop.ph`, so **no edits
> are needed once the domain is live**. Only if you stay on a temp URL (e.g.
> `kupkopph.netlify.app`) should you find-and-replace `https://kupkop.ph` with that URL — and
> switch it back when the domain is connected.

**To update the site later:** edit files → `git commit` → `git push`. Netlify redeploys
automatically. (Drag-and-drop users: re-drop the folder.)

---

## Status & next steps

- [x] 9 content pages + 404, responsive, brand-consistent
- [x] Waitlist + partner Google Forms wired in
- [x] Privacy & Terms (templates)
- [x] Social-share image (`og:image`) + OG/Twitter tags on every page
- [x] Favicon + apple-touch-icon
- [x] `sitemap.xml` + `robots.txt`
- [ ] Confirm both forms are public ("Anyone can respond")
- [ ] Deploy + connect a domain (then replace `https://kupkop.ph` if it differs)
- [ ] Expand legal pages before the app launches
- [ ] (Later) App Store / Play Store links once the app ships
