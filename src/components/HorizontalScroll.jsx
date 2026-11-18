import { Children } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

export default function HorizontalScroll({ children }) {
  const slides = Children.toArray(children);
  const n = slides.length;
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 24,
    mass: 0.4,
  });
  const x = useTransform(
    reduce ? scrollYProgress : smooth,
    [0, 1],
    ["0vw", `-${(n - 1) * 100}vw`],
  );

  return (
    // La hauteur crée la "distance" de scroll vertical, convertie en déplacement horizontal
    <div className="relative" style={{ height: `${n * 100}vh` }}>
      {/* Points d'arrêt : un par section */}
      {slides.map((_, i) => (
        <div
          key={i}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 h-px w-px snap-start"
          style={{ top: `${i * 100}vh` }}
        />
      ))}

      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div
          className="flex h-full"
          style={{ x, width: `${n * 100}vw` }}
        >
          {slides.map((slide, i) => (
            <div
              key={i}
              className="no-scrollbar h-full w-screen shrink-0 overflow-y-auto overflow-x-hidden"
            >
              {slide}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
