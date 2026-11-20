import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import VisitorCounter from "./VisitorCounter";
const ease = [0.22, 1, 0.36, 1];

// ✏️ À remplacer par tes vraies coordonnées
const CONTACT = {
  email: "pierredekadjevi@email.com",
  whatsapp: "2290142084196", // format international, sans + ni espaces
  whatsappLabel: "+229 0142084196",
  place: "Cotonou, Bénin",
};

// ✏️ formspree.io → New form → copie l’identifiant du formulaire (ex : xyzabcde)
const FORMSPREE_ID = "xeagklvo";

const ic = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

const rows = [
  {
    label: "Email",
    value: CONTACT.email,
    href: `mailto:${CONTACT.email}`,
    icon: (
      <svg viewBox="0 0 24 24" {...ic} className="h-5 w-5">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    value: CONTACT.whatsappLabel,
    href: `https://wa.me/${CONTACT.whatsapp}`,
    icon: (
      <svg viewBox="0 0 24 24" {...ic} className="h-5 w-5">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
  {
    label: "Localisation",
    value: CONTACT.place,
    icon: (
      <svg viewBox="0 0 24 24" {...ic} className="h-5 w-5">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
];

const field =
  "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-[15px] text-white placeholder:text-white/40 outline-none transition focus:border-sky focus:bg-white/10";

export default function Contact() {
  const reduce = useReducedMotion();
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  const reveal = (i) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, x: 40, filter: "blur(6px)" },
          whileInView: { opacity: 1, x: 0, filter: "blur(0px)" },
          viewport: { once: true, amount: 0.2 },
          transition: { duration: 0.8, delay: 0.1 + i * 0.15, ease },
        };

  async function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      if (res.ok) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section
      id="contact"
      className="flex min-h-full items-center px-6 pb-12 pt-24 md:px-10"
    >
      <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Texte + coordonnées */}
        <motion.div {...reveal(0)} className="self-center">
          <h2 className="text-[clamp(2.5rem,min(6vw,10vh),5rem)] font-extrabold leading-[1] tracking-[-0.03em] text-white">
            Travaillons
            <br />
            <span className="inline-block bg-gradient-to-r from-white to-sky bg-clip-text pr-[0.1em] italic text-transparent">
              ensemble
            </span>
          </h2>
          <span className="mt-4 block h-[2px] w-40 bg-gradient-to-r from-white to-transparent" />
          <p className="mt-5 max-w-md text-base leading-relaxed text-white/80 md:text-lg">
            Un projet IoT, une application web ou mobile ? Écris-moi, je te
            réponds dès que possible.
          </p>
         
          <ul className="mt-8 space-y-4">
            {rows.map(({ label, value, href, icon }) => {
              const body = (
                <>
                  <span className="liquid-glass grid h-11 w-11 shrink-0 place-items-center rounded-full text-gold">
                    {icon}
                  </span>
                  <span>
                    <span className="block text-xs text-white/60">{label}</span>
                    <span className="block text-[15px] font-medium text-white">
                      {value}
                    </span>
                  </span>
                </>
              );
              return (
                <li key={label}>
                  {href ? (
                    <a
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 transition hover:translate-x-1"
                    >
                      {body}
                    </a>
                  ) : (
                    <div className="flex items-center gap-4">{body}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </motion.div>

        {/* Formulaire */}
        <motion.form
          {...reveal(1)}
          onSubmit={onSubmit}
          className="liquid-glass space-y-4 rounded-3xl p-6 md:p-8"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm text-white/70">
              Nom
              <input
                name="name"
                required
                autoComplete="name"
                placeholder="Ton nom"
                className={`${field} mt-1.5`}
              />
            </label>
            <label className="block text-sm text-white/70">
              Email
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="toi@exemple.com"
                className={`${field} mt-1.5`}
              />
            </label>
          </div>
          <label className="block text-sm text-white/70">
            Message
            <textarea
              name="message"
              required
              rows={5}
              placeholder="Parle-moi de ton projet…"
              className={`${field} mt-1.5 resize-none`}
            />
          </label>

          {/* Anti-spam (invisible) */}
          <input
            type="text"
            name="_gotcha"
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
          />

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={status === "sending"}
              className="inline-flex items-center gap-4 rounded-full bg-white py-2 pl-6 pr-2 text-sm font-semibold text-[#1b2a6b] transition hover:bg-cream disabled:opacity-60"
            >
              {status === "sending" ? "Envoi…" : "Envoyer le message"}
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[#2f55e8] text-white">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </button>

            <p role="status" className="text-sm">
              {status === "sent" && (
                <span className="text-emerald-300">
                  Message envoyé, merci !
                </span>
              )}
              {status === "error" && (
                <span className="text-rose">
                  Échec de l’envoi. Réessaie ou écris-moi directement par email.
                </span>
              )}
            </p>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
