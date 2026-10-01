// Stand-in for the design canvas runtime: enough of <x-dc> to render an artboard statically.
// ?props={...} overrides data-props defaults; ?state={...} seeds this.state; ?zoom=N scales.
class DCLogic {
  constructor(props) { this.props = props || {}; this.state = {}; }
  setState(s) { Object.assign(this.state, s); if (window.__dcRender) window.__dcRender(); }
}
window.DCLogic = DCLogic;

function lookup(expr, scope) {
  expr = expr.trim();
  if (expr === "true") return true;
  if (expr === "false") return false;
  if (/^-?\d+(\.\d+)?$/.test(expr)) return Number(expr);
  return expr.split(".").reduce((o, k) => (o == null ? undefined : o[k]), scope);
}
function interp(str, scope) {
  return str.replace(/\{\{([^}]*)\}\}/g, (_, e) => { const v = lookup(e, scope); return v == null ? "" : String(v); });
}
// renderVals strings are written pre-escaped for HTML ("&amp;", "&#39;"); a text node needs them decoded.
const _ta = document.createElement("textarea");
function decode(str) { _ta.innerHTML = str; return _ta.value; }
function processNode(node, scope) {
  for (const child of [...node.childNodes]) {
    if (child.nodeType === 3) { if (child.nodeValue.includes("{{")) child.nodeValue = decode(interp(child.nodeValue, scope)); continue; }
    if (child.nodeType !== 1) continue;
    const tag = child.localName;
    if (tag === "sc-for") {
      const m = /^\{\{(.*)\}\}$/.exec(child.getAttribute("list").trim());
      const list = (m ? lookup(m[1], scope) : []) || [];
      const as = child.getAttribute("as");
      const frag = document.createDocumentFragment();
      list.forEach((item, i) => {
        const holder = child.cloneNode(true);
        processNode(holder, Object.assign(Object.create(scope), { [as]: item, index: i }));
        while (holder.firstChild) frag.appendChild(holder.firstChild);
      });
      child.replaceWith(frag);
      continue;
    }
    if (tag === "sc-if") {
      const m = /^\{\{(.*)\}\}$/.exec(child.getAttribute("value").trim());
      if (m && lookup(m[1], scope)) {
        processNode(child, scope);
        const frag = document.createDocumentFragment();
        while (child.firstChild) frag.appendChild(child.firstChild);
        child.replaceWith(frag);
      } else child.remove();
      continue;
    }
    for (const a of [...child.attributes]) {
      if (!a.value.includes("{{")) continue;
      const whole = /^\{\{([^}]*)\}\}$/.exec(a.value.trim());
      if (whole && typeof lookup(whole[1], scope) === "function") { child.removeAttribute(a.name); continue; }
      child.setAttribute(a.name, interp(a.value, scope));
    }
    processNode(child, scope);
  }
}
document.addEventListener("DOMContentLoaded", () => {
  const scriptEl = document.querySelector("script[data-dc-script]");
  const meta = JSON.parse(scriptEl.dataset.props || "{}");
  const props = {};
  for (const k in meta) if (k[0] !== "$") props[k] = meta[k].default;
  const q = new URLSearchParams(location.search);
  if (q.get("props")) Object.assign(props, JSON.parse(q.get("props")));
  const Cls = new Function("DCLogic", scriptEl.textContent + "\n;return Component;")(DCLogic);
  const inst = new Cls(props);
  if (q.get("state")) Object.assign(inst.state, JSON.parse(q.get("state")));
  const dc = document.querySelector("x-dc");
  const helmet = dc.querySelector("helmet");
  if (helmet) { document.head.append(...helmet.children); helmet.remove(); }
  const tpl = dc.innerHTML;
  const zoom = q.get("zoom");
  window.__dcRender = () => {
    dc.innerHTML = tpl;
    processNode(dc, Object.assign(Object.create(null), inst.renderVals()));
    const root = dc.firstElementChild;
    if (zoom && root) root.style.zoom = zoom;
  };
  window.__dcRender();
  document.body.style.margin = "0";
  window.__dcReady = true;
});

// ?capture=<name>: rasterize the artboard at 2x with html-to-image and POST it to /save/<name>.png.
document.addEventListener("DOMContentLoaded", async () => {
  const name = new URLSearchParams(location.search).get("capture");
  if (!name) return;
  const style = document.createElement("style");
  style.textContent = ".scroll{scrollbar-width:none}.scroll::-webkit-scrollbar{display:none}*,*::before,*::after{animation:none!important;transition:none!important}";
  document.head.appendChild(style);
  await new Promise((res, rej) => { const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/html-to-image@1.11.11/dist/html-to-image.js"; s.onload = res; s.onerror = rej; document.head.appendChild(s); });
  await document.fonts.ready;
  await new Promise(r => setTimeout(r, 900));  // let the .rise entrance animations finish
  const root = document.querySelector("x-dc").firstElementChild;
  // Public-site hygiene: fictional orgs instead of real shelters / test fixtures, no placeholder tags.
  const NAMES = [["KG Test Shelter", "Silungan Shelter"], ["PAWS Manila", "Silungan Shelter"], ["Marikina AWG", "Lingap Rescue"]];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const texts = []; while (walker.nextNode()) texts.push(walker.currentNode);
  for (const t of texts) {
    let v = t.nodeValue;
    for (const [a, b] of NAMES) v = v.split(a).join(b);
    if (v.trim() === "PM") v = v.replace("PM", "SS");
    if (v.trim().toUpperCase() === "PHOTO PLACEHOLDER") { t.parentElement.parentElement.remove(); continue; }
    t.nodeValue = v;
  }
  const blob = await htmlToImage.toBlob(root, { pixelRatio: 2, width: 390, height: 844 });
  const r = await fetch("/save/" + name + ".png", { method: "POST", body: blob });
  window.__captured = r.status;
});
