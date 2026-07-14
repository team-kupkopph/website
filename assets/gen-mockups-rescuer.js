// Generates rescuer-side app mockup previews (design mockups; app not built yet).
// Run from website/assets:  node gen-mockups-rescuer.js
const sharp = require("sharp");
const path = require("path");

const DIR = __dirname;
const NAVY = "#1F3A5F", TEAL = "#1C6B6B", ACCENT = "#2E8B8B", MUTED = "#5f5e5a",
      SOFT = "#e7f0ef", BG = "#f6f5f1", LINE = "#e3e1d9", OK = "#27500A", OKBG = "#EAF3DE",
      WARN = "#633806", WARNBG = "#FAEEDA";
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
function back(title) {
  return t(40, 96, "‹", { size: 44, weight: "700", fill: TEAL }) + t(74, 92, title, { size: 28, weight: "700" });
}
function bottomnav(active) {
  const items = ["Home", "Adopt", "Volunteer", "You"];
  let s = `<rect x="0" y="${SH - 96}" width="${SW}" height="96" fill="#ffffff"/><line x1="0" y1="${SH - 96}" x2="${SW}" y2="${SH - 96}" stroke="${LINE}" stroke-width="1.5"/>`;
  items.forEach((lab, i) => {
    const cx = (i + 0.5) * (SW / items.length), on = i === active;
    s += `<circle cx="${cx}" cy="${SH - 58}" r="16" fill="${on ? TEAL : "#cfd6d2"}"/>`;
    s += t(cx, SH - 22, lab, { size: 17, anchor: "middle", fill: on ? TEAL : MUTED, weight: on ? "700" : "normal" });
  });
  return s;
}
function chip(x, y, label, bg, fg) {
  const w = 22 + label.length * 11;
  return rrect(x, y, w, 36, 18, bg) + t(x + w / 2, y + 24, label, { size: 17, anchor: "middle", fill: fg, weight: "700" });
}

// ---------- A. Rescue alert / claim ----------
function alert() {
  let s = `<rect width="${SW}" height="${SH}" fill="${BG}"/>` + statusbar() + back("Stray report");
  // map thumbnail
  s += rrect(34, 128, 472, 250, 20, "#e8efe9");
  s += `<g stroke="#fff" stroke-width="12" stroke-linecap="round"><path d="M40 220 L500 270"/><path d="M260 130 L300 380"/></g>`;
  const pinx = 270, piny = 260;
  s += `<path d="M${pinx} ${piny} c-22 -26 -22 -48 0 -48 c22 0 22 22 0 48 z" fill="${WARN}"/><circle cx="${pinx}" cy="${piny - 30}" r="9" fill="#fff"/>`;
  // info
  s += `<circle cx="86" cy="450" r="40" fill="${SOFT}"/>`;
  s += t(146, 438, "Aspin • Quezon City", { size: 26, weight: "700" });
  s += t(146, 470, "Reported 5 min ago by Maria", { size: 18, fill: MUTED });
  s += chip(34, 510, "Needs pickup", WARNBG, WARN) + chip(220, 510, "Possibly injured", "#FBE4E0", "#7a2418");
  // note
  s += rrect(34, 568, 472, 150, 20, "#ffffff", LINE);
  s += t(58, 606, "Reporter’s note", { size: 18, weight: "700", fill: MUTED });
  s += t(58, 644, "Found near Anonas LRT, limping a bit", { size: 20 });
  s += t(58, 676, "but friendly. Hiding under a parked car.", { size: 20 });
  // distance
  s += t(34, 770, "0.4 km away", { size: 22, weight: "700", fill: TEAL });
  // CTAs
  s += rrect(34, 812, 472, 64, 32, TEAL) + t(270, 853, "Claim this rescue", { size: 23, anchor: "middle", fill: "#fff", weight: "700" });
  s += rrect(34, 890, 472, 60, 30, "#ffffff", LINE) + t(270, 928, "Contact reporter", { size: 21, anchor: "middle", fill: TEAL, weight: "700" });
  s += bottomnav(0);
  return s;
}

// ---------- B. Status tracker ----------
function status() {
  let s = `<rect width="${SW}" height="${SH}" fill="${BG}"/>` + statusbar() + back("Rescue #142");
  s += t(74, 132, "Aspin • claimed by you", { size: 19, fill: MUTED });
  const steps = [
    ["Reported", "Today, 9:02 AM", "done"],
    ["Claimed by you", "Today, 9:07 AM", "done"],
    ["Picked up", "Today, 9:40 AM", "done"],
    ["At the vet", "In progress", "now"],
    ["Recovering", "", "next"],
    ["Ready for adoption", "", "next"],
  ];
  const x = 80; let y = 200;
  steps.forEach(([label, time, st], i) => {
    const cy = y + i * 130;
    if (i < steps.length - 1) s += `<line x1="${x}" y1="${cy}" x2="${x}" y2="${cy + 130}" stroke="${st === "done" ? TEAL : LINE}" stroke-width="5"/>`;
    const col = st === "done" ? TEAL : st === "now" ? ACCENT : "#cfd6d2";
    s += `<circle cx="${x}" cy="${cy}" r="24" fill="${st === "next" ? "#ffffff" : col}" stroke="${col}" stroke-width="4"/>`;
    if (st === "done") s += `<path d="M${x - 11} ${cy} l8 9 l15 -17" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`;
    if (st === "now") s += `<circle cx="${x}" cy="${cy}" r="8" fill="#fff"/>`;
    s += t(x + 50, cy - 4, label, { size: 24, weight: st === "next" ? "normal" : "700", fill: st === "next" ? MUTED : NAVY });
    if (time) s += t(x + 50, cy + 26, time, { size: 18, fill: MUTED });
  });
  s += rrect(34, SH - 188, 472, 64, 32, TEAL) + t(270, SH - 147, "Add an update", { size: 23, anchor: "middle", fill: "#fff", weight: "700" });
  s += bottomnav(0);
  return s;
}

// ---------- C. Your impact ----------
function impact() {
  let s = `<rect width="${SW}" height="${SH}" fill="${BG}"/>` + statusbar();
  s += t(34, 100, "Your impact", { size: 34, weight: "700" });
  s += t(34, 136, "Salamat for everything you do.", { size: 19, fill: MUTED });
  // stat cards
  const stats = [["12", "Rescues"], ["5", "Adoptions"], ["8", "Badges"]];
  stats.forEach(([n, l], i) => {
    const x = 34 + i * 158;
    s += rrect(x, 172, 142, 140, 20, "#ffffff", LINE);
    s += t(x + 71, 244, n, { size: 46, weight: "700", anchor: "middle", fill: TEAL });
    s += t(x + 71, 284, l, { size: 18, anchor: "middle", fill: MUTED });
  });
  // badges
  s += t(34, 372, "Badges earned", { size: 24, weight: "700" });
  ["★", "♥", "♦", "♣"].forEach((g, i) => {
    const cx = 70 + i * 116;
    s += `<circle cx="${cx}" cy="450" r="44" fill="${SOFT}"/>` + t(cx, 462, g, { size: 34, anchor: "middle", fill: TEAL });
  });
  // active rescues
  s += t(34, 560, "Active rescues", { size: 24, weight: "700" });
  const rows = [["Aspin • #142", "At the vet", OKBG, OK, 588], ["Kitten • #139", "Recovering", "#E6F1FB", "#0C447C", 700]];
  rows.forEach(([title, st, tb, tf, y]) => {
    s += rrect(34, y, 472, 96, 20, "#ffffff", LINE);
    s += `<circle cx="84" cy="${y + 48}" r="30" fill="${SOFT}"/>`;
    s += t(132, y + 44, title, { size: 22, weight: "700" });
    s += t(132, y + 74, "Tap to view timeline", { size: 17, fill: MUTED });
    const cw = 22 + st.length * 11;
    s += chip(490 - cw, y + 30, st, tb, tf);
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
  const out = [["mockup-alert.png", alert()], ["mockup-status.png", status()], ["mockup-impact.png", impact()]];
  for (const [name, inner] of out) {
    await sharp(Buffer.from(phone(inner)), { density: 144 }).png().toFile(path.join(DIR, name));
    console.log("wrote assets/" + name);
  }
})();
