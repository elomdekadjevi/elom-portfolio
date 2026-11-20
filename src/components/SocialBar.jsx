import { useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";

const cls = "h-5 w-5";

const socials = [
  {
    label: "GitHub",
    color: "#181717",
    href: "https://github.com/elomdekadjevi",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={cls}>
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    color: "#0A66C2",
    href: "https://www.linkedin.com/in/elom-dekadjevi-691897411/",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={cls}>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    color: "#25D366",
    href: "https://wa.me/2290142084196",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={cls}>
        <path d="M20.52 3.48A11.87 11.87 0 0 0 12.04 0C5.46 0 .1 5.35.1 11.93c0 2.1.55 4.15 1.6 5.95L0 24l6.27-1.64a11.9 11.9 0 0 0 5.76 1.47h.01c6.58 0 11.94-5.35 11.94-11.93 0-3.19-1.24-6.19-3.46-8.42ZM12.04 21.8h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.72.97.99-3.63-.24-.37a9.85 9.85 0 0 1-1.51-5.25c0-5.48 4.46-9.94 9.95-9.94 2.66 0 5.16 1.04 7.04 2.92a9.88 9.88 0 0 1 2.91 7.04c0 5.48-4.46 9.94-9.94 9.94Zm5.45-7.44c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.46-.89-.79-1.49-1.77-1.67-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.21 5.09 4.5.71.31 1.27.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z" />
      </svg>
    ),
  },
  {
    label: "Email",
    color: "#EA4335",
    href: "mailto:pierredekadjevi@gmail.com",
    svg: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cls}
      >
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    ),
  },
];

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lensSpring = { stiffness: 420, damping: 30, mass: 0.7 };

/**
 * Barre sociale façon barre de tâches de WhatsApp sur iOS 27 :
 * - une lentille de verre claire suit le pointeur d'icône en icône (aucune zone morte),
 *   avec une légère attraction magnétique, s'étire dans son déplacement et « pop » à l'apparition ;
 * - sous l'icône survolée, un disque pâle teinté de la couleur de la marque est dessiné
 *   (couche séparée, sous l'icône) ; l'icône prend la couleur pleine de son réseau ;
 * - quand on appuie, la lentille grossit, l'icône s'agrandit et des franges colorées apparaissent ;
 * - un libellé en verre sort à gauche de l'icône survolée.
 */
export default function SocialBar() {
  const reduce = useReducedMotion();
  const boxRef = useRef(null);
  const linkRefs = useRef([]);
  const activeRef = useRef(null);
  const [active, setActive] = useState(null);
  const [pressed, setPressed] = useState(false);

  const lensY = useSpring(0, lensSpring);
  const lensX = useSpring(0, lensSpring);
  const lensOpacity = useSpring(0, { stiffness: 300, damping: 26 });
  const press = useSpring(0, { stiffness: 420, damping: 24 });
  const vy = useVelocity(lensY);
  const appear = useTransform(lensOpacity, [0, 1], [reduce ? 1 : 0.72, 1]);
  const stretch = (v) => (reduce ? 0 : Math.min(Math.abs(v) / 2600, 0.4));
  const squash = (v) => (reduce ? 0 : Math.min(Math.abs(v) / 9000, 0.12));
  const scaleY = useTransform(
    [vy, press, appear],
    ([v, p, a]) => (1 + stretch(v)) * (1 + 0.12 * p) * a,
  );
  const scaleX = useTransform(
    [vy, press, appear],
    ([v, p, a]) => (1 - squash(v)) * (1 + 0.12 * p) * a,
  );

  const moveLens = (index, y, x = 0) => {
    // si la lentille est invisible, elle apparaît sur l'icône au lieu de glisser depuis l'ancienne
    if (lensOpacity.get() < 0.05) {
      lensY.jump(y);
      lensX.jump(x);
    } else {
      lensY.set(y);
      lensX.set(x);
    }
    lensOpacity.set(1);
    if (activeRef.current !== index) {
      activeRef.current = index;
      setActive(index);
    }
  };

  // Suit le pointeur sur toute la barre : l'icône la plus proche est toujours sélectionnée
  const handleMove = (e) => {
    const box = boxRef.current?.getBoundingClientRect();
    if (!box) return;
    const py = e.clientY - box.top;
    const px = e.clientX - box.left;
    let best = 0;
    let dist = Infinity;
    linkRefs.current.forEach((el, i) => {
      const d = Math.abs(py - (el.offsetTop + el.offsetHeight / 2));
      if (d < dist) {
        dist = d;
        best = i;
      }
    });
    const el = linkRefs.current[best];
    const cy = el.offsetTop + el.offsetHeight / 2;
    const cx = el.offsetLeft + el.offsetWidth / 2;
    // attraction magnétique : la lentille se décale très légèrement vers le pointeur
    moveLens(
      best,
      el.offsetTop + clamp((py - cy) * 0.18, -5, 5),
      clamp((px - cx) * 0.18, -4, 4),
    );
  };

  const release = () => {
    setPressed(false);
    press.set(0);
  };

  const handleLeave = () => {
    lensOpacity.set(0);
    activeRef.current = null;
    setActive(null);
    release();
  };

  const handleDown = () => {
    setPressed(true);
    press.set(1);
    // le relâchement peut avoir lieu hors de la barre
    window.addEventListener("pointerup", release, { once: true });
    window.addEventListener("pointercancel", release, { once: true });
  };

  return (
    <aside
      aria-label="Réseaux sociaux"
      className="pointer-events-none fixed inset-y-0 right-5 z-40 hidden items-center md:flex"
    >
      <div
        ref={boxRef}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        onBlur={(e) => {
          if (!boxRef.current?.contains(e.relatedTarget)) handleLeave();
        }}
        className="pointer-events-auto relative flex flex-col items-center gap-1 rounded-full p-2"
      >
        {/* le verre de la barre (frère de la lentille : elle le réfracte) */}
        <div
          aria-hidden="true"
          className="liquid-glass absolute inset-0 rounded-full"
        />

        {socials.map(({ label, href, svg, color }, index) => {
          const external = href.startsWith("http");
          const lit = active === index;
          return (
            <a
              key={label}
              ref={(el) => (linkRefs.current[index] = el)}
              href={href}
              aria-label={label}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              onFocus={(e) => moveLens(index, e.currentTarget.offsetTop)}
              onPointerDown={handleDown}
              className="relative z-10 grid h-11 w-11 place-items-center rounded-full outline-none"
            >
              {/* disque pâle teinté de la couleur de la marque, sous l'icône */}
              <motion.span
                aria-hidden="true"
                initial={false}
                animate={{
                  opacity: lit ? 1 : 0,
                  scale: lit ? (pressed ? 1.12 : 1) : 0.85,
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                style={{
                  background: `color-mix(in srgb, ${color} 18%, white)`,
                }}
                className="absolute inset-0 rounded-full"
              />

              {/* l'icône prend la couleur pleine de la marque au survol */}
              <motion.span
                animate={{ scale: lit ? (pressed ? 1.28 : 1.12) : 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 28 }}
                style={{ color: lit ? color : undefined }}
                className="relative text-cream/75 transition-colors duration-200"
              >
                {svg}
              </motion.span>

              {/* libellé en verre, propre à chaque icône : sa largeur ne saute jamais */}
              <motion.span
                aria-hidden="true"
                initial={false}
                animate={{ opacity: lit ? 1 : 0, x: lit ? 0 : 12 }}
                transition={{ type: "spring", stiffness: 420, damping: 30 }}
                className="liquid-glass pointer-events-none absolute right-full top-0 mr-4 flex h-11 items-center whitespace-nowrap rounded-full px-5 text-sm font-semibold text-cream"
              >
                {label}
              </motion.span>
            </a>
          );
        })}

        {/* la lentille de verre claire, au-dessus des icônes */}
        <motion.div
          aria-hidden="true"
          data-pressed={pressed}
          data-lg-dispersion=""
          className="liquid-lens liquid-lens--clear pointer-events-none absolute left-2 top-0 z-20 h-11 w-11 rounded-full"
          style={{ x: lensX, y: lensY, opacity: lensOpacity, scaleX, scaleY }}
        />
      </div>
    </aside>
  );
}
