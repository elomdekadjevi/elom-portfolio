import { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";

/* ───────────── Carte électronique (maquette IoT) ───────────── */
export function BoardCard({ width, w, project }) {
  const W = width ?? w ?? 160;
  const uid = useId().replace(/:/g, "");
  const reduce = useReducedMotion();
  const h = W * 0.74;
  const photo = project.maquetteCover;
  const tags = (project.hardware ?? ["ESP32"]).slice(0, 2).join(" · ");

  const blink = (delay = 0) =>
    reduce
      ? {}
      : {
          animate: { opacity: [0.2, 1, 0.2] },
          transition: { duration: 1.6, repeat: Infinity, delay },
        };
  const flow = (delay = 0) =>
    reduce
      ? {}
      : {
          animate: { strokeDashoffset: [0, -24] },
          transition: {
            duration: 1.6,
            repeat: Infinity,
            ease: "linear",
            delay,
          },
        };
  const pins = [50, 70, 90, 110, 130, 150];

  return (
    <motion.div
      animate={reduce ? {} : { y: [0, -4, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      style={{ width: W, height: h }}
      className="relative"
    >
      {/* ondes : la carte envoie ses mesures vers l'écran */}
      <svg
        viewBox="0 0 40 22"
        className="absolute -top-6 left-1/2 w-9 -translate-x-1/2 overflow-visible"
        fill="none"
        stroke="var(--color-sky)"
        strokeWidth="2"
        strokeLinecap="round"
      >
        {[
          "M16 18A5 5 0 0 1 24 18",
          "M10 17A11 11 0 0 1 30 17",
          "M4 16A18 18 0 0 1 36 16",
        ].map((d, i) => (
          <motion.path key={d} d={d} {...blink(i * 0.25)} />
        ))}
        <circle cx="20" cy="20" r="1.8" fill="var(--color-sky)" stroke="none" />
      </svg>

      {photo ? (
        <div className="relative h-full w-full overflow-hidden rounded-2xl border border-cream/30 shadow-2xl shadow-black/60">
          <img
            src={photo}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-white/10" />
          <span className="absolute left-2 top-2 rounded-full bg-ink/70 px-2 py-0.5 text-[9px] uppercase tracking-widest text-sky">
            Maquette
          </span>
        </div>
      ) : (
        <svg
          viewBox="0 0 200 148"
          className="h-full w-full overflow-visible drop-shadow-[0_18px_28px_rgb(0_0_0/0.55)]"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={`pcb${uid}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#1c3270" />
              <stop offset="1" stopColor="#0a1230" />
            </linearGradient>
            <linearGradient id={`metal${uid}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#f1f4fb" />
              <stop offset="1" stopColor="#8e9bb9" />
            </linearGradient>
            <linearGradient id={`rim${uid}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#fff" stopOpacity="0.9" />
              <stop offset="0.4" stopColor="#fff" stopOpacity="0.12" />
              <stop offset="0.7" stopColor="#fff" stopOpacity="0.1" />
              <stop offset="1" stopColor="#fff" stopOpacity="0.7" />
            </linearGradient>
            <linearGradient id={`sheen${uid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fff" stopOpacity="0.28" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            <filter
              id={`blur${uid}`}
              x="-100%"
              y="-100%"
              width="300%"
              height="300%"
            >
              <feGaussianBlur stdDeviation="3" />
            </filter>
            <clipPath id={`clip${uid}`}>
              <rect x="2" y="2" width="196" height="144" rx="14" />
            </clipPath>
          </defs>

          <rect
            x="2"
            y="2"
            width="196"
            height="144"
            rx="14"
            fill={`url(#pcb${uid})`}
          />

          <g clipPath={`url(#clip${uid})`}>
            {/* pistes + flux de données */}
            {pins.map((x, i) => (
              <g key={x} fill="none" strokeLinecap="round">
                <path
                  d={`M${x} 16V40`}
                  stroke="var(--color-sky)"
                  strokeOpacity="0.45"
                  strokeWidth="1.4"
                />
                <path
                  d={`M${x} 132V108`}
                  stroke="var(--color-sky)"
                  strokeOpacity="0.45"
                  strokeWidth="1.4"
                />
                <motion.path
                  d={`M${x} 16V40`}
                  stroke="#fff"
                  strokeWidth="1.4"
                  strokeDasharray="3 9"
                  {...flow(i * 0.15)}
                />
                <motion.path
                  d={`M${x} 132V108`}
                  stroke="#fff"
                  strokeWidth="1.4"
                  strokeDasharray="3 9"
                  {...flow(i * 0.15 + 0.4)}
                />
              </g>
            ))}

            {/* connecteurs */}
            {pins.map((x) => (
              <g key={`p${x}`} fill="#f4c77b">
                <rect x={x - 2.5} y="7" width="5" height="9" rx="1.2" />
                <rect x={x - 2.5} y="132" width="5" height="9" rx="1.2" />
              </g>
            ))}

            {/* trous de fixation */}
            {[
              [14, 14],
              [186, 14],
              [14, 134],
              [186, 134],
            ].map(([cx, cy]) => (
              <circle
                key={`${cx}${cy}`}
                cx={cx}
                cy={cy}
                r="4"
                fill="#050a1c"
                stroke="#f4c77b"
                strokeOpacity="0.7"
                strokeWidth="1.4"
              />
            ))}

            {/* USB */}
            <rect x="6" y="62" width="16" height="24" rx="4" fill="#b9c3da" />
            <rect x="9" y="68" width="10" height="12" rx="2" fill="#28325a" />

            {/* module ESP32 : antenne + blindage */}
            <rect x="62" y="40" width="76" height="14" fill="#0b1633" />
            <path
              d="M68 47h6v-4h6v8h6v-8h6v8h6v-8h6v8h6v-8h6v8h6v-8h6v8h6"
              fill="none"
              stroke="var(--color-sky)"
              strokeWidth="1.3"
              strokeLinejoin="round"
            />
            <rect
              x="62"
              y="54"
              width="76"
              height="52"
              rx="3"
              fill={`url(#metal${uid})`}
            />
            <rect
              x="68"
              y="60"
              width="64"
              height="40"
              rx="2"
              fill="none"
              stroke="#5b6785"
              strokeOpacity="0.6"
            />
            <text
              x="100"
              y="82"
              textAnchor="middle"
              fontFamily="monospace"
              fontSize="11"
              fontWeight="800"
              fill="#1b2750"
            >
              ESP32
            </text>
            <text
              x="100"
              y="94"
              textAnchor="middle"
              fontFamily="monospace"
              fontSize="5"
              fill="#3b4670"
            >
              WROOM-32
            </text>

            {/* LED : alimentation et données */}
            <circle
              cx="172"
              cy="66"
              r="6"
              fill="#34d399"
              opacity="0.2"
              filter={`url(#blur${uid})`}
            />
            <motion.circle
              cx="172"
              cy="66"
              r="3.2"
              fill="#34d399"
              {...blink(0)}
            />
            <circle
              cx="172"
              cy="80"
              r="6"
              fill="#7ba7ff"
              opacity="0.2"
              filter={`url(#blur${uid})`}
            />
            <motion.circle
              cx="172"
              cy="80"
              r="3.2"
              fill="#7ba7ff"
              {...blink(0.5)}
            />

            {/* reflet de verre */}
            <ellipse
              cx="100"
              cy="-4"
              rx="140"
              ry="52"
              fill={`url(#sheen${uid})`}
            />
          </g>

          <rect
            x="2.8"
            y="2.8"
            width="194.4"
            height="142.4"
            rx="13.2"
            fill="none"
            stroke={`url(#rim${uid})`}
            strokeWidth="1.6"
          />
        </svg>
      )}

      <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-cream/25 bg-ink/80 px-3 py-0.5 text-[10px] text-cream/80 backdrop-blur">
        {tags}
      </span>
    </motion.div>
  );
}
