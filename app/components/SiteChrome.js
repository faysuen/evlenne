"use client";
import Link from "next/link";
import {useState} from "react";
import {usePathname} from "next/navigation";
import styles from "./SiteChrome.module.css";

const links=[
 {text:"THE COLLECTIONS",href:"/#collections"},
 {text:"SHOP THE EDIT",href:"/#the-edit"},
 {text:"OUR STORY",href:"/#story"}
];
export function SiteHeader(){
 const [open,setOpen]=useState(false);
 const pathname=usePathname();
 return <header className={styles.siteHeader}>
   <div className={styles.topLine}>EVLENNE <span>✦</span> MODERN JEWELRY · ARTISTIC FORMS</div>
   <div className={styles.headerInner}>
    <nav className={styles.desktopLeft} aria-label="Main collections"><Link href="/#collections">COLLECTIONS</Link><Link href="/#the-edit">THE EDIT</Link></nav>
    <Link className={styles.brandLogo} href="/" aria-label="Evlenne home"><span className={styles.wordmark}>EVLENNE<span className={styles.wordmarkStar} aria-hidden="true">✧</span></span></Link>
    <div className={styles.rightArea}><Link className={styles.storyLink} href="/#story">OUR STORY</Link><a className={styles.contactLink} href="mailto:hello@evlenne.com" aria-label="Contact Evlenne">CONTACT <span>↗</span></a></div>
    <button className={styles.menuToggle} type="button" aria-expanded={open} aria-controls="evlenne-mobile-nav" onClick={()=>setOpen(!open)}>{open?"CLOSE":"MENU"}<span aria-hidden="true">{open?"×":"+"}</span></button>
   </div>
   <nav id="evlenne-mobile-nav" className={open?styles.mobileNavOpen:styles.mobileNav} aria-label="Mobile navigation">
    {links.map(link=><Link key={link.href} href={link.href} onClick={()=>setOpen(false)}>{link.text}<span>↗</span></Link>)}
    <a href="mailto:hello@evlenne.com" onClick={()=>setOpen(false)}>CONTACT <span>↗</span></a>
   </nav>
 </header>;
}
export function SiteFooter(){return <footer className={styles.siteFooter}><div className={styles.footerTop}><div><span className={styles.footerWordmark}>EVLENNE<span className={styles.wordmarkStar} aria-hidden="true">✧</span></span><p>Sculptural forms. Artistic details. Everyday expression.</p></div><div className={styles.footerLinks}><Link href="/#the-edit">THE EDIT</Link><Link href="/#collections">COLLECTIONS</Link><Link href="/#story">OUR STORY</Link><a href="mailto:hello@evlenne.com">CONTACT</a></div></div><div className={styles.footerBottom}><span>© {new Date().getFullYear()} EVLENNE</span><span>MODERN JEWELRY · DESIGNED WITH INTENTION</span></div></footer>}
