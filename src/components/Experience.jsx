import { motion, useReducedMotion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1];

// ✏️ Une entrée = une carte de la timeline (la plus récente en premier)
const items = [
  {
    period: "Période à renseigner",
    current: true,
    title: "Fondateur & développeur",
    place: "E-Digit · Cotonou",
    desc: "Studio digital proposant des solutions web, mobile et IoT : conception et développement sur mesure.",
    tags: ["Web", "Mobile", "IoT"],
  },
  {
    period: "Période à renseigner",
    title: "Stage — application de gestion de caisse",
    place: "GreenPay & DA DIGIT ALL",
    desc: "Application de gestion de caisse menu dépense : demandes des employés, validation par le manager, preuves de dépense et rapports hebdomadaires et mensuels.",
    tags: ["Gestion de caisse", "Rapports", "Travail en binôme"],
  },
  {
    period: "En cours · L3",
    title: "Licence SEIOT — Systèmes Embarqués & IoT",
    place: "IFRI-UAC · Université d’Abomey-Calavi",
    desc: "Formation en systèmes embarqués et objets connectés, avec des projets pratiques sur ESP32, Arduino, FPGA et supervision SCADA.",
    tags: ["Systèmes embarqués", "IoT", "VHDL / FPGA", "Cybersécurité ICS"],
  },
];

export default function Experience() {
  const reduce = useReducedMotion();
  const reveal = (i) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, x: 40, filter: "blur(6px)" },
          whileInView: { opacity: 1, x: 0, filter: "blur(0px)" },
          viewport: { once: true, amount: 0.2 },
          transition: { duration: 0.8, delay: 0.1 + i * 0.15, ease },
        };

  return (
    <section
      id="experience"
      className="flex min-h-full items-center px-6 pb-12 pt-24 md:px-10"
    >
      <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)] lg:gap-16">
        {/* Titre */}
        <motion.div {...reveal(0)} className="self-center">
          <h2 className="text-[clamp(2.5rem,min(6vw,10vh),5rem)] font-extrabold leading-[1] tracking-[-0.03em] text-white">
            Mon{" "}
            <span className="inline-block bg-gradient-to-r from-white to-sky bg-clip-text pr-[0.1em] italic text-transparent">
              parcours
            </span>
          </h2>
          <span className="mt-4 block h-[2px] w-40 bg-gradient-to-r from-white to-transparent" />
          <p className="mt-5 max-w-sm text-base leading-relaxed text-white/80 md:text-lg">
            Entre formation, entrepreneuriat et projets concrets : de la carte
            électronique à l’application.
          </p>
        </motion.div>

        {/* Timeline */}
        <ol className="relative space-y-5 border-l border-white/15 pl-8">
          {items.map((it, i) => (
            <motion.li key={it.title} {...reveal(i + 1)} className="relative">
              <span className="absolute -left-[2.4rem] top-7 h-3 w-3 rounded-full bg-sky ring-4 ring-sky/20" />
              <article className="glass rounded-2xl p-5 transition hover:bg-white/10 md:p-6">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                  <span className="font-medium text-sky">{it.period}</span>
                  {it.current && (
                    <span className="flex items-center gap-2 text-white/70">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgb(52_211_153)]" />
                      En cours
                    </span>
                  )}
                </div>
                <h3 className="mt-2 text-xl font-semibold text-white">
                  {it.title}
                </h3>
                <p className="text-sm text-gold">{it.place}</p>
                <p className="mt-3 text-[15px] leading-relaxed text-white/80">
                  {it.desc}
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {it.tags.map((t) => (
                    <li
                      key={t}
                      className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/80"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </article>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
