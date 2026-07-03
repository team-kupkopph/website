// More app mockup previews (design mockups; app not built yet): adopt browse, pet detail, community.
// Run from website/assets:  node gen-mockups-more.js
const sharp = require("sharp");
const path = require("path");

const DIR = __dirname;
const NAVY = "#1F3A5F", TEAL = "#1C6B6B", ACCENT = "#2E8B8B", MUTED = "#5f5e5a",
      SOFT = "#e7f0ef", BG = "#f6f5f1", LINE = "#e3e1d9", OK = "#27500A", OKBG = "#EAF3DE",
      PINK = "#993556", PINKBG = "#FBEAF0", INFO = "#0C447C", INFOBG = "#E6F1FB";
const SW = 540, SH = 1170, PAD = 30;

function t(x, y, s, o = {}) {
  return `<text x="${x}" y="${y}" font-family="Arial, sans-serif" font-size="${o.size || 24}" font-weight="${o.weight || "normal"}" fill="${o.fill || NAVY}" text-anchor="${o.anchor || "start"}">${s}</text>`;
}
function rrect(x, y, w, h, r, fill, stroke) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="1.5"` : ""}/>`;
}
function statusbar() {
  return t(34, 38, "9:41", { size: 22, weight: "700" }) +
    `<circle cx="486" cy="32" r="5" fill="${NAVY}"/><circle cx="502" cy="32" r="5" fill="${NAVY}"/><rect x="470" y="22" width="40" height="18" rx="4" fill="none" stroke="${NAVY}" stroke-width="2"/>`;
}
function bottomnav(active) {
  const items = ["Home", "Adopt", "Sagip", "Inbox", "You"];
  let s = `<rect x="0" y="${SH - 96}" width="${SW}" height="96" fill="#ffffff"/><line x1="0" y1="${SH - 96}" x2="${SW}" y2="${SH - 96}" stroke="${LINE}" stroke-width="1.5"/>`;
  items.forEach((lab, i) => {
    const cx = 54 + i * 108, on = i === active;
    s += `<circle cx="${cx}" cy="${SH - 58}" r="16" fill="${on ? TEAL : "#cfd6d2"}"/>`;
    s += t(cx, SH - 22, lab, { size: 17, anchor: "middle", fill: on ? TEAL : MUTED, weight: on ? "700" : "normal" });
  });
  return s;
}
function chip(x, y, label, bg, fg) {
  const w = 22 + label.length * 11;
  return rrect(x, y, w, 36, 18, bg) + t(x + w / 2, y + 24, label, { size: 17, anchor: "middle", fill: fg, weight: "700" });
}

// ---------- A. Adoption browse ----------
function adopt() {
  let s = `<rect width="${SW}" height="${SH}" fill="${BG}"/>` + statusbar();
  s += t(34, 96, "Adopt a friend", { size: 30, weight: "700" });
  s += rrect(34, 120, 472, 52, 26, "#ffffff", LINE) + t(64, 153, "Search dogs, cats, breeds…", { size: 19, fill: MUTED });
  s += chip(34, 190, "Dogs", TEAL, "#fff") + chip(120, 190, "Cats", "#fff", MUTED) + chip(206, 190, "Near me", "#fff", MUTED) + chip(360, 190, "Puppies", "#fff", MUTED);
  const pets = [["Brownie", "Aspin · 1 yr", 34, 252], ["Mingming", "Puspin · 6 mo", 286, 252],
                ["Bantay", "Aspin · 2 yr", 34, 560], ["Tabby", "Puspin · 3 yr", 286, 560]];
  pets.forEach(([name, meta, x, y]) => {
    s += rrect(x, y, 220, 288, 18, "#ffffff", LINE);
    s += rrect(x + 16, y + 16, 188, 168, 12, SOFT);
    s += `<path d="M${x + 110} ${y + 118} c-30 -34 -30 -62 0 -62 c30 0 30 28 0 62 z" fill="#cfdedb"/>`;
    s += chip(x + 24, y + 26, "Adoptable", OKBG, OK);
    s += t(x + 20, y + 232, name, { size: 23, weight: "700" });
    s += t(x + 20, y + 262, meta, { size: 17, fill: MUTED });
  });
  s += bottomnav(1);
  return s;
}

// ---------- B. Pet detail ----------
function petdetail() {
  let s = `<rect width="${SW}" height="${SH}" fill="${BG}"/>` + statusbar();
  s += rrect(34, 70, 472, 300, 20, SOFT);
  s += `<path d="M270 240 c-46 -52 -46 -96 0 -96 c46 0 46 44 0 96 z" transform="translate(0,-20)" fill="#cfdedb"/>`;
  s += `<circle cx="474" cy="96" r="24" fill="#ffffff"/>` + t(474, 104, "♥", { size: 24, anchor: "middle", fill: PINK });
  s += t(34, 418, "Brownie", { size: 32, weight: "700" });
  s += t(34, 450, "Aspin · 1 yr · male", { size: 20, fill: MUTED });
  s += chip(34, 474, "Vaccinated", OKBG, OK) + chip(210, 474, "Neutered", OKBG, OK) + chip(360, 474, "Friendly", INFOBG, INFO);
  s += rrect(34, 532, 472, 70, 16, "#ffffff", LINE);
  s += `<circle cx="76" cy="567" r="24" fill="${SOFT}"/>` + t(116, 560, "PAWS Manila", { size: 20, weight: "700" }) + t(116, 585, "Verified shelter", { size: 16, fill: TEAL, weight: "700" });
  s += t(34, 648, "About", { size: 20, weight: "700" });
  s += t(34, 682, "Gentle, house-trained, and great with kids.", { size: 18, fill: MUTED });
  s += t(34, 710, "Looking for a loving forever home.", { size: 18, fill: MUTED });
  s += rrect(34, 760, 372, 64, 32, TEAL) + t(220, 801, "Ask about Brownie", { size: 22, anchor: "middle", fill: "#fff", weight: "700" });
  s += rrect(418, 760, 88, 64, 32, "#ffffff", LINE) + t(462, 802, "♥", { size: 30, anchor: "middle", fill: PINK });
  s += bottomnav(1);
  return s;
}

// ---------- C. Community — stories + badges ----------
function community() {
  let s = `<rect width="${SW}" height="${SH}" fill="${BG}"/>` + statusbar();
  s += t(34, 96, "Community", { size: 30, weight: "700" });
  // impact strip
  s += rrect(34, 120, 472, 96, 18, TEAL);
  s += t(58, 160, "Your impact", { size: 18, fill: "#cfe6e3", weight: "700" });
  s += t(58, 192, "3 rescues · 8 badges · 12 walks", { size: 20, fill: "#fff", weight: "700" });
  s += t(34, 268, "Kupkop stories", { size: 22, weight: "700" });
  const stories = [["Brownie found a home!", "Adopted by the Cruz family", "142", 292],
                   ["Mingming's recovery", "From street to safe in 2 weeks", "98", 470],
                   ["Bantay's first walk", "Volunteer day at PAWS Manila", "76", 648]];
  stories.forEach(([title, sub, likes, y]) => {
    s += rrect(34, y, 472, 158, 18, "#ffffff", LINE);
    s += rrect(50, y + 16, 126, 126, 12, SOFT);
    s += `<path d="M113 ${y+96} c-26 -30 -26 -54 0 -54 c26 0 26 24 0 54 z" transform="translate(0,-8)" fill="#cfdedb"/>`;
    s += t(196, y + 52, title, { size: 21, weight: "700" });
    s += t(196, y + 82, sub, { size: 17, fill: MUTED });
    s += t(196, y + 128, "♥ " + likes, { size: 18, fill: PINK, weight: "700" });
    s += chip(400, y + 112, "Kupkop", PINKBG, PINK);
  });
  s += bottomnav(3);
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
  const out = [["mockup-adopt.png", adopt()], ["mockup-petdetail.png", petdetail()], ["mockup-community.png", community()]];
  for (const [name, inner] of out) {
    await sharp(Buffer.from(phone(inner)), { density: 144 }).png().toFile(path.join(DIR, name));
    console.log("wrote assets/" + name);
  }
})();
