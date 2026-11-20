import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import photo from "../assets/elom.png";

// Réglages rapides
const ACCENT = "#4cc3f5"; // bleu du prénom, du trait et des petits libellés
const SCALE_IDLE = 0.18; // taille de la carte au repos (1 = taille réelle)
const SCALE_OPEN_MAX = 1; // taille maximale au survol ; réduite automatiquement si l'écran est trop bas
const FIT_MARGIN = 24; // marge gardée en bas de l'écran quand la carte est agrandie (px)
const IDLE_AMP = 6; // amplitude du dandinement tout seul (degrés)
const IDLE_PERIOD = 4.6; // durée d'un aller-retour du dandinement (secondes)
const ROPE = 110; // longueur visible du ruban au-dessus de la carte (px)
const EXTRA = 520; // le ruban se prolonge au-dessus pour sortir de l'écran (px)
const MAX_ANGLE = 50; // inclinaison maximale quand on tire la carte (degrés)

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// ressorts : un balancement qui met du temps à s'éteindre, et un retour au calme rapide
const SWING = { stiffness: 40, damping: 3 };
const CALM = { stiffness: 90, damping: 14 };

const ribbonItems = Array.from({ length: 8 }, () => [
  "ELOM DEKADJEVI",
  "•",
  "IoT",
  "•",
]).flat();

function Detail({ label, children, className = "" }) {
  return (
    <div className={className}>
      <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/50">
        {label}
      </p>
      <p className="mt-1 text-[12.5px] font-medium leading-snug text-white">
        {children}
      </p>
    </div>
  );
}

/**
 * Badge de profil en liquid glass, suspendu à un lanyard dans le coin haut gauche :
 * - au repos il est tout petit et se dandine tout seul ;
 * - quand le curseur le survole, il s'agrandit et se calme pour être lisible ;
 * - on peut l'attraper et le tirer : au relâchement il repart avec sa vitesse, oscille,
 *   puis reprend son dandinement tranquille ;
 * - le ruban et la carte pivotent séparément (effet double pendule).
 * À monter une seule fois, à côté de SocialBar dans App.jsx : visible sur toutes les pages.
 * Masqué sur mobile.
 */
export default function ProfileBadge() {
  const reduce = useReducedMotion();
  const anchorRef = useRef(null);
  const anim = useRef(null);
  const grab = useRef(null);
  const hovered = useRef(false);
  const [open, setOpen] = useState(false);
  const [openScale, setOpenScale] = useState(0.8);

  const angle = useMotionValue(reduce ? 0 : 14);
  const amp = useMotionValue(0);
  const follow = useSpring(angle, { stiffness: 70, damping: 9, mass: 0.9 });
  const tilt = useTransform([angle, follow], ([a, f]) =>
    clamp((f - a) * 1.3, -25, 25),
  );

  const stop = () => {
    anim.current?.stop();
    anim.current = null;
  };

  // dandinement tout seul : une oscillation douce dont l'amplitude monte progressivement
  const idle = () => {
    stop();
    if (reduce) return;
    amp.set(0);
    const ramp = animate(amp, IDLE_AMP, { duration: 2.5 });
    const wave = animate(0, 1, {
      duration: IDLE_PERIOD,
      ease: "linear",
      repeat: Infinity,
      onUpdate: (t) => angle.set(Math.sin(t * Math.PI * 2) * amp.get()),
    });
    anim.current = {
      stop: () => {
        ramp.stop();
        wave.stop();
      },
    };
  };

  // retour à la verticale avec la vitesse en cours ; le dandinement reprend ensuite
  const settle = (spring) => {
    stop();
    anim.current = animate(angle, 0, {
      type: "spring",
      mass: 1,
      stiffness: spring.stiffness,
      damping: reduce ? 14 : spring.damping,
      velocity: angle.getVelocity(),
      onComplete: () => {
        if (!hovered.current && !grab.current) idle();
      },
    });
  };

  // petit balancement à l'arrivée sur la page, puis dandinement
  useEffect(() => {
    settle(SWING);
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // taille agrandie : la plus grande possible, tout en montrant la carte entière (ruban inclus
  // jusqu'au bas de la carte) dans la hauteur de la fenêtre
  useEffect(() => {
    const fit = () => {
      const h = anchorRef.current?.offsetHeight;
      if (!h) return;
      setOpenScale(
        clamp(
          (window.innerHeight - FIT_MARGIN) / h,
          SCALE_IDLE,
          SCALE_OPEN_MAX,
        ),
      );
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  // angle du pointeur par rapport au point d'accroche (CSS : positif = sens horaire)
  const pointerAngle = (e) => {
    const r = anchorRef.current.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - r.top;
    return (-Math.atan2(dx, dy) * 180) / Math.PI;
  };

  const onEnter = () => {
    hovered.current = true;
    setOpen(true);
    if (!grab.current) settle(CALM);
  };

  const onLeave = () => {
    hovered.current = false;
    setOpen(false);
    if (!grab.current) settle(SWING);
  };

  const onDown = (e) => {
    stop();
    e.currentTarget.setPointerCapture(e.pointerId);
    grab.current = { from: pointerAngle(e), base: angle.get() };
  };

  const onMove = (e) => {
    if (!grab.current) return;
    const next = grab.current.base + (pointerAngle(e) - grab.current.from);
    angle.set(clamp(next, -MAX_ANGLE, MAX_ANGLE));
  };

  const onUp = () => {
    if (!grab.current) return;
    grab.current = null;
    settle(SWING);
  };

  return (
    <motion.aside
      aria-label="Carte de profil"
      initial={false}
      animate={{ scale: open ? openScale : SCALE_IDLE }}
      transition={{ type: "spring", stiffness: 240, damping: 26 }}
      style={{ originX: 0, originY: 0 }}
      className="pointer-events-none fixed left-5 top-0 z-40 hidden md:block"
    >
      <div ref={anchorRef} className="relative w-[300px] select-none">
        <motion.div
          style={{ rotate: angle, originX: 0.5, originY: 0, paddingTop: ROPE }}
          className="relative"
        >
          {/* le ruban */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 w-7 -translate-x-1/2 overflow-hidden border-x border-white/15 bg-linear-to-r from-[#10141f] via-[#222a3d] to-[#10141f]"
            style={{ top: -EXTRA, height: ROPE + EXTRA }}
          >
            <div className="flex h-full flex-col items-center justify-end gap-3 pb-3">
              {ribbonItems.map((item, i) =>
                item === "•" ? (
                  <span
                    key={i}
                    className="size-1 shrink-0 rounded-full"
                    style={{ background: ACCENT }}
                  />
                ) : (
                  <span
                    key={i}
                    className="shrink-0 rotate-180 text-[8px] font-bold tracking-[0.25em] text-white/90 [writing-mode:vertical-rl]"
                  >
                    {item}
                  </span>
                ),
              )}
            </div>
          </div>

          {/* la carte, qui pivote autour de l'attache */}
          <motion.div
            style={{ rotate: tilt, originX: 0.5, originY: 0 }}
            onPointerEnter={onEnter}
            onPointerLeave={onLeave}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
            className="pointer-events-auto relative cursor-grab touch-none active:cursor-grabbing"
          >
            {/* attache métallique */}
            <div
              aria-hidden="true"
              className="absolute -top-2.5 left-1/2 z-10 h-5 w-9 -translate-x-1/2 rounded-[3px] bg-linear-to-b from-[#7b8591] to-[#4b525c] shadow-md"
            />

            <article className="liquid-glass relative rounded-[28px] px-6 pb-5 pt-7 text-white [--lg-blur:8px] [--lg-tint:3]">
              {/* fente du badge */}
              <div
                aria-hidden="true"
                className="absolute left-1/2 top-3 h-1.5 w-12 -translate-x-1/2 rounded-full bg-white/25"
              />

              <div className="flex items-start justify-between">
                <p
                  className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em]"
                  style={{ color: ACCENT }}
                >
                  Portfolio · 2026
                </p>
                <img
                  src={photo}
                  alt="Portrait de Elom Dekadjevi"
                  draggable={false}
                  className="h-[76px] w-[60px] rounded-2xl object-cover object-top ring-1 ring-white/30"
                />
              </div>

              <p className="mt-5 leading-none">
                <span
                  className="block text-[38px] font-light tracking-tight"
                  style={{ color: ACCENT }}
                >
                  Elom
                </span>
                <span className="mt-1 block origin-left scale-x-110 whitespace-nowrap text-[38px] font-extrabold uppercase tracking-tight text-white">
                  Dekadjevi
                </span>
              </p>

              <div
                className="mt-4 h-[3px] w-10 rounded-full"
                style={{ background: ACCENT }}
              />

              <p className="mt-4 text-[16px] font-semibold leading-tight">
                IoT Engineer &amp; Software Developer
              </p>
              <p className="mt-1 text-[13px] text-white/65">
                IoT · AI · Software Engineering
              </p>

              <div className="mt-5 space-y-3.5 border-t border-white/15 pt-4">
                <Detail label="Formation">
                  Licence 3 – Systèmes Embarqués &amp; IoT
                  <span className="block text-white/60">IFRI – UAC</span>
                </Detail>

                <div className="grid grid-cols-2 gap-3">
                  <Detail label="Langages">
                    Python · C · JavaScript · PHP
                  </Detail>
                  <Detail label="Frameworks">Laravel · React</Detail>
                </div>

                <Detail label="Intérêts">
                  Artificial Intelligence · Robotics · Cybersecurity
                </Detail>

                <Detail label="Langues">Français · English</Detail>
              </div>

              <div className="mt-4 flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-2 ring-1 ring-white/15">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
                </span>
                <span className="text-[12px] font-semibold">
                  Open to Opportunities
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-white/55">
                <span>IFRI · UAC · Bénin</span>
                <span>EDK-2026-001</span>
              </div>
            </article>
          </motion.div>
        </motion.div>
      </div>
    </motion.aside>
  );
}
