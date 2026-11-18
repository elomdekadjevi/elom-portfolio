import { useEffect } from "react";

// Carte de déplacement pour simuler la réfraction d'une lentille de verre.
// Pour chaque pixel : distance au bord du rectangle arrondi, normale, puis amplitude
// (0 au centre → 1 sur le bord, profil convexe). R/G encodent le vecteur dirigé vers
// l'intérieur : sur le bord, le verre « voit » le contenu situé juste à côté, courbé.
function computeRefractionMap(w, h, radius, bezel) {
  const k = Math.min(1, 360 / Math.max(w, h));
  const cw = Math.max(2, Math.round(w * k));
  const ch = Math.max(2, Math.round(h * k));
  const r = Math.min(radius * k, cw / 2, ch / 2);
  const b = Math.max(1, Math.min(bezel * k, Math.min(cw, ch) / 2));
  const data = new Uint8ClampedArray(cw * ch * 4);
  const hx = cw / 2;
  const hy = ch / 2;

  for (let y = 0; y < ch; y++) {
    for (let x = 0; x < cw; x++) {
      const px = x + 0.5 - hx;
      const py = y + 0.5 - hy;
      const qx = Math.abs(px) - (hx - r);
      const qy = Math.abs(py) - (hy - r);
      const ox = Math.max(qx, 0);
      const oy = Math.max(qy, 0);
      const depth = -(Math.hypot(ox, oy) + Math.min(Math.max(qx, qy), 0) - r);

      let nx = 0;
      let ny = 0;
      let m = 0;
      if (depth < b) {
        if (ox > 0 || oy > 0) {
          const len = Math.hypot(ox, oy) || 1;
          nx = ((px < 0 ? -1 : 1) * ox) / len;
          ny = ((py < 0 ? -1 : 1) * oy) / len;
        } else if (qx > qy) nx = px < 0 ? -1 : 1;
        else ny = py < 0 ? -1 : 1;
        const t = 1 - Math.max(depth, 0) / b;
        m = 1 - Math.sqrt(Math.max(0, 1 - t * t));
      }
      const i = (y * cw + x) * 4;
      data[i] = Math.round(127.5 + 127.5 * -nx * m);
      data[i + 1] = Math.round(127.5 + 127.5 * -ny * m);
      data[i + 2] = 128;
      data[i + 3] = 255;
    }
  }
  return { cw, ch, data };
}

const SELECTOR = ".liquid-glass, .liquid-lens";
const NS = "http://www.w3.org/2000/svg";

// La réfraction réelle (backdrop-filter + filtre SVG) n'existe que dans les navigateurs
// Chromium. Ailleurs, le CSS seul (flou, saturation, reflets) prend le relais.
const isChromium = () => {
  const ua = navigator.userAgent;
  return /Chrome\/|Chromium\//.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
};

export default function GlassEngine() {
  useEffect(() => {
    // --- Lueur qui suit le curseur (variables --mx / --my utilisées par le CSS) ---
    let lastEl = null;
    const onMove = (e) => {
      const el = e.target.closest?.(SELECTOR);
      if (lastEl && lastEl !== el) {
        lastEl.style.setProperty("--mx", "-100px");
        lastEl.style.setProperty("--my", "-100px");
      }
      if (el) {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      }
      lastEl = el;
    };
    document.addEventListener("pointermove", onMove, { passive: true });

    // --- Réfraction par élément ---
    let cleanup = () => {};
    if (isChromium()) {
      try {
        const svg = document.createElementNS(NS, "svg");
        svg.setAttribute("width", "0");
        svg.setAttribute("height", "0");
        svg.setAttribute("aria-hidden", "true");
        svg.style.cssText = "position:absolute;pointer-events:none";
        document.body.appendChild(svg);

        const items = new Map(); // élément → { id, filter, image, disp, w, h, timer }
        let n = 0;

        const build = (el) => {
          const it = items.get(el);
          const w = el.offsetWidth;
          const h = el.offsetHeight;
          if (!it || w < 8 || h < 8) return;
          if (Math.abs(w - it.w) < 2 && Math.abs(h - it.h) < 2) return;
          it.w = w;
          it.h = h;

          const cs = getComputedStyle(el);
          const raw = cs.borderTopLeftRadius;
          let radius = parseFloat(raw) || 0;
          if (raw.endsWith("%")) radius = (radius / 100) * Math.min(w, h);
          radius = Math.min(radius, w / 2, h / 2);
          const bezel = Math.max(8, Math.min(28, Math.min(w, h) * 0.38));

          const { cw, ch, data } = computeRefractionMap(w, h, radius, bezel);
          const canvas = document.createElement("canvas");
          canvas.width = cw;
          canvas.height = ch;
          canvas
            .getContext("2d")
            .putImageData(new ImageData(data, cw, ch), 0, 0);

          it.filter.setAttribute("width", w);
          it.filter.setAttribute("height", h);
          it.image.setAttribute("width", w);
          it.image.setAttribute("height", h);
          it.image.setAttribute("href", canvas.toDataURL());
          it.disps.forEach(({ node, mult }) =>
            node.setAttribute("scale", String(bezel * 1.7 * mult)),
          );
        };

        const schedule = (el) => {
          const it = items.get(el);
          if (!it) return;
          clearTimeout(it.timer);
          it.timer = setTimeout(() => build(el), it.w ? 90 : 0);
        };

        const ro = new ResizeObserver((entries) =>
          entries.forEach((e) => schedule(e.target)),
        );

        const attach = (el) => {
          if (items.has(el)) return;
          const id = `lg-${++n}`;
          const filter = document.createElementNS(NS, "filter");
          filter.setAttribute("id", id);
          filter.setAttribute("x", "0");
          filter.setAttribute("y", "0");
          filter.setAttribute("filterUnits", "userSpaceOnUse");
          filter.setAttribute("primitiveUnits", "userSpaceOnUse");
          filter.setAttribute("color-interpolation-filters", "sRGB");
          const image = document.createElementNS(NS, "feImage");
          image.setAttribute("x", "0");
          image.setAttribute("y", "0");
          image.setAttribute("preserveAspectRatio", "none");
          image.setAttribute("result", "map");
          const mkDisp = (result, mult) => {
            const node = document.createElementNS(NS, "feDisplacementMap");
            node.setAttribute("in", "SourceGraphic");
            node.setAttribute("in2", "map");
            node.setAttribute("xChannelSelector", "R");
            node.setAttribute("yChannelSelector", "G");
            node.setAttribute("result", result);
            return { node, mult };
          };
          const disps = [];
          if (el.hasAttribute("data-lg-dispersion")) {
            // Aberration chromatique : R, V et B sont déplacés de façon légèrement différente,
            // ce qui fait apparaître des franges colorées sur le bord de la lentille
            const channel = (name, mult, matrix) => {
              const d = mkDisp(`d${name}`, mult);
              const m = document.createElementNS(NS, "feColorMatrix");
              m.setAttribute("in", `d${name}`);
              m.setAttribute("type", "matrix");
              m.setAttribute("values", matrix);
              m.setAttribute("result", `c${name}`);
              disps.push(d);
              return [d.node, m];
            };
            const r = channel(
              "r",
              1.12,
              "1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0",
            );
            const gg = channel(
              "g",
              1,
              "0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0",
            );
            const bb = channel(
              "b",
              0.88,
              "0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0",
            );
            const b1 = document.createElementNS(NS, "feBlend");
            b1.setAttribute("in", "cr");
            b1.setAttribute("in2", "cg");
            b1.setAttribute("mode", "screen");
            b1.setAttribute("result", "rg");
            const b2 = document.createElementNS(NS, "feBlend");
            b2.setAttribute("in", "rg");
            b2.setAttribute("in2", "cb");
            b2.setAttribute("mode", "screen");
            filter.append(image, ...r, ...gg, ...bb, b1, b2);
          } else {
            const d = mkDisp("out", 1);
            disps.push(d);
            filter.append(image, d.node);
          }
          svg.appendChild(filter);

          items.set(el, { id, filter, image, disps, w: 0, h: 0, timer: 0 });
          el.style.backdropFilter = `url(#${id}) blur(var(--lg-blur)) saturate(var(--lg-sat)) brightness(var(--lg-bright)) contrast(var(--lg-contrast))`;
          ro.observe(el);
          schedule(el);
        };

        const scan = (root) => {
          if (root.nodeType !== 1) return;
          if (root.matches(SELECTOR)) attach(root);
          root.querySelectorAll?.(SELECTOR).forEach(attach);
        };

        const prune = () => {
          items.forEach((it, el) => {
            if (!el.isConnected) {
              clearTimeout(it.timer);
              it.filter.remove();
              ro.unobserve(el);
              items.delete(el);
            }
          });
        };

        const mo = new MutationObserver((muts) => {
          muts.forEach((m) => m.addedNodes.forEach(scan));
          if (muts.some((m) => m.removedNodes.length)) prune();
        });
        mo.observe(document.body, { childList: true, subtree: true });
        scan(document.body);

        cleanup = () => {
          mo.disconnect();
          ro.disconnect();
          items.forEach((it, el) => {
            clearTimeout(it.timer);
            el.style.backdropFilter = "";
          });
          svg.remove();
        };
      } catch {
        /* en cas d'échec, le rendu CSS seul reste actif */
      }
    }

    return () => {
      document.removeEventListener("pointermove", onMove);
      cleanup();
    };
  }, []);

  return null;
}
