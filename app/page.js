import Link from "next/link";
import { Newsreader } from "next/font/google";
import styles from "./landing.module.css";

const serif = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500"],
  variable: "--font-serif",
});

const iconProps = {
  width: 34,
  height: 34,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

const trust = [
  {
    label: "Created from\nyour photo",
    icon: (
      <svg {...iconProps}>
        <path d="M4 8h3l1.5-2h7L17 8h3v11H4z" />
        <circle cx="12" cy="13" r="3.5" />
      </svg>
    ),
  },
  {
    label: "Preview\nbefore ordering",
    icon: (
      <svg {...iconProps}>
        <path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    label: "A lasting\nkeepsake",
    icon: (
      <svg {...iconProps}>
        <path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.3 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z" />
      </svg>
    ),
  },
  {
    label: "A meaningful\ngift",
    icon: (
      <svg {...iconProps}>
        <rect x="3.5" y="9" width="17" height="11" />
        <path d="M2.5 9h19v-3h-19zM12 6v14M12 6c-1-3-5-3.5-5-1.2C7 6.2 9 6 12 6zm0 0c1-3 5-3.5 5-1.2C17 6.2 15 6 12 6z" />
      </svg>
    ),
  },
];

const included = [
  {
    n: "01",
    title: "Portrait medallion",
    text: "Your pet's custom portrait on a 30 mm gold or silver medallion, personalized with their name and years.",
  },
  {
    n: "02",
    title: "Memory details",
    text: "A printed photograph, name & years card and a small card for a memory in your own words.",
  },
  {
    n: "03",
    title: "Something to keep",
    text: "A glass keepsake vial for a small lock of fur and a soft memory pouch, presented inside the walnut box.",
  },
  {
    n: "04",
    title: "Wear it close",
    text: "Add the matching chain when you want the portrait to be something you can wear as well as keep.",
  },
];

const steps = [
  { n: "01", title: "Share a photograph", text: "Choose a clear photo that feels like them." },
  { n: "02", title: "Meet their portrait", text: "Preview the refined engraving portrait before ordering." },
  { n: "03", title: "Made to keep", text: "Your approved portrait is engraved and prepared with care." },
];

export default function Home() {
  return (
    <div className={`${styles.page} ${serif.variable}`}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand}>
          <span className={styles.wordmark}>Evlenne</span>
          <span className={styles.tagline}>Custom pet portrait keepsakes</span>
        </Link>

        <nav className={styles.nav} aria-label="Main">
          <a href="#how">How It Works</a>
          <a href="#inside">What&apos;s Included</a>
          <a href="#story">Our Portraits</a>
          <Link href="/studio" className={styles.navCta}>
            Create yours
          </Link>
        </nav>

        <details className={styles.mobileMenu}>
          <summary aria-label="Menu">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden>
              <path d="M3 7h18M3 12h18M3 17h18" />
            </svg>
          </summary>
          <div className={styles.mobilePanel}>
            <a href="#how">How It Works</a>
            <a href="#inside">What&apos;s Included</a>
            <a href="#story">Our Portraits</a>
            <Link href="/studio">Create yours</Link>
          </div>
        </details>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroText}>
          <p className={styles.eyebrow}>A portrait made from their photograph</p>
          <h1 className={styles.headline}>
            Keep them
            <br />
            <em>close.</em>
          </h1>
          <p className={styles.lead}>
            A favorite photograph, thoughtfully transformed into a delicate portrait and made into a personal keepsake you can hold onto.
          </p>
          <Link href="/studio" className={styles.cta}>
            Create their portrait <span aria-hidden>→</span>
          </Link>
          <p className={styles.caption}>Created from your photo · Preview before ordering</p>
        </div>
        <div className={styles.heroImage} role="img" aria-label="Walnut keepsake box with a portrait medallion, fur vial and photo card" />
      </section>

      <section className={styles.trust} aria-label="Highlights">
        {trust.map((t) => (
          <div key={t.label} className={styles.trustItem}>
            <span className={styles.trustIcon}>{t.icon}</span>
            <span className={styles.trustLabel}>{t.label}</span>
          </div>
        ))}
      </section>

      <section className={styles.section} id="story">
        <p className={styles.eyebrowCenter}>The complete keepsake</p>
        <h2 className={styles.h2}>
          Your portrait. Their memories. <em>Kept together.</em>
        </h2>
        <p className={styles.centerText}>
          30 mm portrait medallion · walnut keepsake box · memory details · glass fur keepsake vial
        </p>
        <p className={styles.note}>Final product photography coming after sample assembly.</p>
      </section>

      <section className={`${styles.section} ${styles.alt}`}>
        <p className={styles.eyebrowCenter}>Not a filter. Not a template.</p>
        <h2 className={styles.h2}>
          A portrait that still feels like <em>them.</em>
        </h2>
        <p className={styles.centerText}>
          Every Evlenne portrait begins with your photograph. We preserve the expression, features and little details you recognize, then refine the artwork for a small, timeless engraving.
        </p>
      </section>

      <section className={styles.section} id="inside">
        <p className={styles.eyebrowCenter}>The complete keepsake</p>
        <h2 className={styles.h2}>More than a pendant.</h2>
        <p className={styles.centerText}>
          A quiet place for the details you never want to lose. The complete set is arranged inside a walnut keepsake box and personalized around one beloved photograph.
        </p>
        <div className={styles.grid4}>
          {included.map((i) => (
            <div key={i.n} className={styles.item}>
              <span className={styles.num}>{i.n}</span>
              <h3>{i.title}</h3>
              <p>{i.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={`${styles.section} ${styles.alt}`} id="how">
        <p className={styles.eyebrowCenter}>Made personal</p>
        <h2 className={styles.h2}>From photo to keepsake.</h2>
        <div className={styles.grid3}>
          {steps.map((s) => (
            <div key={s.n} className={styles.item}>
              <span className={styles.num}>{s.n}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.finalCta}>
        <p className={styles.eyebrowLight}>Begin with one photograph</p>
        <h2 className={styles.h2Light}>
          Keep their story <em>within reach.</em>
        </h2>
        <Link href="/studio" className={styles.ctaLight}>
          Create their portrait <span aria-hidden>→</span>
        </Link>
      </section>

      <footer className={styles.footer}>
        <p>Made with care in Canada</p>
        <p>© 2026 Evlenne</p>
      </footer>
    </div>
  );
}
