// Carte de déplacement pour simuler la réfraction d'une lentille de verre.
// Pour chaque pixel : distance au bord du rectangle arrondi, normale, puis amplitude
// (0 au centre → 1 sur le bord, profil convexe). R/G encodent le vecteur dirigé vers
// l'intérieur : sur le bord, le verre « voit » le contenu situé juste à côté, courbé.
export function computeRefractionMap(w, h, radius, bezel) {
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
