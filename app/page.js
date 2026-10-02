import Link from "next/link";
import { Newsreader } from "next/font/google";
import styles from "./landing.module.css";
import processStyles from "./process.module.css";
import chromeStyles from "./homeChrome.module.css";
import footerStyles from "./footer.module.css";
import renderStyles from "./renderSections.module.css";

const serif = Newsreader({ subsets: ["latin"], style: ["normal", "italic"], weight: ["400", "500"], variable: "--font-serif" });

const benefits = [
  ["camera", "Created from your photo", "A clear, well-lit photo of your pet."],
  ["eye", "Preview before ordering", "See the engraving on your keepsake before you buy."],
  ["heart", "A lasting keepsake", "Made to stay with you, always."],
  ["gift", "A meaningful gift", "Thoughtfully made for someone you love."],
];

const steps = [
  ["01", "Upload a photo", "Use a clear, well-lit photo of your pet.", "/pet-photo-golden.png", "A real photo"],
  ["02", "We engrave their likeness", "Your photo becomes a fine laser engraving made for the keepsake.", "/pet-portrait-golden.png", "Laser engraving render"],
  ["03", "Preview & order", "See the engraving on the keepsake before you buy.", "/hero-product-scene.png", "Your keepsake"],
];

function BenefitIcon({ type }) {
  const common = { width: 30, height: 30, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
  if (type === "camera") return <svg {...common}><path d="M4 7h3l1.5-2h7L17 7h3v12H4z" /><circle cx="12" cy="13" r="3.5" /></svg>;
  if (type === "eye") return <svg {...common}><path d="M2.5 12s3.4-5 9.5-5 9.5 5 9.5 5-3.4 5-9.5 5-9.5-5-9.5-5Z" /><circle cx="12" cy="12" r="2.5" /></svg>;
  if (type === "pen") return <svg {...common}><path d="M5 19 19 5" /><path d="M7 5h5v5M17 19h-5v-5" /></svg>;
  if (type === "heart") return <svg {...common}><path d="M20.8 8.8c0 5.2-8.8 10.2-8.8 10.2S3.2 14 3.2 8.8A4.4 4.4 0 0 1 12 7a4.4 4.4 0 0 1 8.8 1.8Z" /></svg>;
  return <svg {...common}><path d="M4 9h16v11H4zM2 6h20v3H2zM12 6v14M12 6c-1-3-5-3.5-5-1.2C7 6.2 9 6 12 6Zm0 0c1-3 5-3.5 5-1.2C17 6.2 15 6 12 6Z" /></svg>;
}

function Header() {
  const links = [["How It Works", "#how"], ["What's Included", "#keepsakes"], ["Reviews", "#about"]];
  return <header className={chromeStyles.header}>
    <Link href="/" className={chromeStyles.brand}><img src="/evlenne-logo-mark.png" alt="Evlenne" /></Link>
    <nav className={chromeStyles.nav} aria-label="Main">
      {links.map(([label, href]) => <a href={href} key={label}>{label}</a>)}
      <Link href="/studio" className={chromeStyles.headerCta}>Create yours</Link>
      <button aria-label="Shopping bag" className={chromeStyles.headerIcon}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 8a3 3 0 0 1 6 0"/></svg></button>
    </nav>
    <details className={chromeStyles.menu}><summary aria-label="Menu"><i /><i /><i /></summary><div>{links.map(([label, href]) => <a href={href} key={label}>{label}</a>)}</div></details>
  </header>;
}

function Hero() {
  return <section className={chromeStyles.hero} id="create">
    <div className={chromeStyles.heroCopy}>
      <p className={chromeStyles.eyebrow}>A keepsake made from their photograph</p>
      <h1>Keep them <em>close.</em></h1>
      <p className={chromeStyles.lead}>A favorite photograph, carefully transformed into a laser-engraved pendant and placed in a memorial box for the memories you want to keep close.</p>
      <Link href="/studio" className={chromeStyles.cta}>Create their keepsake <span>→</span></Link>
      <p className={chromeStyles.caption}>Made from your photo · Preview before ordering</p>
    </div>
    <div className={chromeStyles.heroProduct} role="img" aria-label="Walnut keepsake box with a custom pet portrait pendant" />
  </section>;
}

function Benefits() {
  return <section className={chromeStyles.benefits} aria-label="Why Evlenne">
    {benefits.map(([type, title, text]) => <div className={chromeStyles.benefit} key={title}><span><BenefitIcon type={type} /></span><strong>{title}</strong><small>{text}</small></div>)}
  </section>;
}

function Keepsakes() {
  return <section className={styles.keepsakes} id="keepsakes">
    <div className={styles.keepsakeText}><p className={styles.eyebrow}>Two timeless finishes</p><h2>Gold or <em>silver.</em></h2><p>The same custom engraving, available in your choice of finish.</p><Link href="/studio" className={styles.textLink}>Choose your keepsake <span>→</span></Link></div>
    <img className={renderStyles.productRender} src="/gold-silver-render.png" alt="Gold and silver laser-engraved pet portrait pendants beside an Evlenne walnut box" />
  </section>;
}

function HowItWorks() {
  return <section className={styles.how} id="how"><p className={styles.eyebrow}>From photograph to keepsake</p><h2>How it <em>works.</em></h2><p className={styles.intro}>Turn their photo into something you can keep close in just a few thoughtful steps.</p><img className={renderStyles.howRender} src="/how-it-works-render.png" alt="A pet photo becoming a laser-engraved portrait and finished keepsake" /><div className={processStyles.processGrid}>{steps.map(([number, title, text, image, alt], index) => <div className={processStyles.processItem} key={number}><article><img src={image} alt={alt} /><span>{number}</span><h3>{title}</h3><p>{text}</p></article>{index < steps.length - 1 && <span className={processStyles.processArrow} aria-hidden="true">→</span>}</div>)}</div></section>;
}

function About() {
  return <section className={styles.about} id="about"><div><p className={styles.eyebrow}>The story behind Evlenne</p><h2>Love <em>stays.</em></h2><p>A quiet place for the memories that always stay.</p><p>In 2024, we said goodbye to Jaerong and Minki. But love does not end when a beloved pet is gone. Their faces, their little habits, and the years we shared with them stay close in the quietest moments.</p><p>Evlenne was created as a memorial keepsake box centered around a custom laser-engraved pet pendant, with room for the small things that help you remember them — a photo, a vial of fur, a memory card, or another personal piece.</p><div className={styles.made}><span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21V8M12 12 7 9m5 3 5-4M7 9 5 5l4-4 3 4 4-1-2 5"/></svg><small>Made in Canada</small></span><span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 8 8-8 10-8-10 8-8Z"/></svg><small>Premium materials</small></span><span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h16v11H4zM2 6h20v3H2zM12 6v14M12 6c-1-3-5-3.5-5-1.2C7 6.2 9 6 12 6Zm0 0c1-3 5-3.5 5-1.2C17 6.2 15 6 12 6Z"/></svg><small>Thoughtful packaging</small></span></div></div><img className={renderStyles.aboutRender} src="/made-with-care-render.png" alt="Evlenne walnut memorial box with laser-engraved pet pendant and memory pieces" /></section>;
}

function Footer() {
  const icon={viewBox:"0 0 24 24","aria-hidden":true};
  return <footer className={footerStyles.footer} id="footer"><div className={footerStyles.footerBrand}><img src="/evlenne-logo-mark.png" alt="Evlenne" /><p>Custom pet portrait keepsakes made to keep them close.</p></div><div className={footerStyles.social}><span>Follow along</span><div><a href="#footer" aria-label="TikTok"><svg {...icon}><path d="M14 4v10.3a3.7 3.7 0 1 1-3-3.65"/><path d="M14 4c.7 2.2 2.1 3.4 4.4 3.7"/></svg></a><a href="#footer" aria-label="Instagram"><svg {...icon}><rect x="4" y="4" width="16" height="16" rx="4"/><circle cx="12" cy="12" r="3.5"/><circle cx="17.3" cy="6.8" r=".8" fill="currentColor" stroke="none"/></svg></a><a href="#footer" aria-label="Facebook"><svg {...icon}><path d="M14 20v-7h2.5l.5-3H14V8.2c0-.9.3-1.7 1.7-1.7H17V3.8c-.5-.1-1.4-.2-2.3-.2C12.3 3.6 11 5 11 7.5V10H8.5v3H11v7"/></svg></a></div></div><small>© {new Date().getFullYear()} Evlenne. Made with care in Canada.</small></footer>;
}

export default function Home() {
  return <div className={`${styles.page} ${serif.variable}`}><Header /><main><Hero /><Benefits /><Keepsakes /><HowItWorks /><About /><section className={styles.finalCta}><p className={styles.eyebrow}>Ready to create</p><h2>Turn their photo into <em>a keepsake.</em></h2><Link href="/studio" className={styles.cta}>Create their portrait <span>→</span></Link></section></main><Footer /></div>;
}
