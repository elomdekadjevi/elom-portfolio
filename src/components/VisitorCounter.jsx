import { useEffect, useRef, useState } from "react";
import { animate, motion, useReducedMotion } from "framer-motion";

// Taille de la boule
const SIZE = 140;
const REST = 0.32;

// Icône affichée lorsque la boule est réduite
const ICON = "chip";

const ICONS = {
  chip: {
    viewBox: "0 0 24 24",
    sw: 1.7,
    d: [
      "M8 6h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z",
      "M10 10h4v4h-4z",
      "M9 3v3M12 3v3M15 3v3M9 18v3M12 18v3M15 18v3M3 9h3M3 12h3M3 15h3M18 9h3M18 12h3M18 15h3",
    ],
  },

  monogram: {
    viewBox: "6 6 52 52",
    sw: 6.5,
    d: ["M44 14H27A9 9 0 0 0 18 23V41A9 9 0 0 0 27 50H44M18 32H40"],
  },

  wifi: {
    viewBox: "0 0 24 24",
    sw: 1.9,
    d: [
      "M1.5 9a16 16 0 0 1 21 0",
      "M5 12.6a11 11 0 0 1 14 0",
      "M8.6 16.1a6 6 0 0 1 6.8 0",
      "M12 20h.01",
    ],
  },

  code: {
    viewBox: "0 0 24 24",
    sw: 1.9,
    d: ["M8 7l-5 5 5 5", "M16 7l5 5-5 5", "M14 4l-4 16"],
  },
};

const icon = ICONS[ICON] ?? ICONS.chip;

// Position du point vert
const RADIUS = (SIZE * REST) / 2;
const DOT_X = RADIUS + RADIUS * Math.SQRT1_2 - 5;
const DOT_Y = RADIUS - RADIUS * Math.SQRT1_2 - 5;

const ease = [0.22, 1, 0.36, 1];

export default function VisitorCounter({
  className = "left-5 bottom-5 md:left-8 md:bottom-8",
}) {
  const reduce = useReducedMotion();

  const [total, setTotal] = useState(null);
  const [shown, setShown] = useState(0);
  const [open, setOpen] = useState(false);

  const timer = useRef(0);

  // Récupération des visiteurs depuis Vercel Analytics
  useEffect(() => {
    const controller = new AbortController();

    const loadVisitors = async () => {
      try {
        const response = await fetch("/api/visitors", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Erreur API : ${response.status}`);
        }

        const data = await response.json();
        const visitors = Number(data.visitors);

        if (!Number.isFinite(visitors)) {
          throw new Error("Nombre de visiteurs invalide");
        }

        setTotal(visitors);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Erreur VisitorCounter :", error);
        }
      }
    };

    loadVisitors();

    return () => controller.abort();
  }, []);

  // Animation du compteur à chaque ouverture
  useEffect(() => {
    if (total == null) return;

    if (!open || reduce) {
      setShown(total);
      return;
    }

    const animation = animate(0, total, {
      duration: 1.1,
      ease: "easeOut",
      onUpdate: (value) => {
        setShown(Math.round(value));
      },
    });

    return () => animation.stop();
  }, [open, total, reduce]);

  // Nettoyage du timer
  useEffect(() => {
    return () => clearTimeout(timer.current);
  }, []);

  // Interaction tactile
  const touchToggle = () => {
    clearTimeout(timer.current);

    if (open) {
      setOpen(false);
      return;
    }

    setOpen(true);

    timer.current = setTimeout(() => {
      setOpen(false);
    }, 4000);
  };

  // Ne rien afficher si les statistiques ne sont pas disponibles
  if (total == null) return null;

  const digits = String(total).length;

  const fontSize = digits <= 4 ? 34 : digits === 5 ? 28 : 22;

  const spring = reduce
    ? { duration: 0 }
    : {
        type: "spring",
        stiffness: 260,
        damping: 24,
        mass: 0.7,
      };

  return (
    <motion.div
      role="status"
      aria-label={`${total.toLocaleString("fr-FR")} visiteurs sur le site`}
      tabIndex={0}
      initial={reduce ? false : { opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease }}
      onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setOpen(false)}
      onPointerUp={(e) => e.pointerType !== "mouse" && touchToggle()}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      style={{
        width: SIZE * REST,
        height: SIZE * REST,
        transformOrigin: "0% 100%",
      }}
      className={`fixed z-40 cursor-default outline-none ${className}`}
    >
      {/* La boule animée */}
      <motion.div
        animate={reduce ? {} : { y: open ? 0 : [0, -3, 0] }}
        transition={
          open
            ? { duration: 0.2 }
            : {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }
        }
        className="absolute inset-0"
      >
        <motion.div
          className="liquid-glass visitor-orb"
          initial={false}
          animate={{ scale: open ? 1 : REST }}
          transition={spring}
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            width: SIZE,
            height: SIZE,
            borderRadius: 9999,
            transformOrigin: "0% 100%",
            willChange: "transform",
          }}
        >
          {/* Reflet de la bulle */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute"
            style={{
              left: "22%",
              top: "14%",
              width: "26%",
              height: "14%",
              borderRadius: "50%",
              transform: "rotate(-30deg)",
              background:
                "radial-gradient(closest-side, rgb(255 255 255 / 0.85), rgb(255 255 255 / 0))",
            }}
          />

          {/* Icône au repos */}
          <motion.div
            aria-hidden="true"
            initial={false}
            animate={{
              opacity: open ? 0 : 1,
              scale: open ? 0.6 : 1 / REST,
            }}
            transition={spring}
            className="absolute inset-0 grid place-items-center"
          >
            <svg
              viewBox={icon.viewBox}
              width="20"
              height="20"
              fill="none"
              stroke="#fff"
              strokeWidth={icon.sw}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {icon.d.map((d) => (
                <path key={d} d={d} />
              ))}
            </svg>
          </motion.div>

          {/* Nombre de visiteurs */}
          <motion.div
            initial={false}
            animate={{
              opacity: open ? 1 : 0,
              scale: open ? 1 : 0.6,
            }}
            transition={{
              ...spring,
              delay: open && !reduce ? 0.06 : 0,
            }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 text-center [text-shadow:0_1px_10px_rgb(0_0_0/0.45)]"
          >
            <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/75">
              Visiteurs
            </span>

            <strong
              className="font-extrabold leading-none tracking-tight text-white"
              style={{ fontSize }}
            >
              {shown.toLocaleString("fr-FR")}
            </strong>

            <span className="mt-1 flex items-center gap-1.5 text-[11px] text-white/80">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgb(52_211_153)]" />

              {total > 1 ? "visiteurs" : "visiteur"}
            </span>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Point vert de statut */}
      <motion.span
        aria-hidden="true"
        initial={false}
        animate={{ opacity: open ? 0 : 1 }}
        transition={{ duration: 0.2 }}
        className="pointer-events-none absolute z-10 h-2.5 w-2.5"
        style={{
          left: DOT_X,
          top: DOT_Y,
        }}
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/70" />

        <span className="absolute inset-0 rounded-full bg-emerald-400 ring-2 ring-black/30" />
      </motion.span>
    </motion.div>
  );
}
