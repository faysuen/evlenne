import Link from "next/link";
import { Newsreader } from "next/font/google";
import styles from "../homepage.module.css";

const serif = Newsreader({ subsets: ["latin"], style: ["normal", "italic"], weight: ["400", "500"], variable: "--font-serif" });
export const metadata = { title: "Our Story | Evlenne", description: "It started with Jaerong and Minki. The beginning of Evlenne's personalized pet keepsakes." };

// Historical facts recovered from 84b8602, app/page.js, About.
export default function OurStory() {
  return <div className={`${styles.home} ${serif.variable}`}>
    <header className={styles.siteHeader}>
      <Link href="/" className={styles.logo}><img src="/evlenne-logo-mark.png" alt="Evlenne" /></Link>
      <Link href="/" className={styles.textCta}>Back to home <span>→</span></Link>
    </header>
    <main className={styles.storyPage}>
      <p className={styles.eyebrow}>OUR BEGINNING</p>
      <h1>It started with<br /><em>Jaerong and Minki.</em></h1>
      <img className={styles.storyPhoto} src="/our-story-pets.png" alt="Two white dogs on a soft cream blanket" />
      <p>In 2024, we said goodbye to Jaerong and Minki. Their faces, their little habits, and the years we shared with them stayed close in the quietest moments.</p>
      <p>Evlenne began with a desire to turn those memories into something you could hold — a custom portrait keepsake made from their photograph, remembering them as they were: loved, present, and close.</p>
      <p>Today, that same idea reaches beyond a single object. A personalized portrait can become keepsakes to wear, hold, display, and keep close.</p>
      <p>Some celebrate everyday companionship. Others hold memories. Each begins with an individual pet — their face, personality, and presence.</p>
      <Link href="/studio" className={styles.primaryCta}>Create Your Pet <span>→</span></Link>
    </main>
    <footer className={styles.footer}><Link href="/">Evlenne homepage →</Link></footer>
  </div>;
}
