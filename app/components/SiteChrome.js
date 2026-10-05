import Link from "next/link";
import styles from "../homepage.module.css";
import chrome from "./SiteChrome.module.css";

function SearchIcon(){return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg>}
function AccountIcon(){return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.5"/><path d="M5 20c.8-3.5 3-5.2 7-5.2s6.2 1.7 7 5.2"/></svg>}
function BagIcon(){return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 8a3 3 0 0 1 6 0"/></svg>}

export function SiteHeader(){return <div className={`${styles.home} ${chrome.chrome}`}><header className={styles.siteHeader}><Link href="/" className={styles.logo}><img src="/evlenne-logo-mark.png" alt="Evlenne"/></Link><nav className={styles.desktopNav} aria-label="Main"><a href="/#shop">Shop</a><a href="/#how-it-works">How It Works</a><a href="/our-story">Our Story</a></nav><div className={styles.headerActions}><button aria-label="Search"><SearchIcon/></button><Link href="/account" aria-label="Account"><AccountIcon/></Link><button aria-label="Bag"><BagIcon/></button><Link href="/studio?mode=new" className={styles.headerCta}>Create Your Pet</Link></div><details className={styles.mobileMenu}><summary aria-label="Open menu"><i/><i/><i/></summary><div><a href="/#shop">Shop</a><a href="/#how-it-works">How It Works</a><a href="/our-story">Our Story</a><Link href="/account">Account</Link><Link href="/pets">My Pets</Link><Link href="/studio?mode=new">Create Your Pet</Link></div></details></header></div>}

export function SiteFooter(){return <div className={`${styles.home} ${chrome.chrome}`}><footer className={styles.footer}><div className={styles.footerTop}><img src="/evlenne-logo-mark.png" alt="Evlenne"/><p>A personalized lifestyle brand built around the pet you love.</p></div><div className={styles.footerColumns}><div><h3>Shop</h3><a href="/#shop">Wear</a><a href="/#shop">Carry</a><a href="/#shop">Keep</a></div><div><h3>About</h3><a href="/our-story">Our Story</a><a href="/#how-it-works">How It Works</a><a href="/#faq">FAQ</a></div><div><h3>Help</h3><a href="/#contact">Contact</a><a href="/#shipping">Shipping</a><a href="/#returns">Returns</a></div></div><div className={styles.footerBottom}>© {new Date().getFullYear()} Evlenne</div></footer></div>}

