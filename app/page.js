import Link from "next/link";
import { Newsreader } from "next/font/google";
import styles from "./homepage.module.css";

const serif=Newsreader({subsets:["latin"],style:["normal","italic"],weight:["400","500"],variable:"--font-serif"});

const products=[
  ["Portrait Medallion","Wear their portrait close.",null,"Product photography placeholder"],
  ["Memorial Coin","A small piece made to keep.",null,"Product photography placeholder"],
  ["Fur Keepsake","Keep a little piece close.",null,"Product photography placeholder"],
  ["Pet Bracelet","A subtle everyday reminder.",null,"Product photography placeholder"],
];

const steps=[["01","Upload their photos","Share clear photos of your pet."],["02","We create","We create their personalized portrait."],["03","You approve","Preview your design before production."],["04","We make it","Your keepsake is carefully finished and prepared in Canada."]];

function SearchIcon(){return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg>}
function AccountIcon(){return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.5"/><path d="M5 20c.8-3.5 3-5.2 7-5.2s6.2 1.7 7 5.2"/></svg>}
function BagIcon(){return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 8a3 3 0 0 1 6 0"/></svg>}

function Header(){return <header className={styles.siteHeader}><Link href="/" className={styles.logo}><img src="/evlenne-logo-mark.png" alt="Evlenne"/></Link><nav className={styles.desktopNav} aria-label="Main"><a href="#shop">Shop</a><a href="#how-it-works">How It Works</a><a href="/our-story">Our Story</a></nav><div className={styles.headerActions}><button aria-label="Search"><SearchIcon/></button><button aria-label="Account"><AccountIcon/></button><button aria-label="Bag"><BagIcon/></button><Link href="/studio" className={styles.headerCta}>Create Your Pet</Link></div><details className={styles.mobileMenu}><summary aria-label="Open menu"><i/><i/><i/></summary><div><a href="#shop">Shop</a><a href="#how-it-works">How It Works</a><a href="/our-story">Our Story</a><Link href="/studio">Create Your Pet</Link></div></details></header>}

function PhotographyPlaceholder({ label, detail = "Real photography to follow" }) { return <div className={styles.photographyPlaceholder} role="img" aria-label={`${label} — photography placeholder`}><span>{label}</span><small>{detail}</small></div>; }

function Hero(){return <section className={styles.hero}><div className={styles.heroCopy}><p className={styles.eyebrow}>MADE FROM YOUR PET</p><h1>Your pet,<br/><em>always with you.</em></h1><p className={styles.heroLead}>Personalized keepsakes created from the pet you love — made to wear, hold, display, and keep close.</p><div className={styles.heroActions}><Link href="/studio" className={styles.primaryCta}>Create Your Pet <span>→</span></Link><a href="#shop" className={styles.textCta}>Explore Keepsakes <span>→</span></a></div><p className={styles.reassurance}>Created from your photos · Preview before we make it</p></div><div className={styles.heroVisual}><img src="/hero-wide-product-scene.png" alt="Walnut Evlenne keepsake box with a personalized pet portrait medallion" fetchPriority="high"/></div></section>}

function ProductCollection(){return <section className={styles.collection} id="shop"><div className={styles.sectionIntro}><p className={styles.eyebrow}>MADE FROM ONE PET</p><h2>One pet. So many ways<br/><em>to keep them close.</em></h2><p>We turn your pet&apos;s photos into a personalized portrait, then create keepsakes made especially for you.</p></div><div className={styles.productGrid}>{products.map(([name,subtitle,image,alt])=><Link href="/studio" className={styles.productItem} key={name}><div className={styles.productImage}>{image?<img src={image} alt={alt}/>:<div className={styles.productPlaceholder}><span>PRODUCT PHOTOGRAPHY</span><small>Coming into focus</small></div>}</div><h3>{name}</h3><p>{subtitle}</p><span>Explore <b>→</b></span></Link>)}</div></section>}


function HowItWorks(){return <section className={styles.process} id="how-it-works"><div className={styles.centerIntro}><p className={styles.eyebrow}>FROM PHOTO TO KEEPSAKE</p><h2>From their photo to<br/><em>something you can hold.</em></h2></div><div className={styles.stepGrid}>{steps.map(([number,title,copy])=><article key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></section>}

function Story(){return <section className={styles.story} id="our-story"><div className={styles.storyVisual}><img src="/our-story-pets.png" alt="Two white dogs on a soft cream blanket" loading="lazy"/></div><div className={styles.storyCopy}><p className={styles.eyebrow}>A KEEPSAKE FOR EVERY SEASON</p><h2>For the pets beside us.<br/>And the ones we <em>carry with us.</em></h2><p>Some keepsakes celebrate the everyday. Others hold a lifetime of memories.</p><p>Evlenne creates personal objects inspired by the bond between you and your pet — thoughtfully made to stay with you.</p><Link href="/our-story" className={styles.textCta}>Our Story <span>→</span></Link></div></section>}


function Beginning(){return <section className={styles.beginning} aria-labelledby="beginning-title"><p className={styles.eyebrow}>OUR BEGINNING</p><h2 id="beginning-title">It started with<br/><em>Jaerong and Minki.</em></h2><p>In 2024, we said goodbye to Jaerong and Minki. Their faces, their little habits, and the years we shared inspired Evlenne: a way to turn a photograph into something personal you can hold close.</p><p>That beginning still guides us — keepsakes that reflect an individual pet, for the pets beside us and the ones we remember.</p><Link href="/our-story" className={styles.textCta}>Our Story <span>→</span></Link></section>}


function Materials(){return <section className={styles.materials}><div className={styles.materialCopy}><p className={styles.eyebrow}>THE DETAILS MATTER</p><h2>Made to be <em>kept.</em></h2></div><div className={styles.materialList}>{["316L stainless steel","Walnut keepsake boxes","Thoughtful finishing","Made individually","Carefully packaged"].map(item=><div key={item}><span>—</span><strong>{item}</strong></div>)}</div></section>}

function Footer(){return <footer className={styles.footer}><div className={styles.footerTop}><img src="/evlenne-logo-mark.png" alt="Evlenne"/><p>Personalized pet keepsakes made to keep them close.</p></div><div className={styles.footerColumns}><div><h3>Shop</h3><a href="#shop">Portrait Keepsakes</a><a href="#shop">Memory Keepsakes</a></div><div><h3>About</h3><a href="/our-story">Our Story</a><a href="#how-it-works">How It Works</a><a href="#faq">FAQ</a></div><div><h3>Help</h3><a href="#contact">Contact</a><a href="#shipping">Shipping</a><a href="#returns">Returns</a></div></div><div className={styles.footerBottom}>© {new Date().getFullYear()} Evlenne</div></footer>}

export default function Home(){return <div className={`${styles.home} ${serif.variable}`}><Header/><main><Hero/><ProductCollection/><HowItWorks/><Story/><Beginning/><Materials/><section className={styles.finalCta}><p className={styles.eyebrow}>THEIR FACE. THEIR PERSONALITY. THEIR STORY.</p><h2>Make something<br/><em>that feels like them.</em></h2><Link href="/studio" className={styles.primaryCta}>Create Your Pet <span>→</span></Link></section></main><Footer/></div>}
