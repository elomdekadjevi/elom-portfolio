import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { sections } from "../sections";

export default function VideoBackground() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  // La vidéo s'assombrit et se floute pendant le passage du hero à la 2e section
  const step = 1 / (sections.length - 1);
  const veil = useTransform(scrollYProgress, [0, step], [0, 0.72]);
  const blur = useTransform(
    scrollYProgress,
    [0, step],
    ["blur(0px)", "blur(10px)"],
  );

  return (
    <div className="fixed inset-0 -z-10 bg-ink" aria-hidden="true">
      {reduce ? (
        <img
          src="/videos/hero-poster.jpg"
          alt=""
          className="h-full w-full object-cover"
        />
      ) : (
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/videos/hero-poster.jpg"
        >
          <source src="/videos/hero-loop.webm" type="video/webm" />
          <source src="/videos/hero-loop.mp4" type="video/mp4" />
        </video>
      )}
      <motion.div
        className="absolute inset-0"
        style={{ backdropFilter: blur, WebkitBackdropFilter: blur }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/60 to-ink/10" />
      <motion.div
        className="absolute inset-0 bg-ink"
        style={{ opacity: veil }}
      />
    </div>
  );
}
