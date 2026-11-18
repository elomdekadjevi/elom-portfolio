import { motion, useReducedMotion } from 'framer-motion'
import { jump } from '../lib/nav'

const ease = [0.22, 1, 0.36, 1]

const soft = {
  hidden: { opacity: 0, y: 14, filter: 'blur(8px)' },
  show: (i) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 1, delay: 0.15 + i * 0.14, ease },
  }),
}

const roles = ['IoT Engineer', 'Full Stack Developer', 'Innovator']

const iconCls = 'h-7 w-7 text-[#f2a93b]'
const stats = [
  {
    value: '+5',
    label: 'Projets réalisés',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={iconCls}>
        <rect x="6" y="6" width="12" height="12" rx="2" />
        <rect x="9.5" y="9.5" width="5" height="5" rx="1" />
        <path d="M9 3v3M12 3v3M15 3v3M9 18v3M12 18v3M15 18v3M3 9h3M3 12h3M3 15h3M18 9h3M18 12h3M18 15h3" />
      </svg>
    ),
  },
  {
    value: 'L3',
    label: 'En cours',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" className={iconCls}>
        <path d="M2 9l10-5 10 5-10 5L2 9z" />
        <path d="M6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5" />
        <path d="M22 9v6" />
      </svg>
    ),
  },
  {
    value: '+6',
    label: 'Certifications',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" className={iconCls}>
        <circle cx="12" cy="9" r="6" />
        <path d="M12 6.5l1.1 2.3 2.4.3-1.8 1.7.5 2.5-2.2-1.2-2.2 1.2.5-2.5-1.8-1.7 2.4-.3L12 6.5z" />
        <path d="M8.5 14l-1.5 7 5-2.5 5 2.5-1.5-7" />
      </svg>
    ),
  },
]

export default function Hero() {
  const reduce = useReducedMotion()
  const a = { variants: soft, initial: reduce ? false : 'hidden', animate: 'show' }

  return (
    <section
      id="accueil"
      className="relative flex min-h-full items-center px-6 pb-12 pt-24 md:px-10"
    >
      <div className="mx-auto w-full max-w-7xl">
        {/* Badge */}
        <motion.div
          {...a}
          custom={0}
          className="glass mb-5 inline-flex max-w-full flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl px-4 py-2 text-[13px] font-medium text-white/90 sm:rounded-full"
        >
          <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_10px_rgb(52_211_153)]" />
          {roles.map((role, i) => (
            <span key={role} className="flex items-center gap-3">
              {i > 0 && <span aria-hidden="true" className="text-white/40">•</span>}
              <span className="whitespace-nowrap">{role}</span>
            </span>
          ))}
        </motion.div>

        {/* Nom : la taille suit aussi la hauteur de l'écran */}
        <motion.h1
          {...a}
          custom={1}
          className="text-[clamp(3rem,min(9vw,14vh),7.5rem)] font-extrabold leading-[0.95] tracking-[-0.03em] text-white"
        >
          Elom
          <br />
          <span className="inline-block bg-gradient-to-r from-white via-white to-sky bg-clip-text pr-[0.12em] italic text-transparent">
            DEKADJEVI
          </span>
        </motion.h1>

        <motion.span
          {...a}
          custom={2}
          className="mt-3 block h-[2px] w-[min(100%,34rem)] bg-gradient-to-r from-white to-transparent"
        />

        {/* Accroche */}
        <motion.p
          {...a}
          custom={3}
          className="mt-5 text-[clamp(1.5rem,min(3.2vw,5vh),2.4rem)] font-semibold leading-tight text-white"
        >
          Bridging the <em className="font-semibold text-gold">Physical</em> and{' '}
          <em className="font-semibold text-sky">Digital</em> Worlds.
        </motion.p>

        <motion.p {...a} custom={4} className="mt-4 max-w-md text-base leading-relaxed text-white/80 md:text-lg">
          Je conçois des solutions intelligentes en IoT, développe des applications innovantes et
          explore les technologies de demain.
        </motion.p>

        {/* Chiffres clés — liquid glass, à la place des boutons */}
        <motion.div
          {...a}
          custom={5}
          className="liquid-glass mt-8 inline-grid max-w-full grid-cols-3 divide-x divide-white/20 rounded-2xl px-2 py-4"
        >
          {stats.map(({ value, label, icon }) => (
            <div key={label} className="relative flex items-center gap-3 px-4 md:px-6">
              <span className="hidden sm:block">{icon}</span>
              <div className="[text-shadow:0_1px_8px_rgb(0_0_0/0.4)]">
                <p className="text-lg font-semibold leading-none text-white">{value}</p>
                <p className="mt-1 text-[11px] text-white/80 md:text-xs">{label}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Indicateur : on défile vers la droite */}
      <a
        href="#apropos"
        onClick={jump('apropos')}
        aria-label="Aller à la section suivante"
        className="absolute bottom-10 right-24 hidden items-center gap-3 text-sm text-white/70 xl:flex"
      >
        Scroll
        <motion.span
          className="grid h-10 w-10 place-items-center rounded-full border border-white/50"
          animate={{ x: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </motion.span>
      </a>
    </section>
  )
}