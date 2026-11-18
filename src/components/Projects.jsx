import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { filters, projects } from "../data/projects";
import GlassSegmented from "./GlassSegmented";

// Motif du visuel de repli (tant qu'aucune image n'est fournie)
const motifBySlug = {
  wura: "mobile",
  "e-access": "iot",
  binova: "iot",
  "e-cash": "web",
  "da-digit-all": "web",
  elenami: "web",
  homesync: "iot",
};

const pad = (n) => String(n + 1).padStart(2, "0");

// Une maquette peut être une image ou une vidéo
const isVideo = (src) => /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(src || "");

/* ───────────── Visuel génératif ───────────── */
function Art({ project, index, motif: motifProp, slice }) {
  const uid = useId().replace(/:/g, "");
  const reduce = useReducedMotion();
  const motif = motifProp ?? motifBySlug[project.slug] ?? "web";
  const mirror = index % 2 === 1;

  const draw = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { pathLength: 0, opacity: 0 },
          animate: { pathLength: 1, opacity: 1 },
          transition: { duration: 1.4, delay, ease: "easeInOut" },
        };
  const pop = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.55, delay, ease: "easeOut" },
        };

  const line = {
    fill: "none",
    stroke: "var(--color-sky)",
    strokeWidth: 1.5,
    strokeLinecap: "round",
  };

  return (
    <svg
      viewBox="0 0 400 500"
      preserveAspectRatio={slice ? "xMidYMid slice" : "xMidYMid meet"}
      className="h-full w-full overflow-visible"
      role="img"
      aria-label={`Visuel du projet ${project.name}`}
    >
      <defs>
        <linearGradient id={`bg${uid}`} x1="1" y1="0" x2="0" y2="1">
          <stop
            offset="0"
            style={{
              stopColor:
                "color-mix(in srgb, var(--color-sky) 28%, var(--color-ink))",
            }}
          />
          <stop offset="1" style={{ stopColor: "var(--color-ink)" }} />
        </linearGradient>
        <radialGradient id={`glow${uid}`} cx="0.7" cy="0.25" r="0.6">
          <stop offset="0" stopColor="var(--color-sky)" stopOpacity="0.35" />
          <stop offset="1" stopColor="var(--color-sky)" stopOpacity="0" />
        </radialGradient>
        <pattern
          id={`dots${uid}`}
          width="24"
          height="24"
          patternUnits="userSpaceOnUse"
        >
          <circle
            cx="2"
            cy="2"
            r="1"
            fill="var(--color-cream)"
            fillOpacity="0.14"
          />
        </pattern>
      </defs>
      <rect
        x="-1000"
        y="-1000"
        width="2400"
        height="2500"
        fill={`url(#bg${uid})`}
      />
      <rect
        x="-1000"
        y="-1000"
        width="2400"
        height="2500"
        fill={`url(#dots${uid})`}
      />
      <rect width="400" height="500" fill={`url(#glow${uid})`} />

      <g transform={mirror ? "translate(400 0) scale(-1 1)" : undefined}>
        {motif === "iot" && (
          <g>
            {[
              "M0 140 H150 V215",
              "M0 340 H120 V285 H150",
              "M250 230 H300 V120 H400",
              "M250 275 H320 V390 H400",
              "M200 60 V210",
            ].map((d, i) => (
              <motion.path key={d} d={d} {...line} {...draw(i * 0.15)} />
            ))}
            <motion.rect
              x="150"
              y="210"
              width="100"
              height="80"
              rx="10"
              {...line}
              {...draw(0.2)}
            />
            <motion.rect
              x="172"
              y="232"
              width="56"
              height="36"
              rx="5"
              fill="var(--color-sky)"
              fillOpacity="0.18"
              stroke="none"
              {...pop(0.6)}
            />
            {[
              [150, 215],
              [150, 285],
              [250, 230],
              [250, 275],
              [200, 210],
              [400, 120],
              [400, 390],
              [200, 60],
            ].map(([cx, cy], i) => (
              <motion.circle
                key={i}
                cx={cx}
                cy={cy}
                r="5"
                fill="var(--color-sky)"
                animate={reduce ? {} : { opacity: [0.35, 1, 0.35] }}
                transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.3 }}
              />
            ))}
          </g>
        )}

        {motif === "web" && (
          <g>
            <motion.rect
              x="50"
              y="110"
              width="300"
              height="280"
              rx="16"
              {...line}
              {...draw()}
            />
            <line
              x1="50"
              y1="150"
              x2="350"
              y2="150"
              stroke="var(--color-sky)"
              strokeOpacity="0.4"
            />
            {[70, 86, 102].map((cx) => (
              <circle
                key={cx}
                cx={cx}
                cy="130"
                r="4"
                fill="var(--color-sky)"
                fillOpacity="0.7"
              />
            ))}
            <motion.rect
              x="70"
              y="172"
              width="170"
              height="16"
              rx="8"
              fill="var(--color-cream)"
              fillOpacity="0.85"
              stroke="none"
              {...pop(0.3)}
            />
            <motion.rect
              x="70"
              y="198"
              width="110"
              height="9"
              rx="4.5"
              fill="var(--color-cream)"
              fillOpacity="0.4"
              stroke="none"
              {...pop(0.4)}
            />
            <motion.rect
              x="70"
              y="228"
              width="260"
              height="92"
              rx="10"
              fill="var(--color-sky)"
              fillOpacity="0.2"
              stroke="none"
              {...pop(0.5)}
            />
            <motion.rect
              x="70"
              y="336"
              width="120"
              height="38"
              rx="8"
              fill="var(--color-cream)"
              fillOpacity="0.12"
              stroke="none"
              {...pop(0.6)}
            />
            <motion.rect
              x="210"
              y="336"
              width="120"
              height="38"
              rx="8"
              fill="var(--color-cream)"
              fillOpacity="0.12"
              stroke="none"
              {...pop(0.7)}
            />
            <motion.path
              d="M70 300 L130 262 L180 288 L240 244 L330 296"
              {...line}
              {...draw(0.9)}
            />
          </g>
        )}

        {motif === "mobile" && (
          <g>
            <motion.rect
              x="125"
              y="70"
              width="150"
              height="340"
              rx="28"
              {...line}
              {...draw()}
            />
            <rect
              x="175"
              y="84"
              width="50"
              height="8"
              rx="4"
              fill="var(--color-sky)"
              fillOpacity="0.6"
            />
            <motion.rect
              x="141"
              y="112"
              width="118"
              height="96"
              rx="14"
              fill="var(--color-sky)"
              fillOpacity="0.22"
              stroke="none"
              {...pop(0.3)}
            />
            <motion.rect
              x="141"
              y="222"
              width="54"
              height="64"
              rx="10"
              fill="var(--color-cream)"
              fillOpacity="0.14"
              stroke="none"
              {...pop(0.45)}
            />
            <motion.rect
              x="205"
              y="222"
              width="54"
              height="64"
              rx="10"
              fill="var(--color-cream)"
              fillOpacity="0.14"
              stroke="none"
              {...pop(0.55)}
            />
            <motion.rect
              x="141"
              y="300"
              width="118"
              height="10"
              rx="5"
              fill="var(--color-cream)"
              fillOpacity="0.5"
              stroke="none"
              {...pop(0.65)}
            />
            <motion.rect
              x="141"
              y="320"
              width="80"
              height="8"
              rx="4"
              fill="var(--color-cream)"
              fillOpacity="0.3"
              stroke="none"
              {...pop(0.75)}
            />
            <rect
              x="160"
              y="384"
              width="80"
              height="5"
              rx="2.5"
              fill="var(--color-cream)"
              fillOpacity="0.35"
            />
            {[
              [78, 130],
              [330, 190],
              [95, 330],
              [318, 360],
            ].map(([cx, cy], i) => (
              <motion.path
                key={i}
                d={`M${cx} ${cy - 10} L${cx + 3} ${cy - 3} L${cx + 10} ${cy} L${cx + 3} ${cy + 3} L${cx} ${cy + 10} L${cx - 3} ${cy + 3} L${cx - 10} ${cy} L${cx - 3} ${cy - 3} Z`}
                fill="var(--color-sky)"
                animate={
                  reduce
                    ? {}
                    : { opacity: [0.2, 1, 0.2], scale: [0.8, 1.1, 0.8] }
                }
                style={{ transformOrigin: `${cx}px ${cy}px` }}
                transition={{ duration: 2.8, repeat: Infinity, delay: i * 0.5 }}
              />
            ))}
          </g>
        )}
        {motif === "app" && (
          <g>
            <motion.circle
              cx="112"
              cy="92"
              r="11"
              fill="var(--color-sky)"
              fillOpacity="0.85"
              {...pop(0.1)}
            />
            <motion.rect
              x="132"
              y="82"
              width="158"
              height="20"
              rx="10"
              fill="var(--color-cream)"
              fillOpacity="0.16"
              stroke="none"
              {...pop(0.15)}
            />
            <motion.rect
              x="100"
              y="122"
              width="200"
              height="112"
              rx="16"
              fill="var(--color-sky)"
              fillOpacity="0.28"
              stroke="none"
              {...pop(0.25)}
            />
            {[
              [140, 176, 20],
              [196, 160, 12],
              [250, 190, 16],
            ].map(([cx, cy, r], i) => (
              <motion.circle
                key={i}
                cx={cx}
                cy={cy}
                r={r}
                fill="var(--color-cream)"
                fillOpacity="0.55"
                {...pop(0.4 + i * 0.1)}
              />
            ))}
            <motion.path
              d="M100 210 L140 188 L180 206 L230 178 L300 214"
              {...line}
              {...draw(0.6)}
            />
            {[
              [100, 250],
              [206, 250],
              [100, 370],
              [206, 370],
            ].map(([x0, y0], i) => (
              <g key={i}>
                <motion.rect
                  x={x0}
                  y={y0}
                  width="94"
                  height="104"
                  rx="12"
                  fill="var(--color-cream)"
                  fillOpacity="0.13"
                  stroke="none"
                  {...pop(0.5 + i * 0.1)}
                />
                <rect
                  x={x0 + 10}
                  y={y0 + 76}
                  width="52"
                  height="7"
                  rx="3.5"
                  fill="var(--color-cream)"
                  fillOpacity="0.6"
                />
                <rect
                  x={x0 + 10}
                  y={y0 + 88}
                  width="32"
                  height="6"
                  rx="3"
                  fill="var(--color-sky)"
                  fillOpacity="0.8"
                />
              </g>
            ))}
            <rect
              x="100"
              y="486"
              width="200"
              height="6"
              rx="3"
              fill="var(--color-cream)"
              fillOpacity="0.25"
            />
          </g>
        )}
      </g>
    </svg>
  );
}

function Cover({ project, index, motif, slice, src }) {
  const image = src === undefined ? project.cover : src;
  if (image) {
    return (
      <img
        src={image}
        alt={project.name}
        loading="lazy"
        className="h-full w-full object-cover"
      />
    );
  }
  return <Art project={project} index={index} motif={motif} slice={slice} />;
}

function Badges({ items }) {
  if (!items?.length) return null;
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((t) => (
        <li
          key={t}
          className="rounded-full border border-cream/15 bg-cream/5 px-3 py-1 text-xs text-cream/80"
        >
          {t}
        </li>
      ))}
    </ul>
  );
}

/* ───────────── Page détail ───────────── */
function Detail({ project, index, onClose, onNavigate }) {
  const ref = useRef(null);
  const next = projects[(index + 1) % projects.length];

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  useEffect(() => {
    ref.current?.scrollTo({ top: 0 });
  }, [project.slug]);

  return (
    <motion.div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label={project.name}
      className="fixed inset-0 z-[60] overflow-y-auto bg-ink/90 backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-5 md:px-16">
        <button
          onClick={onClose}
          className="glass rounded-full px-5 py-2 text-sm transition-colors hover:text-sky"
        >
          ← Retour aux projets
        </button>
        <span className="font-mono text-sm text-cream/60">
          {pad(index)} / {pad(projects.length - 1)}
        </span>
      </div>

      <motion.div
        key={project.slug}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative -mt-[76px] h-[58vh] min-h-[22rem]">
          <Cover project={project} index={index} />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-6 pb-8 md:px-16">
            <p className="text-sm uppercase tracking-widest text-sky">
              {project.category}
            </p>
            <h3 className="mt-2 text-[clamp(3rem,11vw,8rem)] font-bold leading-[0.95] tracking-tight">
              {project.name}
            </h3>
          </div>
        </div>

        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-14 md:grid-cols-[1fr_2fr] md:px-16">
          <dl className="space-y-8 text-sm">
            <div>
              <dt className="mb-2 uppercase tracking-widest text-cream/50">
                Aperçu
              </dt>
              <dd className="text-base text-cream/85">
                {project.cardTitle.split(" — ")[1]}
              </dd>
            </div>
            {project.tech.length > 0 && (
              <div>
                <dt className="mb-3 uppercase tracking-widest text-cream/50">
                  Technologies
                </dt>
                <dd>
                  <Badges items={project.tech} />
                </dd>
              </div>
            )}
            {project.role && (
              <div>
                <dt className="mb-2 uppercase tracking-widest text-cream/50">
                  Mon rôle
                </dt>
                <dd className="text-base text-cream/85">{project.role}</dd>
              </div>
            )}
            {project.links.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {project.links.map((l) => (
                  <a
                    key={l.url}
                    href={l.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-sky px-5 py-2 text-sm font-semibold text-ink transition-opacity hover:opacity-90"
                  >
                    {l.label} ↗
                  </a>
                ))}
              </div>
            )}
          </dl>

          <div>
            <p className="text-xl leading-relaxed text-cream/90 md:text-2xl">
              {project.description}
            </p>

            {/* Maquette : image ou vidéo avec commandes */}
            {project.maquette && (
              <figure className="mt-10">
                <div className="overflow-hidden rounded-2xl border border-cream/10 bg-black">
                  {isVideo(project.maquette) ? (
                    <video
                      src={project.maquette}
                      poster={project.maquettePoster}
                      controls
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      className="w-full"
                    />
                  ) : (
                    <img
                      src={project.maquette}
                      alt={`${project.name} — maquette`}
                      loading="lazy"
                      className="w-full"
                    />
                  )}
                </div>
                {project.maquetteLabel && (
                  <figcaption className="mt-3 text-sm text-cream/60">
                    {project.maquetteLabel}
                  </figcaption>
                )}
              </figure>
            )}

            {project.images.length > 0 && (
              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {project.images.map((src) => (
                  <img
                    key={src}
                    src={src}
                    alt={`${project.name} — capture`}
                    loading="lazy"
                    className="w-full rounded-2xl border border-cream/10"
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => onNavigate(next.slug)}
          className="group mx-auto block w-full max-w-6xl border-t border-cream/10 px-6 py-14 text-left md:px-16"
        >
          <span className="text-sm uppercase tracking-widest text-cream/50">
            Projet suivant
          </span>
          <span className="mt-2 flex items-baseline gap-4 text-[clamp(2.5rem,8vw,6rem)] font-bold leading-none transition-colors group-hover:text-sky">
            {next.name}
            <span className="text-sky transition-transform group-hover:translate-x-3">
              →
            </span>
          </span>
        </button>
      </motion.div>
    </motion.div>
  );
}

/* ───────────── iPhone Pro Max ───────────── */
function PhoneFrame({ pw, children }) {
  const fw = pw * 0.03; // cadre titane
  const bz = pw * 0.014; // bezel noir
  const bt = Math.max(2, pw * 0.02); // épaisseur des boutons
  const metal = "linear-gradient(90deg,#6f6c67,#c9c5bd 45%,#6f6c67)";
  const sideBtn = (side, top, height) => (
    <span
      aria-hidden="true"
      className="absolute rounded-sm"
      style={{
        [side]: -bt * 0.75,
        top: `${top}%`,
        height: `${height}%`,
        width: bt,
        background: metal,
        boxShadow: "0 0 0 0.5px rgb(0 0 0 / 0.6)",
      }}
    />
  );
  const icon = { height: pw * 0.04 };

  return (
    <div className="relative h-full w-full">
      {sideBtn("left", 14.5, 3.5)} {/* bouton Action */}
      {sideBtn("left", 21, 6.5)} {/* volume + */}
      {sideBtn("left", 29.5, 6.5)} {/* volume − */}
      {sideBtn("right", 25, 10.5)} {/* veille */}
      {sideBtn("right", 58, 7)} {/* Camera Control */}
      {/* Cadre titane */}
      <div
        className="h-full w-full"
        style={{
          borderRadius: pw * 0.18,
          padding: fw,
          background:
            "linear-gradient(145deg,#a29e96 0%,#4b4945 14%,#1d1c1b 40%,#2a2928 62%,#55524e 86%,#a29e96 100%)",
          boxShadow:
            "0 28px 60px rgb(0 0 0 / 0.65), 0 0 0 1px rgb(0 0 0 / 0.8), inset 0 0 0 1px rgb(255 255 255 / 0.22)",
        }}
      >
        {/* Bezel noir */}
        <div
          className="relative h-full w-full overflow-hidden bg-black"
          style={{ borderRadius: pw * 0.15, padding: bz }}
        >
          {/* Écran */}
          <div
            className="relative h-full w-full overflow-hidden bg-ink"
            style={{ borderRadius: pw * 0.135 }}
          >
            {children}

            {/* Barre d'état */}
            <div
              className="pointer-events-none absolute inset-x-0 z-10 flex items-center justify-between text-white"
              style={{
                top: pw * 0.03,
                height: pw * 0.085,
                padding: `0 ${pw * 0.075}px`,
                fontSize: pw * 0.052,
                fontWeight: 600,
              }}
            >
              <span>9:41</span>
              <span className="flex items-center" style={{ gap: pw * 0.014 }}>
                <svg viewBox="0 0 18 12" style={icon} fill="currentColor">
                  <rect x="0" y="8" width="3" height="4" rx="1" />
                  <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
                  <rect x="10" y="3" width="3" height="9" rx="1" />
                  <rect x="15" y="0" width="3" height="12" rx="1" />
                </svg>
                <svg
                  viewBox="0 0 16 12"
                  style={icon}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                >
                  <path d="M1.5 4.2a9.5 9.5 0 0 1 13 0" />
                  <path d="M4 7a6 6 0 0 1 8 0" />
                  <circle
                    cx="8"
                    cy="10"
                    r="1.2"
                    fill="currentColor"
                    stroke="none"
                  />
                </svg>
                <svg viewBox="0 0 27 12" style={{ height: pw * 0.042 }}>
                  <rect
                    x="0.5"
                    y="0.5"
                    width="22"
                    height="11"
                    rx="3.5"
                    fill="none"
                    stroke="currentColor"
                    opacity=".45"
                  />
                  <rect
                    x="2"
                    y="2"
                    width="19"
                    height="8"
                    rx="2.2"
                    fill="currentColor"
                  />
                  <rect
                    x="24"
                    y="4"
                    width="2"
                    height="4"
                    rx="1"
                    fill="currentColor"
                    opacity=".45"
                  />
                </svg>
              </span>
            </div>

            {/* Dynamic Island */}
            <span
              className="absolute left-1/2 z-20 -translate-x-1/2 rounded-full bg-black"
              style={{ top: pw * 0.03, width: pw * 0.3, height: pw * 0.085 }}
            >
              <span
                className="absolute rounded-full"
                style={{
                  right: pw * 0.02,
                  top: "50%",
                  width: pw * 0.035,
                  height: pw * 0.035,
                  transform: "translateY(-50%)",
                  background:
                    "radial-gradient(circle at 35% 35%, #3b4a7a 0%, #10142a 55%, #05060c 100%)",
                }}
              />
            </span>

            {/* Indicateur d'accueil */}
            <span
              className="absolute left-1/2 z-10 -translate-x-1/2 rounded-full bg-white/85"
              style={{
                bottom: pw * 0.028,
                width: pw * 0.34,
                height: Math.max(2, pw * 0.014),
              }}
            />

            {/* Reflet du verre */}
            <span
              className="pointer-events-none absolute inset-0 z-20"
              style={{
                background:
                  "linear-gradient(115deg, rgb(255 255 255 / 0.2) 0%, rgb(255 255 255 / 0) 30%)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────── Cadre maquette (image ou vidéo) ───────────── */
// Plaque de verre biseautée, comme le cadre du téléphone mais pour une photo
// ou une vidéo de la maquette. La vidéo ne joue que pendant le survol.
function MaquetteFrame({ width, src, poster, label, hover }) {
  const videoRef = useRef(null);
  const barRef = useRef(null);
  const reduce = useReducedMotion();
  const video = isVideo(src);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useMotionValueEvent(hover, "change", (v) => {
    const el = videoRef.current;
    if (!el || reduce) return;
    if (v > 0.5) el.play().catch(() => {});
    else el.pause();
  });

  const bz = Math.max(3, width * 0.022); // épaisseur du biseau
  const radius = width * 0.07;

  return (
    <div
      className="relative h-full w-full"
      style={{
        borderRadius: radius,
        padding: bz,
        background:
          "linear-gradient(145deg, rgb(250 247 242 / 0.4) 0%, rgb(250 247 242 / 0.08) 38%, rgb(123 167 255 / 0.28) 100%)",
        boxShadow:
          "0 28px 60px rgb(0 0 0 / 0.6), 0 0 48px rgb(123 167 255 / 0.22), 0 0 0 1px rgb(0 0 0 / 0.7), inset 0 0 0 1px rgb(250 247 242 / 0.3)",
      }}
    >
      <div
        className="relative h-full w-full overflow-hidden bg-black"
        style={{ borderRadius: radius - bz * 0.7 }}
      >
        {failed ? (
          <div className="grid h-full w-full place-items-center bg-ink px-4 text-center text-xs text-cream/60">
            Maquette indisponible
          </div>
        ) : video ? (
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            muted
            loop
            playsInline
            preload="metadata"
            onLoadedData={() => setReady(true)}
            onError={() => setFailed(true)}
            onTimeUpdate={(e) => {
              const v = e.currentTarget;
              if (barRef.current && v.duration)
                barRef.current.style.transform = `scaleX(${v.currentTime / v.duration})`;
            }}
            className="h-full w-full object-cover"
          />
        ) : (
          <img
            src={src}
            alt={label || "Maquette du projet"}
            loading="lazy"
            onLoad={() => setReady(true)}
            onError={() => setFailed(true)}
            className="h-full w-full object-cover"
          />
        )}

        {/* attente du média */}
        {!ready && !failed && (
          <span
            aria-hidden="true"
            className="absolute inset-0 animate-pulse bg-gradient-to-br from-cream/10 to-cream/0"
          />
        )}

        {/* léger voile pour lire les textes */}
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

        {/* pastille d'état */}
        <span className="absolute left-2.5 top-2.5 z-10 flex items-center gap-1.5 rounded-full bg-black/55 py-1 pl-2 pr-2.5 text-[10px] font-medium text-cream/90 backdrop-blur-md">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              video ? "animate-pulse bg-[#ff5f57]" : "bg-sky"
            }`}
          />
          {video ? "Maquette en action" : "Maquette"}
        </span>

        {/* légende */}
        {label && (
          <span className="absolute inset-x-0 bottom-0 z-10 truncate px-3 pb-3 text-[11px] leading-tight text-cream/90">
            {label}
          </span>
        )}

        {/* progression de la vidéo */}
        {video && (
          <span className="absolute inset-x-0 bottom-0 z-10 h-0.5 bg-cream/15">
            <span
              ref={barRef}
              className="block h-full origin-left bg-sky"
              style={{ transform: "scaleX(0)" }}
            />
          </span>
        )}

        {/* reflet du verre */}
        <span
          className="pointer-events-none absolute inset-0 z-20"
          style={{
            background:
              "linear-gradient(115deg, rgb(255 255 255 / 0.18) 0%, rgb(255 255 255 / 0) 30%)",
          }}
        />
      </div>
    </div>
  );
}

/* ───────────── Éventail de projets ───────────── */
const rad = (d) => (d * Math.PI) / 180;
const deg = (r) => (r * 180) / Math.PI;

function FanTile({ p, i, pos, geo, active, onSelect }) {
  const { R, step, tw, th, bw, bh, pw, dw } = geo;
  const hasPhone = p.devices?.includes("phone");
  const hasMaquette = Boolean(p.maquette);
  const hasDevice = hasPhone || hasMaquette;
  const idx = projects.indexOf(p);

  // Taille du cadre maquette : respecte le ratio et ne dépasse pas la fenêtre
  const mRatio = p.maquetteRatio ?? 4 / 3; // largeur / hauteur
  const mh = Math.min(dw / mRatio, bh * 0.72);
  const mw = mh * mRatio;
  // Si le projet a aussi un téléphone, la maquette se place à sa gauche
  const maquetteRight = bw * 0.04 + (hasPhone ? pw + 14 : 0);
  const sideW =
    (hasPhone ? pw + (hasMaquette ? 14 : 0) : 0) + (hasMaquette ? mw : 0);

  // h : progression du survol (0 → 1), animée au ressort
  const h = useSpring(0, { stiffness: 220, damping: 22, mass: 0.8 });

  // Position sur l'arc, pilotée par le défilement
  const d = useTransform(pos, (c) => i - c);
  const x = useTransform(d, (v) => R * Math.sin(rad(v * step)));
  const y = useTransform(d, (v) => R * (1 - Math.cos(rad(v * step))));
  const rotate = useTransform(d, (v) => v * step);
  const scale = useTransform(d, (v) => 1 - Math.min(Math.abs(v), 3) * 0.07);
  const baseOpacity = useTransform(d, (v) =>
    Math.max(0, 1 - Math.max(0, Math.abs(v) - 1) * 0.3),
  );
  const opacity = useTransform([baseOpacity, h], ([b, hv]) => b + (1 - b) * hv);
  const zIndex = useTransform(
    [d, h],
    ([v, hv]) => 100 - Math.round(Math.abs(v) * 10) + Math.round(hv * 150),
  );
  const pointerEvents = useTransform(baseOpacity, (o) =>
    o < 0.05 ? "none" : "auto",
  );

  // Au survol, la tuile portrait se transforme en fenêtre de navigateur (écran de PC)
  const width = useTransform(h, [0, 1], [tw, bw]);
  const height = useTransform(h, [0, 1], [th, bh]);
  const radius = useTransform(h, [0, 1], [24, 16]);
  const barH = useTransform(h, [0, 1], [0, 38]);
  const detailHeight = useTransform(h, [0, 1], [0, 104]);
  const innerY = useTransform(h, [0, 1], [0, -8]);
  const innerRotate = useTransform([rotate, h], ([r, hv]) => -r * hv);
  const filter = useTransform([d, h], ([v, hv]) => {
    const k = Math.min(Math.abs(v), 1) * (1 - hv);
    return `grayscale(${k}) brightness(${1 - k * 0.35})`;
  });
  const boxShadow = useTransform(
    h,
    (v) =>
      `0 ${20 + 30 * v}px ${40 + 40 * v}px rgb(0 0 0 / 0.5), 0 0 ${80 * v}px rgb(123 167 255 / ${0.35 * v})`,
  );
  const borderColor = useTransform(
    h,
    [0, 1],
    ["rgba(250,247,242,0.2)", "rgba(123,167,255,0.7)"],
  );
  const textPad = useTransform(h, [0, 1], [20, hasDevice ? sideW + 44 : 20]);
  const phoneScale = useTransform(h, [0.3, 1], [0.6, 1]);
  const phoneY = useTransform(h, [0, 1], [60, 0]);
  const phoneRotate = useTransform(h, [0, 1], [8, 0]);
  const maquetteRotate = useTransform(h, [0, 1], [-6, 0]);

  let host = `projets/${p.slug}`;
  try {
    if (p.links?.[0]?.url) host = new URL(p.links[0].url).host;
  } catch {
    /* lien invalide : on garde le repli */
  }

  return (
    <motion.button
      onClick={() => onSelect(p, i)}
      onHoverStart={() => h.set(1)}
      onHoverEnd={() => h.set(0)}
      onFocus={() => h.set(1)}
      onBlur={() => h.set(0)}
      aria-label={active ? `Ouvrir ${p.name}` : `Aller à ${p.name}`}
      aria-current={active ? "true" : undefined}
      style={{
        x,
        y,
        rotate,
        scale,
        opacity,
        zIndex,
        pointerEvents,
        width: tw,
        height: th,
        marginLeft: -tw / 2,
        transformOrigin: "50% 100%",
      }}
      className="group absolute left-1/2 top-0 block text-left"
    >
      <motion.div
        style={{
          width,
          height,
          x: "-50%",
          y: innerY,
          rotate: innerRotate,
          filter,
          transformOrigin: "50% 100%",
        }}
        className="absolute bottom-0 left-1/2"
      >
        <motion.div
          style={{ boxShadow, borderColor, borderRadius: radius }}
          className="absolute inset-0 overflow-hidden border bg-ink"
        >
          {/* barre de navigateur : feux tricolores + adresse */}
          <motion.div
            style={{ height: barH, opacity: h }}
            className="absolute inset-x-0 top-0 z-10 flex items-center gap-3 overflow-hidden border-b border-cream/10 bg-cream/10 px-4 backdrop-blur-md"
          >
            <span className="flex shrink-0 gap-1.5">
              <i className="block h-3 w-3 rounded-full bg-[#ff5f57]" />
              <i className="block h-3 w-3 rounded-full bg-[#febc2e]" />
              <i className="block h-3 w-3 rounded-full bg-[#28c840]" />
            </span>
            <span className="mx-auto w-full max-w-[60%] truncate rounded-full bg-ink/50 px-4 py-1 text-center text-[11px] text-cream/70">
              {host}
            </span>
            <span className="w-12 shrink-0" />
          </motion.div>

          {/* écran */}
          <motion.div
            style={{ top: barH }}
            className="absolute inset-x-0 bottom-0"
          >
            <Cover project={p} index={idx} />
            {hasDevice && !p.cover && (
              <motion.div style={{ opacity: h }} className="absolute inset-0">
                <Cover project={p} index={idx} motif="web" />
              </motion.div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/20 to-transparent" />
          </motion.div>

          {/* reflet qui traverse l'écran au survol */}
          <span className="pointer-events-none absolute inset-y-0 left-0 z-20 w-1/4 -translate-x-full skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/25 to-transparent transition-none group-hover:translate-x-[520%] group-hover:transition-transform group-hover:duration-700 group-hover:ease-out" />

          <motion.div
            style={{ paddingRight: textPad }}
            className="absolute inset-x-0 bottom-0 z-10 p-4 md:p-5"
          >
            <span className="font-mono text-[11px] text-sky">{pad(idx)}</span>
            <p className="mt-1 text-xl font-extrabold leading-tight tracking-tight md:text-2xl">
              {p.name}
            </p>
            <p className="mt-1 text-[11px] uppercase tracking-widest text-cream/60">
              {p.category}
            </p>

            <motion.div
              style={{ height: detailHeight, opacity: h }}
              className="overflow-hidden"
            >
              <p className="mt-3 line-clamp-2 max-w-xl text-xs leading-relaxed text-cream/85 md:text-sm">
                {p.cardText}
              </p>
              {p.tech.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {p.tech.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-cream/20 bg-cream/10 px-2 py-0.5 text-[10px] text-cream/80"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
              <p className="mt-2 text-xs font-semibold text-sky">
                {active ? "Ouvrir le projet →" : "Voir ce projet →"}
              </p>
            </motion.div>
          </motion.div>
        </motion.div>

        {hasPhone && (
          <motion.div
            aria-hidden="true"
            style={{
              width: pw,
              height: pw * 2.12,
              opacity: h,
              scale: phoneScale,
              y: phoneY,
              rotate: phoneRotate,
              right: bw * 0.04,
              transformOrigin: "50% 100%",
            }}
            className="pointer-events-none absolute -bottom-3 z-30"
          >
            <PhoneFrame pw={pw}>
              <Cover
                project={p}
                index={idx}
                motif="app"
                slice
                src={p.phoneCover}
              />
            </PhoneFrame>
          </motion.div>
        )}

        {hasMaquette && (
          <motion.div
            aria-hidden="true"
            style={{
              width: mw,
              height: mh,
              opacity: h,
              scale: phoneScale,
              y: phoneY,
              rotate: maquetteRotate,
              right: maquetteRight,
              transformOrigin: "50% 100%",
            }}
            className="pointer-events-none absolute -bottom-3 z-30"
          >
            <MaquetteFrame
              width={mw}
              src={p.maquette}
              poster={p.maquettePoster}
              label={p.maquetteLabel}
              hover={h}
            />
          </motion.div>
        )}
      </motion.div>
    </motion.button>
  );
}

/* ───────────── Section ───────────── */
export default function Projects() {
  const sectionRef = useRef(null);
  const areaRef = useRef(null);
  const [filter, setFilter] = useState("Tous");
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [size, setSize] = useState({ w: 1000, h: 420 });

  const visible = useMemo(
    () =>
      filter === "Tous"
        ? projects
        : projects.filter((p) => p.tags.includes(filter)),
    [filter],
  );
  const n = visible.length;
  const current = visible[Math.min(idx, n - 1)];
  const count = (f) =>
    f === "Tous"
      ? projects.length
      : projects.filter((p) => p.tags.includes(f)).length;
  const selectedIndex = projects.findIndex((p) => p.slug === selected);

  const target = useMotionValue(0);
  const pos = useSpring(target, { stiffness: 140, damping: 20, mass: 0.8 });

  // Valeurs lues par les écouteurs natifs
  const live = useRef({ idx: 0, n, selected: null });
  live.current = { idx, n, selected };

  const goTo = (k) => {
    const c = Math.max(0, Math.min(live.current.n - 1, k));
    setIdx(c);
    target.set(c);
  };

  // Molette, tactile et clavier : l'éventail avance d'un cran. Aux extrémités l'événement
  // n'est pas consommé, donc la page (défilement horizontal du site) reprend la main.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let acc = 0;
    let lockedUntil = 0;
    let lastStep = 0;
    const canMove = (dir) => {
      const { idx: i, n: len } = live.current;
      return dir > 0 ? i < len - 1 : i > 0;
    };
    const step = (dir) => {
      goTo(live.current.idx + dir);
      lockedUntil = performance.now() + 480;
      lastStep = performance.now();
      acc = 0;
    };

    const onWheel = (e) => {
      if (live.current.selected) return;
      const delta =
        Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (!delta) return;
      const dir = delta > 0 ? 1 : -1;
      const now = performance.now();
      if (!canMove(dir)) {
        // évite que l'inertie du pavé tactile saute aussitôt à la page suivante
        if (now - lastStep < 700) {
          e.preventDefault();
          e.stopPropagation();
        }
        acc = 0;
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      if (now < lockedUntil) return;
      acc += delta;
      if (Math.abs(acc) > 45) step(dir);
    };

    let t0 = null;
    const onTouchStart = (e) => {
      const t = e.touches[0];
      t0 = { x: t.clientX, y: t.clientY, done: false };
    };
    const onTouchMove = (e) => {
      if (!t0 || live.current.selected) return;
      const t = e.touches[0];
      const dx = t.clientX - t0.x;
      const dy = t.clientY - t0.y;
      const main = Math.abs(dx) >= Math.abs(dy) ? dx : dy;
      if (Math.abs(main) < 8) return;
      const dir = main < 0 ? 1 : -1;
      if (!canMove(dir)) return;
      e.preventDefault();
      e.stopPropagation();
      if (!t0.done && Math.abs(main) > 40) {
        t0.done = true;
        step(dir);
      }
    };
    const onKey = (e) => {
      if (live.current.selected) return;
      const dir = ["ArrowRight", "ArrowDown"].includes(e.key)
        ? 1
        : ["ArrowLeft", "ArrowUp"].includes(e.key)
          ? -1
          : 0;
      if (dir && canMove(dir) && el.contains(document.activeElement)) {
        e.preventDefault();
        step(dir);
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("keydown", onKey);
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) =>
      setSize({ w: e.contentRect.width, h: e.contentRect.height }),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const changeFilter = (f) => {
    setFilter(f);
    setIdx(0);
    target.set(0);
    pos.jump(0);
  };

  const onSelect = (p, i) => (i === idx ? setSelected(p.slug) : goTo(i));

  // Géométrie de l'éventail : tuiles posées sur un arc de cercle
  const tw = Math.max(128, Math.min(280, size.w * 0.22, (size.h * 0.8) / 1.38));
  const th = tw * 1.38;
  const R = Math.max(size.w * 0.85, 360);
  const step = deg((tw * 0.8) / R);
  const bw = Math.min(size.w - 8, 820, Math.max(size.w * 0.6, th * 1.92));
  const bh = bw * 0.6;
  const pw = Math.max(78, bw * 0.19);
  const dw = Math.max(120, bw * 0.3); // largeur max du cadre maquette
  const geo = { R, step, tw, th, bw, bh, pw, dw };

  return (
    <section
      id="projets"
      ref={sectionRef}
      className="relative flex h-screen flex-col overflow-hidden px-6 pb-6 pt-24 md:px-16"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-sky">
          Sélection · {pad(projects.length - 1)}
        </p>
        <h2 className="mt-1 text-4xl font-extrabold md:text-6xl">
          Mes projets
        </h2>

        <div className="mt-5">
          <GlassSegmented
            options={filters}
            value={filter}
            onChange={changeFilter}
            label="Filtrer les projets"
            renderLabel={(f) => (
              <>
                {f}{" "}
                <sup className="font-mono text-[10px] opacity-70">
                  {count(f)}
                </sup>
              </>
            )}
          />
        </div>

        <div className="mt-4 h-12 max-w-xl">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={current.slug}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="text-sm leading-relaxed text-cream/75 md:text-base"
            >
              {current.cardText}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* L'éventail */}
      <div ref={areaRef} className="relative min-h-0 flex-1">
        <div
          className="absolute inset-x-0"
          style={{ top: Math.max(0, (size.h - th) * 0.35) }}
        >
          {visible.map((p, i) => (
            <FanTile
              key={`${p.slug}-${Math.round(R)}-${Math.round(tw)}`}
              p={p}
              i={i}
              pos={pos}
              geo={geo}
              active={i === idx}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>

      {/* Commandes */}
      <div className="relative z-[200] mx-auto mt-2 flex w-full max-w-6xl items-center justify-center gap-5">
        <button
          onClick={() => goTo(idx - 1)}
          disabled={idx === 0}
          aria-label="Projet précédent"
          className="liquid-glass grid h-10 w-10 place-items-center rounded-full text-lg transition-opacity disabled:opacity-30"
        >
          ←
        </button>
        <p className="w-28 text-center font-mono text-xs text-cream/60">
          <span className="font-bold text-sky">{pad(idx)}</span> / {pad(n - 1)}
          <span className="mt-1 block text-[10px] opacity-70">
            Défile ou glisse
          </span>
        </p>
        <button
          onClick={() => goTo(idx + 1)}
          disabled={idx === n - 1}
          aria-label="Projet suivant"
          className="liquid-glass grid h-10 w-10 place-items-center rounded-full text-lg transition-opacity disabled:opacity-30"
        >
          →
        </button>
      </div>

      <AnimatePresence>
        {selected && (
          <Detail
            project={projects[selectedIndex]}
            index={selectedIndex}
            onClose={() => setSelected(null)}
            onNavigate={setSelected}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
