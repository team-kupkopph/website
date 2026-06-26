// Generates phone-framed app mockup previews for the Kupkop PH site.
// These are DESIGN MOCKUPS (the app isn't built yet) — used as a "sneak peek".
// Run from website/assets:  node gen-mockups.js
const sharp = require("sharp");
const path = require("path");

const DIR = __dirname;
const NAVY = "#1F3A5F", TEAL = "#1C6B6B", ACCENT = "#2E8B8B", MUTED = "#5f5e5a",
      SOFT = "#e7f0ef", BG = "#f6f5f1", LINE = "#e3e1d9", OK = "#27500A", OKBG = "#EAF3DE",
      WARN = "#633806", WARNBG = "#FAEEDA";

const SW = 540, SH = 1170;            // screen size
const PAD = 30;                       // bezel

function t(x, y, s, o = {}) {
  const anchor = o.anchor || "start";
  return `<text x="${x}" y="${y}" font-family="Arial, sans-serif" font-size="${o.size || 24}" font-weight="${o.weight || "normal"}" fill="${o.fill || NAVY}" text-anchor="${anchor}" letter-spacing="${o.ls || 0}">${s}</text>`;
}
function rrect(x, y, w, h, r, fill, stroke) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="1.5"` : ""}/>`;
}
function statusbar() {
  return t(34, 38, "9:41", { size: 22, weight: "700" }) +
    `<circle cx="486" cy="32" r="5" fill="${NAVY}"/><circle cx="502" cy="32" r="5" fill="${NAVY}"/><rect x="476" y="24" width="34" height="0" /><rect x="470" y="22" width="40" height="18" rx="4" fill="none" stroke="${NAVY}" stroke-width="2"/>`;
}
function bottomnav(active) {
  const items = ["Home", "Adopt", "Sagip", "Inbox", "You"];
  let s = `<rect x="0" y="${SH - 96}" width="${SW}" height="96" fill="#ffffff"/><line x1="0" y1="${SH - 96}" x2="${SW}" y2="${SH - 96}" stroke="${LINE}" stroke-width="1.5"/>`;
  items.forEach((lab, i) => {
    const cx = 54 + i * 108;
    const on = i === active;
    s += `<circle cx="${cx}" cy="${SH - 58}" r="16" fill="${on ? TEAL : "#cfd6d2"}"/>`;
    s += t(cx, SH - 22, lab, { size: 17, anchor: "middle", fill: on ? TEAL : MUTED, weight: on ? "700" : "normal" });
  });
  return s;
}
function chip(x, y, label, bg, fg) {
  const w = 22 + label.length * 11;
  return rrect(x, y, w, 36, 18, bg) + t(x + w / 2, y + 24, label, { size: 17, anchor: "middle", fill: fg, weight: "700" });
}

// ---------- Screen 1: Home ----------
function home() {
  let s = `<rect width="${SW}" height="${SH}" fill="${BG}"/>` + statusbar();
  s += t(34, 96, "Kumusta, Ana!", { size: 34, weight: "700" });
  s += t(34, 132, "Let’s help a furry friend today.", { size: 20, fill: MUTED });
  s += `<circle cx="496" cy="88" r="26" fill="#ffffff" stroke="${LINE}"/>` + t(496, 96, "🔔", { size: 22, anchor: "middle" });
  // hero
  s += rrect(34, 168, 472, 150, 24, TEAL);
  s += t(60, 222, "Saw a stray?", { size: 30, weight: "700", fill: "#fff" });
  s += t(60, 256, "Report it in seconds — help is near.", { size: 18, fill: "#d8ece9" });
  s += rrect(60, 268, 168, 44, 22, "#ffffff") + t(144, 297, "Report now", { size: 18, anchor: "middle", fill: TEAL, weight: "700" });
  // quick actions
  const qa = [["Rescue", 34, 350], ["Adopt", 290, 350], ["Donate", 34, 486], ["Walks", 290, 486]];
  qa.forEach(([lab, x, y]) => {
    s += rrect(x, y, 216, 116, 20, "#ffffff", LINE);
    s += `<circle cx="${x + 40}" cy="${y + 42}" r="26" fill="${SOFT}"/>`;
    s += t(x + 24, y + 92, lab, { size: 22, weight: "700" });
  });
  // nearby
  s += t(34, 660, "Nearby rescues", { size: 24, weight: "700" });
  const rows = [["Aspin • Quezon City", "0.4 km • needs pickup", "Urgent", WARNBG, WARN, 684],
               ["Puspin • Marikina", "1.2 km • for adoption", "New", OKBG, OK, 800]];
  rows.forEach(([title, sub, tag, tb, tf, y]) => {
    s += rrect(34, y, 472, 104, 20, "#ffffff", LINE);
    s += `<circle cx="86" cy="${y + 52}" r="34" fill="${SOFT}"/>`;
    s += t(140, y + 44, title, { size: 22, weight: "700" });
    s += t(140, y + 76, sub, { size: 18, fill: MUTED });
    const cw = 22 + tag.length * 11;
    s += chip(490 - cw, y + 34, tag, tb, tf);  // right-aligned
  });
  s += bottomnav(0);
  return s;
}

// ---------- Screen 2: Sagip map ----------
function map() {
  let s = `<rect width="${SW}" height="${SH}" fill="#e8efe9"/>` + statusbar();
  // faux roads
  s += `<g stroke="#ffffff" stroke-width="16" stroke-linecap="round" opacity="0.9">
    <path d="M-20 240 L560 320" /><path d="M120 -20 L220 600" /><path d="M-20 520 L560 470" />
    <path d="M380 60 L460 600" /></g>`;
  s += `<g stroke="#d7e0d8" stroke-width="3"><path d="M-20 240 L560 320"/><path d="M120 -20 L220 600"/></g>`;
  // header pill
  s += rrect(34, 64, 472, 64, 32, "#ffffff");
  s += t(60, 104, "Sagip — Nearby strays", { size: 24, weight: "700" });
  // pins
  const pin = (x, y, c) => `<g><path d="M${x} ${y} c-26 -30 -26 -56 0 -56 c26 0 26 26 0 56 z" transform="translate(0,-30)" fill="${c}"/><circle cx="${x}" cy="${y - 64}" r="11" fill="#fff"/></g>`;
  s += pin(180, 300, WARN) + pin(330, 240, TEAL) + pin(260, 430, TEAL) + pin(410, 360, ACCENT);
  // bottom sheet
  const y = 720;
  s += rrect(0, y, SW, SH - y, 28, "#ffffff");
  s += `<rect x="246" y="${y + 16}" width="48" height="6" rx="3" fill="${LINE}"/>`;
  s += `<circle cx="92" cy="${y + 96}" r="40" fill="${SOFT}"/>`;
  s += t(154, y + 84, "Aspin spotted", { size: 26, weight: "700" });
  s += t(154, y + 118, "0.4 km away • reported 5 min ago", { size: 18, fill: MUTED });
  s += chip(154, y + 134, "Needs pickup", WARNBG, WARN);
  s += rrect(34, y + 196, 472, 56, 28, TEAL) + t(270, y + 232, "I can help", { size: 22, anchor: "middle", fill: "#fff", weight: "700" });
  s += rrect(34, y + 264, 472, 56, 28, "#ffffff", LINE) + t(270, y + 300, "Share", { size: 22, anchor: "middle", fill: TEAL, weight: "700" });
  return s;
}

// ---------- Screen 3: Abot-tulong donate ----------
function donate() {
  let s = `<rect width="${SW}" height="${SH}" fill="${BG}"/>` + statusbar();
  s += t(270, 96, "Abot-tulong", { size: 30, weight: "700", anchor: "middle" });
  s += t(270, 130, "Give directly — we hold no funds.", { size: 18, fill: MUTED, anchor: "middle" });
  // shelter card
  s += rrect(34, 168, 472, 120, 20, "#ffffff", LINE);
  s += `<circle cx="92" cy="228" r="36" fill="${SOFT}"/>`;
  s += t(146, 216, "Pawssion Home QC", { size: 23, weight: "700" });
  s += t(146, 248, "Verified shelter • 38 rescues", { size: 17, fill: MUTED });
  // QR
  s += rrect(120, 320, 300, 300, 24, "#ffffff", LINE);
  // deterministic QR-ish grid
  const gx = 150, gy = 350, n = 12, cell = 20;
  let rng = 7;
  const rand = () => (rng = (rng * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
  let q = "";
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (rand() > 0.5) q += `<rect x="${gx + j * cell}" y="${gy + i * cell}" width="${cell}" height="${cell}" fill="${NAVY}"/>`;
  // finder squares
  const finder = (x, y) => `<rect x="${x}" y="${y}" width="${cell * 3}" height="${cell * 3}" fill="none" stroke="${NAVY}" stroke-width="8"/><rect x="${x + cell}" y="${y + cell}" width="${cell}" height="${cell}" fill="${NAVY}"/>`;
  s += q + finder(gx, gy) + finder(gx + cell * 9, gy) + finder(gx, gy + cell * 9);
  s += t(270, 648, "Scan with GCash or Maya", { size: 20, anchor: "middle", fill: MUTED });
  // amount chips
  ["₱50", "₱100", "₱250", "₱500"].forEach((a, i) => {
    const x = 34 + i * 120;
    s += rrect(x, 690, 104, 56, 28, i === 1 ? TEAL : "#ffffff", LINE);
    s += t(x + 52, 726, a, { size: 22, anchor: "middle", fill: i === 1 ? "#fff" : NAVY, weight: "700" });
  });
  s += rrect(34, 786, 472, 60, 30, TEAL) + t(270, 825, "Open GCash", { size: 23, anchor: "middle", fill: "#fff", weight: "700" });
  s += t(270, 900, "100% goes to the shelter.", { size: 18, anchor: "middle", fill: MUTED });
  s += bottomnav(2);
  return s;
}

function phone(inner) {
  const W = SW + PAD * 2, H = SH + PAD * 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <rect x="4" y="4" width="${W - 8}" height="${H - 8}" rx="76" fill="#11241f"/>
    <rect x="${PAD}" y="${PAD}" width="${SW}" height="${SH}" rx="48" fill="#ffffff"/>
    <clipPath id="sc"><rect x="${PAD}" y="${PAD}" width="${SW}" height="${SH}" rx="48"/></clipPath>
    <g clip-path="url(#sc)"><g transform="translate(${PAD},${PAD})">${inner}</g></g>
    <rect x="${W / 2 - 60}" y="${PAD + 14}" width="120" height="30" rx="15" fill="#11241f"/>
  </svg>`;
}

(async () => {
  const out = [["mockup-home.png", home()], ["mockup-map.png", map()], ["mockup-donate.png", donate()]];
  for (const [name, inner] of out) {
    await sharp(Buffer.from(phone(inner)), { density: 144 }).png().toFile(path.join(DIR, name));
    console.log("wrote assets/" + name);
  }
})();
