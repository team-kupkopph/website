// Puts each raw V3 capture (780x1688, 2x of the 390x844 artboard) into a phone frame with a
// status bar and writes it to assets/mockup-<name>.png. Run after capture.html:  node frame.js
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const RAW = path.join(__dirname, "raw");
const ASSETS = path.join(__dirname, "..", "..", "assets");
const INK = "#12213A", BEZEL = "#11241F";

const SW = 780, SH = 1688;     // screen, px
const PAD = 34;                // bezel
const W = SW + PAD * 2, H = SH + PAD * 2;
const OUT_W = 600;             // shown at 240 CSS px on the site -> 2.5x

function overlay() {
  const y = PAD + 62;          // status-bar baseline, inside the artboard's 60 pt top inset
  const rx = PAD + SW - 64;    // right edge of the status icons
  const bars = [0, 1, 2, 3].map(i =>
    `<rect x="${rx - 150 + i * 13}" y="${y - 10 - i * 6}" width="9" height="${12 + i * 6}" rx="2" fill="${INK}"/>`).join("");
  const wifi = `<g transform="translate(${rx - 82},${y - 26})" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round">
      <path d="M2 12a26 26 0 0 1 36 0"/><path d="M9 19a16 16 0 0 1 22 0"/></g>
      <circle cx="${rx - 62}" cy="${y - 2}" r="4.5" fill="${INK}"/>`;
  const battery = `<rect x="${rx - 34}" y="${y - 24}" width="50" height="25" rx="7" fill="none" stroke="${INK}" stroke-opacity=".45" stroke-width="2.5"/>
      <rect x="${rx - 30}" y="${y - 20}" width="38" height="17" rx="4" fill="${INK}"/>
      <rect x="${rx + 18}" y="${y - 16}" width="4" height="9" rx="2" fill="${INK}" fill-opacity=".45"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs><mask id="hole"><rect width="${W}" height="${H}" fill="#fff"/>
      <rect x="${PAD}" y="${PAD}" width="${SW}" height="${SH}" rx="104" fill="#000"/></mask></defs>
    <rect x="0" y="0" width="${W}" height="${H}" rx="136" fill="${BEZEL}" mask="url(#hole)"/>
    <rect x="${W / 2 - 124}" y="${PAD + 22}" width="248" height="72" rx="36" fill="${BEZEL}"/>
    <text x="${PAD + 92}" y="${y}" font-family="-apple-system, 'SF Pro Text', Helvetica, Arial, sans-serif"
      font-size="34" font-weight="700" fill="${INK}" text-anchor="middle">9:41</text>
    ${bars}${wifi}${battery}
  </svg>`;
}

const screenMask = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${SW}" height="${SH}">
  <rect width="${SW}" height="${SH}" rx="104" fill="#fff"/></svg>`);

(async () => {
  const raws = fs.readdirSync(RAW).filter(f => f.endsWith(".png")).sort();
  if (!raws.length) throw new Error(`no captures in ${RAW} — run capture.html first`);
  for (const file of raws) {
    const screen = await sharp(path.join(RAW, file)).resize(SW, SH)
      .composite([{ input: screenMask, blend: "dest-in" }]).png().toBuffer();
    const framed = await sharp({ create: { width: W, height: H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
      .composite([{ input: screen, left: PAD, top: PAD }, { input: Buffer.from(overlay()), left: 0, top: 0 }])
      .png().toBuffer();
    const out = path.join(ASSETS, "mockup-" + file);
    await sharp(framed).resize(OUT_W).png({ compressionLevel: 9 }).toFile(out);
    console.log("wrote assets/" + path.basename(out));
  }
})();
