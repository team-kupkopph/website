// Generates shelter/org-side app mockup previews (design mockups; app not built yet).
// Run from website/assets:  node gen-mockups-shelter.js
const sharp = require("sharp");
const path = require("path");

const DIR = __dirname;
const NAVY = "#1F3A5F", TEAL = "#1C6B6B", ACCENT = "#2E8B8B", MUTED = "#5f5e5a",
      SOFT = "#e7f0ef", BG = "#f6f5f1", LINE = "#e3e1d9", OK = "#27500A", OKBG = "#EAF3DE",
      WARN = "#633806", WARNBG = "#FAEEDA", INFO = "#0C447C", INFOBG = "#E6F1FB";
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
function orgnav(active) {
  const items = ["Dashboard", "Listings", "Volunteer", "Requests", "Org"];
  let s = `<rect x="0" y="${SH - 96}" width="${SW}" height="96" fill="#ffffff"/><line x1="0" y1="${SH - 96}" x2="${SW}" y2="${SH - 96}" stroke="${LINE}" stroke-width="1.5"/>`;
  items.forEach((lab, i) => {
    const cx = 54 + i * 108, on = i === active;
    s += `<circle cx="${cx}" cy="${SH - 60}" r="15" fill="${on ? TEAL : "#cfd6d2"}"/>`;
    s += t(cx, SH - 24, lab, { size: 15, anchor: "middle", fill: on ? TEAL : MUTED, weight: on ? "700" : "normal" });
  });
  return s;
}
function chip(x, y, label, bg, fg) {
  const w = 22 + label.length * 11;
  return rrect(x, y, w, 36, 18, bg) + t(x + w / 2, y + 24, label, { size: 17, anchor: "middle", fill: fg, weight: "700" });
}

// ---------- A. Shelter dashboard ----------
function dashboard() {
  let s = `<rect width="${SW}" height="${SH}" fill="${BG}"/>` + statusbar();
  s += `<circle cx="68" cy="96" r="30" fill="${SOFT}"/>`;
  s += t(114, 90, "Pawssion Home QC", { size: 27, weight: "700" });
  s += t(114, 120, "Verified shelter", { size: 17, fill: TEAL, weight: "700" });
  // stats
  const stats = [["6", "In care"], ["4", "Inquiries"], ["2", "Shifts today"]];
  stats.forEach(([n, l], i) => {
    const x = 34 + i * 158;
    s += rrect(x, 164, 142, 132, 20, "#ffffff", LINE);
    s += t(x + 71, 230, n, { size: 44, weight: "700", anchor: "middle", fill: TEAL });
    s += t(x + 71, 268, l, { size: 17, anchor: "middle", fill: MUTED });
  });
  // quick actions
  s += rrect(34, 322, 230, 64, 32, TEAL) + t(149, 363, "+ Add listing", { size: 20, anchor: "middle", fill: "#fff", weight: "700" });
  s += rrect(276, 322, 230, 64, 32, "#ffffff", LINE) + t(391, 363, "Open a slot", { size: 20, anchor: "middle", fill: TEAL, weight: "700" });
  // activity
  s += t(34, 446, "Recent activity", { size: 24, weight: "700" });
  const acts = [["New inquiry — Brownie", "Maria wants to adopt", INFOBG, INFO, "New", 472],
                ["Walk booked — Sat 9 AM", "by volunteer Jana", OKBG, OK, "Booked", 588],
                ["Donation received", "₱500 via GCash", OKBG, OK, "₱500", 704]];
  acts.forEach(([title, sub, tb, tf, tag, y]) => {
    s += rrect(34, y, 472, 100, 20, "#ffffff", LINE);
    s += `<circle cx="82" cy="${y + 50}" r="28" fill="${SOFT}"/>`;
    s += t(128, y + 44, title, { size: 21, weight: "700" });
    s += t(128, y + 74, sub, { size: 17, fill: MUTED });
    const cw = 22 + tag.length * 11;
    s += chip(490 - cw, y + 32, tag, tb, tf);
  });
  s += orgnav(0);
  return s;
}

// ---------- B. Listings ----------
function listings() {
  let s = `<rect width="${SW}" height="${SH}" fill="${BG}"/>` + statusbar();
  s += t(34, 100, "Listings", { size: 32, weight: "700" });
  s += rrect(366, 66, 140, 52, 26, TEAL) + t(436, 100, "+ Add", { size: 20, anchor: "middle", fill: "#fff", weight: "700" });
  // filter chips
  s += chip(34, 140, "All", TEAL, "#fff") + chip(110, 140, "Available", "#ffffff", MUTED) + chip(290, 140, "Pending", "#ffffff", MUTED);
  const pets = [["Brownie", "Aspin • 1 yr • male", "Available", OKBG, OK, 210],
                ["Mingming", "Puspin • 6 mo • female", "Pending", WARNBG, WARN, 334],
                ["Bantay", "Aspin • 2 yr • male", "Available", OKBG, OK, 458],
                ["Tabby", "Puspin • 3 yr • female", "Available", OKBG, OK, 582]];
  pets.forEach(([name, meta, tag, tb, tf, y]) => {
    s += rrect(34, y, 472, 108, 20, "#ffffff", LINE);
    s += rrect(54, y + 18, 72, 72, 16, SOFT);
    s += t(146, y + 52, name, { size: 24, weight: "700" });
    s += t(146, y + 82, meta, { size: 18, fill: MUTED });
    const cw = 22 + tag.length * 11;
    s += chip(490 - cw, y + 36, tag, tb, tf);
  });
  s += orgnav(1);
  return s;
}

// ---------- C. Walks ----------
function walks() {
  let s = `<rect width="${SW}" height="${SH}" fill="${BG}"/>` + statusbar();
  s += t(34, 100, "Kawang-Gawa shifts", { size: 30, weight: "700" });
  s += t(34, 136, "This Saturday, Aug 9", { size: 19, fill: MUTED });
  const slots = [["9:00 AM", "3 / 4 booked", "Open", OKBG, OK, 184],
                 ["10:30 AM", "1 / 4 booked", "Open", OKBG, OK, 360],
                 ["2:00 PM", "4 / 4 booked", "Full", INFOBG, INFO, 536]];
  slots.forEach(([time, count, tag, tb, tf, y]) => {
    s += rrect(34, y, 472, 150, 20, "#ffffff", LINE);
    s += t(58, y + 52, time, { size: 28, weight: "700" });
    s += t(58, y + 90, count, { size: 19, fill: MUTED });
    const cw = 22 + tag.length * 11;
    s += chip(490 - cw, y + 30, tag, tb, tf);
    // volunteer avatars
    const booked = parseInt(count);
    for (let i = 0; i < 4; i++) {
      s += `<circle cx="${72 + i * 46}" cy="${y + 122}" r="20" fill="${i < booked ? SOFT : "#f0efe9"}" stroke="${LINE}" stroke-width="1.5"/>`;
      if (i >= booked) s += t(72 + i * 46, y + 130, "+", { size: 24, anchor: "middle", fill: MUTED });
    }
  });
  s += rrect(34, 720, 472, 64, 32, TEAL) + t(270, 761, "Open a new slot", { size: 22, anchor: "middle", fill: "#fff", weight: "700" });
  s += orgnav(2);
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
  const out = [["mockup-dashboard.png", dashboard()], ["mockup-listings.png", listings()], ["mockup-walks.png", walks()]];
  for (const [name, inner] of out) {
    await sharp(Buffer.from(phone(inner)), { density: 144 }).png().toFile(path.join(DIR, name));
    console.log("wrote assets/" + name);
  }
})();
