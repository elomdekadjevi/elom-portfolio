import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";

/**
 * Sélecteur à lentille de verre, façon iOS : une bulle de verre glisse sous les libellés,
 * s'étire quand elle accélère, grossit quand on la presse, et se laisse glisser au doigt
 * ou à la souris. Au relâchement, elle se cale sur l'option la plus proche.
 */
export default function GlassSegmented({
  options,
  value,
  onChange,
  renderLabel,
  label,
}) {
  const barRef = useRef(null);
  const rowRef = useRef(null);
  const itemRefs = useRef([]);
  const dragging = useRef(false);
  const [rects, setRects] = useState([]);
  const [ready, setReady] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [under, setUnder] = useState(null); // option sous la lentille pendant le glissement
  const activeIdx = Math.max(0, options.indexOf(value));

  // Cibles + ressorts : la lentille suit avec un léger retard, d'où l'effet « liquide »
  const tx = useMotionValue(0);
  const tw = useMotionValue(0);
  const x = useSpring(tx, { stiffness: 380, damping: 28, mass: 0.9 });
  const w = useSpring(tw, { stiffness: 380, damping: 30, mass: 0.9 });
  const press = useSpring(0, { stiffness: 420, damping: 24 });
  const vx = useVelocity(x);
  const scaleX = useTransform(
    [vx, press],
    ([v, p]) => (1 + Math.min(Math.abs(v) / 2600, 0.38)) * (1 + 0.1 * p),
  );
  const scaleY = useTransform(
    [vx, press],
    ([v, p]) => (1 - Math.min(Math.abs(v) / 9000, 0.12)) * (1 + 0.16 * p),
  );

  const measure = () => {
    const row = rowRef.current;
    if (!row) return;
    setRects(
      itemRefs.current.map((el) => ({
        x: el.offsetLeft + row.offsetLeft,
        w: el.offsetWidth,
      })),
    );
  };

  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(barRef.current);
    itemRefs.current.forEach((el) => el && ro.observe(el));
    return () => ro.disconnect();
  }, [options.join("|")]);

  useEffect(() => {
    const r = rects[activeIdx];
    if (!r || dragging.current) return;
    tx.set(r.x);
    tw.set(r.w);
    if (!ready) {
      x.jump(r.x);
      w.jump(r.w);
      setReady(true);
    }
  }, [rects, activeIdx]);

  const idxAt = (clientX) => {
    const bar = barRef.current.getBoundingClientRect();
    const px = clientX - bar.left;
    let best = 0;
    let dist = Infinity;
    rects.forEach((r, i) => {
      const d = Math.abs(px - (r.x + r.w / 2));
      if (d < dist) {
        dist = d;
        best = i;
      }
    });
    return best;
  };

  const follow = (clientX) => {
    if (!rects.length) return;
    const bar = barRef.current.getBoundingClientRect();
    const i = idxAt(clientX);
    const r = rects[i];
    const first = rects[0];
    const last = rects[rects.length - 1];
    const px = clientX - bar.left - r.w / 2;
    tx.set(Math.max(first.x - 4, Math.min(last.x + last.w - r.w + 4, px)));
    tw.set(r.w);
    setUnder(i);
  };

  const onPointerDown = (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    barRef.current.setPointerCapture(e.pointerId);
    dragging.current = true;
    setPressed(true);
    press.set(1);
    follow(e.clientX);
  };
  const onPointerMove = (e) => dragging.current && follow(e.clientX);
  const release = (e, cancel) => {
    if (!dragging.current) return;
    dragging.current = false;
    setPressed(false);
    press.set(0);
    setUnder(null);
    const i = cancel ? activeIdx : idxAt(e.clientX);
    const r = rects[i];
    if (r) {
      tx.set(r.x);
      tw.set(r.w);
    }
    if (options[i] !== value) onChange(options[i]);
  };

  const onKeyDown = (e) => {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = Math.max(0, Math.min(options.length - 1, activeIdx + dir));
    onChange(options[next]);
    itemRefs.current[next]?.focus();
  };

  const lit = under ?? activeIdx;

  return (
    <div
      ref={barRef}
      role="tablist"
      aria-label={label}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={(e) => release(e, false)}
      onPointerCancel={(e) => release(e, true)}
      className="relative inline-flex max-w-full touch-none select-none"
    >
      {/* le verre de la barre */}
      <div
        aria-hidden="true"
        className="liquid-glass absolute inset-0 rounded-full"
      />

      {/* les libellés */}
      <div ref={rowRef} className="relative z-10 flex p-1">
        {options.map((o, i) => (
          <button
            key={o}
            ref={(el) => (itemRefs.current[i] = el)}
            role="tab"
            aria-selected={i === activeIdx}
            tabIndex={i === activeIdx ? 0 : -1}
            onClick={(e) => e.detail === 0 && onChange(o)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors duration-300 md:px-5 ${
              i === lit ? "text-cream" : "text-cream/55"
            }`}
          >
            {renderLabel ? renderLabel(o) : o}
          </button>
        ))}
      </div>

      {/* la lentille : au-dessus des libellés, elle les réfracte */}
      <motion.div
        aria-hidden="true"
        data-pressed={pressed}
        className="liquid-lens pointer-events-none absolute bottom-1 left-0 top-1 z-20 rounded-full"
        style={{
          x,
          width: w,
          scaleX,
          scaleY,
          opacity: ready ? 1 : 0,
          transformOrigin: "50% 50%",
        }}
      />
    </div>
  );
}
