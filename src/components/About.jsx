import { useState } from "react";
import { motion } from "framer-motion";

// Fichiers à déposer dans /public :
//   public/about/photo.jpg            → ta photo (portrait, 4:5 idéalement)
//   public/cv/CV-Elom-DEKADJEVI.pdf   → ton CV
const PHOTO = "/about/photo.jpg";
const CV = "/cv/CV-Elom-DEKADJEVI.pdf";

const stats = [
  ["07", "Projets réalisés"],
  ["03", "Domaines : Web, Mobile, IoT"],
  ["L3", "SEIOT · IFRI-UAC"],
];

const reveal = (i = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.65, delay: i * 0.12, ease: "easeOut" },
});

export default function About() {
  const [photoOk, setPhotoOk] = useState(true);

  return (
    <section
      id="apropos"
      className="flex min-h-screen items-center px-6 py-24 md:px-16"
    >
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 md:grid-cols-[0.85fr_1.15fr] md:gap-16">
        {/* Portrait */}
        <motion.div {...reveal(0)} className="relative mx-auto w-full max-w-sm">
          <div className="liquid-glass relative aspect-[4/5] overflow-hidden rounded-[2rem] p-3">
            <div className="relative h-full w-full overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-sky/30 to-ink">
              {photoOk ? (
                <img
                  src={PHOTO}
                  alt="Portrait d'Elom DEKADJEVI"
                  className="h-full w-full object-cover"
                  onError={() => setPhotoOk(false)}
                />
              ) : (
                <div className="grid h-full w-full place-items-center">
                  <span className="text-8xl font-extrabold tracking-tight text-cream/25">
                    ED
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
            </div>
          </div>

          <motion.span
            {...reveal(2)}
            className="liquid-glass absolute -right-3 top-10 rounded-full px-4 py-2 text-xs font-semibold md:-right-8"
          >
            📍 Cotonou, Bénin
          </motion.span>
          <motion.span
            {...reveal(3)}
            className="liquid-glass absolute -left-3 bottom-12 rounded-full px-4 py-2 text-xs font-semibold md:-left-8"
          >
            🎓 IFRI-UAC
          </motion.span>
        </motion.div>

        {/* Texte */}
        <div>
          <motion.p
            {...reveal(0)}
            className="font-mono text-xs uppercase tracking-widest text-sky"
          >
            À propos
          </motion.p>
          <motion.h2
            {...reveal(1)}
            className="mt-2 text-4xl font-extrabold leading-[1.05] md:text-6xl"
          >
            Du capteur à l'écran.
          </motion.h2>

          <motion.p
            {...reveal(2)}
            className="mt-6 max-w-prose text-lg leading-relaxed text-cream/85"
          >
            Étudiant en licence 3 Systèmes Embarqués et IoT à l'IFRI-UAC, je
            fonde <span className="font-semibold text-sky">E-Digit</span>, un
            studio qui réalise des solutions web, mobile et IoT depuis Cotonou.
          </motion.p>
          <motion.p
            {...reveal(3)}
            className="mt-4 max-w-prose leading-relaxed text-cream/70"
          >
            Je travaille aussi bien sur le backend (Laravel) que sur le frontend
            (React, React Native), et j'aime relier le matériel au logiciel : de
            l'ESP32 et des circuits de relais jusqu'aux applications web et
            mobiles. Pendant mon stage chez DA Digit All, j'ai proposé et dirigé
            mon propre projet.
          </motion.p>

          <motion.ul
            {...reveal(4)}
            className="mt-8 grid max-w-xl grid-cols-3 gap-3"
          >
            {stats.map(([value, label]) => (
              <li key={label} className="liquid-glass rounded-2xl px-4 py-4">
                <p className="text-3xl font-extrabold text-sky md:text-4xl">
                  {value}
                </p>
                <p className="mt-1 text-[11px] leading-snug text-cream/70 md:text-xs">
                  {label}
                </p>
              </li>
            ))}
          </motion.ul>

          <motion.div {...reveal(5)} className="mt-9 flex flex-wrap gap-4">
            <a
              href={CV}
              download
              className="rounded-full bg-sky px-7 py-3 font-semibold text-ink transition hover:bg-cream"
            >
              Télécharger mon CV ↓
            </a>
            <a
              href="#contact"
              className="liquid-glass rounded-full px-7 py-3 font-semibold transition hover:bg-cream/15"
            >
              Me contacter
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
