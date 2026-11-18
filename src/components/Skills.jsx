import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { projects } from "../data/projects";

// À modifier librement : nom, phrase d'accroche, compétences, et le filtre de projets lié.
const families = [
  {
    name: "IoT & Embarqué",
    tag: "IoT",
    intro:
      "Relier le monde physique au numérique : capteurs, microcontrôleurs et supervision.",
    skills: [
      "ESP32",
      "Arduino",
      "C/C++",
      "Capteurs ultrasoniques",
      "RFID",
      "Relais",
      "LabVIEW · SCADA",
    ],
  },
  {
    name: "Web",
    tag: "Web",
    intro:
      "Des applications fiables, du serveur à l'interface, pensées pour tous les écrans.",
    skills: [
      "Laravel",
      "PHP",
      "MySQL",
      "React",
      "Vite",
      "JavaScript",
      "CSS responsive",
      "JWT",
      "QR Code",
    ],
  },
  {
    name: "Mobile",
    tag: "Mobile",
    intro:
      "Des applications mobiles fluides, construites avec une seule base de code.",
    skills: ["React Native", "Expo", "Node.js"],
  },
  {
    name: "IA & Cybersécurité",
    tag: "IA",
    intro:
      "Rendre les systèmes plus intelligents et protéger leurs communications.",
    skills: [
      "AI / ML",
      "Sécurité des communications IoT",
      "False Data Injection",
      "Attaque / défense",
    ],
  },
];

const pad = (n) => String(n + 1).padStart(2, "0");

export default function Skills() {
  const [active, setActive] = useState(0);
  const f = families[active];
  const related = projects.filter((p) => p.tags.includes(f.tag));

  return (
    <section
      id="competences"
      className="flex min-h-screen items-center px-6 py-24 md:px-16"
    >
      <div className="mx-auto w-full max-w-6xl">
        <p className="font-mono text-xs uppercase tracking-widest text-sky">
          Compétences
        </p>
        <h2 className="mt-2 text-4xl font-extrabold leading-[1.05] md:text-6xl">
          Ce que je maîtrise.
        </h2>

        <div className="mt-12 grid gap-10 md:grid-cols-[0.85fr_1.15fr] md:gap-16">
          {/* Familles */}
          <ul
            className="border-t border-cream/10"
            role="tablist"
            aria-label="Familles de compétences"
          >
            {families.map((fam, i) => {
              const on = i === active;
              return (
                <li key={fam.name} className="border-b border-cream/10">
                  <button
                    role="tab"
                    aria-selected={on}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    className="group relative flex w-full items-baseline gap-4 py-5 text-left md:py-6"
                  >
                    <span className="w-6 font-mono text-xs text-sky">
                      {pad(i)}
                    </span>
                    <motion.span
                      animate={{ x: on ? 12 : 0, opacity: on ? 1 : 0.4 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 26,
                      }}
                      className="text-2xl font-extrabold tracking-tight md:text-4xl"
                    >
                      {fam.name}
                    </motion.span>
                    <motion.span
                      aria-hidden="true"
                      animate={{ opacity: on ? 1 : 0, x: on ? 0 : -8 }}
                      className="ml-auto text-xl text-sky"
                    >
                      →
                    </motion.span>
                    {on && (
                      <motion.span
                        layoutId="skill-line"
                        className="absolute inset-x-0 -bottom-px h-px bg-sky"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 34,
                        }}
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Détail de la famille */}
          <div className="liquid-glass relative min-h-[22rem] overflow-hidden rounded-[2rem] p-7 md:p-10">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={f.name}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.28 }}
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-4 -top-10 select-none text-[11rem] font-extrabold leading-none text-cream/[0.05]"
                >
                  {pad(active)}
                </span>

                <h3 className="relative text-2xl font-extrabold md:text-3xl">
                  {f.name}
                </h3>
                <p className="relative mt-3 max-w-md leading-relaxed text-cream/75">
                  {f.intro}
                </p>

                <ul className="relative mt-8 flex flex-wrap gap-3">
                  {f.skills.map((s, i) => (
                    <motion.li
                      key={s}
                      initial={{ opacity: 0, y: 14, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        delay: 0.06 * i,
                        type: "spring",
                        stiffness: 320,
                        damping: 22,
                      }}
                      whileHover={{ y: -3, scale: 1.05 }}
                      className="flex items-center gap-2 rounded-full border border-cream/20 bg-cream/10 px-4 py-2 text-sm font-semibold"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-sky" />
                      {s}
                    </motion.li>
                  ))}
                </ul>

                {related.length > 0 && (
                  <p className="relative mt-8 text-xs text-cream/55">
                    <span className="uppercase tracking-widest">
                      Mis en pratique dans
                    </span>
                    <span className="mt-1 block text-sm text-cream/80">
                      {related.map((p) => p.name).join(" · ")}
                    </span>
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
