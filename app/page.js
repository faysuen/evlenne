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
  ["eye", "Preview before ordering", "See your portrait on the keepsake before you buy."],
  ["heart", "A lasting keepsake", "Made to stay with you, always."],
  ["gift", "A meaningful gift", "Thoughtfully made for someone you love."],
];

const steps = [
  ["01", "Upload a photo", "Use a clear, well-lit photo of your pet.", "/pet-photo-golden.png", "A real photo"],
  ["02", "We create the portrait", "Our AI transforms your photo into a clean, engraved-style portrait.", "/pet-portrait-golden.png", "Portrait render"],
  ["03", "Preview & order", "See your portrait on the keepsake before you buy.", "/hero-product-scene.png", "Your keepsake"],
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
    <Link href="/" className={chromeStyles.brand}><img src="/evlenne-logo.png" alt="Evlenne — Custom pet portrait keepsakes" /></Link>
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
      <p className={chromeStyles.eyebrow}>A portrait made from their photograph</p>
      <h1>Keep them <em>close.</em></h1>
      <p className={chromeStyles.lead}>A favorite photograph, thoughtfully transformed into a delicate portrait and made into a personal keepsake you can hold onto.</p>
      <Link href="/studio" className={chromeStyles.cta}>Create their portrait <span>→</span></Link>
      <p className={chromeStyles.caption}>Created from your photo · Preview before ordering</p>
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
    <div className={styles.keepsakeText}><p className={styles.eyebrow}>Two timeless finishes</p><h2>Gold or <em>silver.</em></h2><p>The same heartfelt portrait, available in the finish that feels most like them.</p><Link href="/studio" className={styles.textLink}>Choose your keepsake <span>→</span></Link></div>
    <img className={renderStyles.productRender} src="/gold-silver-render.png" alt="Gold and silver laser-engraved pet portrait pendants beside an Evlenne walnut box" />
  </section>;
}

function HowItWorks() {
  return <section className={styles.how} id="how"><p className={styles.eyebrow}>From photograph to keepsake</p><h2>How it <em>works.</em></h2><p className={styles.intro}>Turn their photo into something you can keep close in just a few thoughtful steps.</p><img className={renderStyles.howRender} src="/how-it-works-render.png" alt="A pet photo becoming a laser-engraved portrait and finished keepsake" /><div className={processStyles.processGrid}>{steps.map(([number, title, text, image, alt], index) => <div className={processStyles.processItem} key={number}><article><img src={image} alt={alt} /><span>{number}</span><h3>{title}</h3><p>{text}</p></article>{index < steps.length - 1 && <span className={processStyles.processArrow} aria-hidden="true">→</span>}</div>)}</div></section>;
}

function About() {
  return <section className={styles.about} id="about"><div><p className={styles.eyebrow}>The story behind Evlenne</p><h2>Made to keep them <em>close.</em></h2><p>In 2024, we said goodbye to Jaerong and Minki. But love does not end when a beloved pet is gone. Their faces, their little habits, and the years we shared with them stay close in the quietest moments.</p><p>Evlenne was created to turn those memories into something you can hold onto — a custom portrait keepsake made from their photograph, so that every time you see it, you remember them as they were: loved, present, and always close.</p><div className={styles.made}><span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21V8M12 12 7 9m5 3 5-4M7 9 5 5l4 1 3-4 3 4 4-1-2 5"/></svg><small>Made in Canada</small></span><span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 8 8-8 10-8-10 8-8Z"/></svg><small>Premium materials</small></span><span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h16v11H4zM2 6h20v3H2zM12 6v14M12 6c-1-3-5-3.5-5-1.2C7 6.2 9 6 12 6Zm0 0c1-3 5-3.5 5-1.2C17 6.2 15 6 12 6Z"/></svg><small>Thoughtful packaging</small></span></div></div><img src="/made-with-care-render.png" alt="Evlenne walnut keepsake box with engraved logo and memory pieces" /></section>;
}

function Footer() {
  return <footer className={footerStyles.footer} id="footer"><div className={footerStyles.footerBrand}><img src="/evlenne-logo.png" alt="Evlenne" /><p>Custom pet portrait keepsakes made to keep them close.</p></div><div className={footerStyles.social}><span>Follow along</span><div><a href="#footer">TikTok</a><a href="#footer">Instagram</a><a href="#footer">Facebook</a></div></div><small>© {new Date().getFullYear()} Evlenne. Made with care in Canada.</small></footer>;
}

export default function Home() {
  return <div className={`${styles.page} ${serif.variable}`}><Header /><main><Hero /><Benefits /><Keepsakes /><HowItWorks /><About /><section className={styles.finalCta}><p className={styles.eyebrow}>Ready to create</p><h2>Turn their photo into <em>a keepsake.</em></h2><Link href="/studio" className={styles.cta}>Create their portrait <span>→</span></Link></section></main><Footer /></div>;
}
