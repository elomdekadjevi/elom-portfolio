import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { sections } from "../sections";
import { jump } from "../lib/nav";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();

  useMotionValueEvent(scrollYProgress, "change", (v) =>
    setActive(Math.round(v * (sections.length - 1))),
  );
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 40));

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open ? "glass !border-x-0 !border-t-0" : ""
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-10">
        <a
          href="#accueil"
          onClick={jump("accueil")}
          className="flex items-center gap-4"
        >
          <span className="text-2xl font-extrabold italic tracking-tighter">
            ED
          </span>
          <span className="h-6 w-px bg-white/30" />
          <span className="text-[15px] font-medium">Elom DEKADJEVI</span>
        </a>

        <ul className="hidden gap-6 text-sm lg:flex">
          {sections.map(([id, label], i) => (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={jump(id)}
                className={`transition-colors hover:text-sky ${
                  active === i ? "text-sky" : "text-cream/80"
                }`}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <button
          className="lg:hidden"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span className="block h-0.5 w-6 bg-cream" />
          <span className="mt-1.5 block h-0.5 w-6 bg-cream" />
          <span className="mt-1.5 block h-0.5 w-4 bg-cream" />
        </button>
      </nav>

      {open && (
        <ul className="flex flex-col gap-5 px-6 pb-8 pt-2 text-xl lg:hidden">
          {sections.map(([id, label]) => (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={(e) => {
                  jump(id)(e);
                  setOpen(false);
                }}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      )}

      {/* Progression horizontale */}
      <motion.span
        style={{ scaleX: scrollYProgress }}
        className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-sky"
      />
    </header>
  );
}
