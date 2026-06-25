// Generates social-share image + favicons for the Kupkop PH site.
// Run from the website/ folder:  node gen-assets.js
const sharp = require("sharp");
const path = require("path");

const DIR = __dirname;
const A = (f) => path.join(DIR, "assets", f);

const NAVY = "#1F3A5F", TEAL = "#1C6B6B", MUTED = "#5f5e5a", SOFT = "#e7f0ef", CREAM = "#f5f6f3";

(async () => {
  // ---- 1. Social-share image (Open Graph, 1200x630) ----
  const W = 1200, H = 630;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="${CREAM}"/>
      </linearGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#bg)"/>
    <circle cx="945" cy="300" r="235" fill="${SOFT}"/>
    <text x="80" y="170" font-family="Arial, sans-serif" font-size="26" font-weight="700"
      letter-spacing="3" fill="${TEAL}">KUPKOP PH</text>
    <text x="76" y="290" font-family="Arial, sans-serif" font-size="78" font-weight="700"
      fill="${NAVY}">Saving animals,</text>
    <text x="76" y="375" font-family="Arial, sans-serif" font-size="78" font-weight="700"
      fill="${NAVY}">together.</text>
    <text x="80" y="450" font-family="Arial, sans-serif" font-size="30" fill="${MUTED}">An animal-welfare community</text>
    <text x="80" y="492" font-family="Arial, sans-serif" font-size="30" fill="${MUTED}">for Filipino fur parents.</text>
    <rect x="0" y="${H - 16}" width="${W}" height="16" fill="${TEAL}"/>
  </svg>`;

  const logo = await sharp(A("kupkop-logo-only.png")).resize(330, 330, { fit: "contain" }).png().toBuffer();
  await sharp(Buffer.from(svg))
    .composite([{ input: logo, left: 945 - 165, top: 300 - 165 }])
    .png()
    .toFile(A("og-cover.png"));
  console.log("wrote assets/og-cover.png (1200x630)");

  // ---- 2. Favicons (from the logo-only mark, padded onto white) ----
  async function favicon(size, file) {
    const inner = Math.round(size * 0.86);
    const mark = await sharp(A("kupkop-logo-only.png")).resize(inner, inner, { fit: "contain" }).png().toBuffer();
    await sharp({ create: { width: size, height: size, channels: 4, background: "#ffffff" } })
      .composite([{ input: mark, gravity: "center" }])
      .png()
      .toFile(A(file));
    console.log("wrote assets/" + file + " (" + size + "x" + size + ")");
  }
  await favicon(32, "favicon-32.png");
  await favicon(180, "apple-touch-icon.png");
})();
