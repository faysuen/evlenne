import Link from "next/link";

const LOGO_SRC = "data:image/webp;base64,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";
const BrandLogo = () => <img className="official-logo" src={LOGO_SRC} alt="Evlenne — Custom Pet Portrait Keepsakes" />;

const PetIcon = () => (
  <svg className="pet-icon" viewBox="0 0 96 52" aria-hidden="true">
    <path d="M10 39c1-13 7-23 17-26 8-2 15 2 20 11 5-9 12-13 20-11 10 3 16 13 17 26" />
    <path d="M18 17 12 8l12 4M76 17l7-9-12 4" />
    <path d="M28 29c2 7 8 11 18 11s16-4 19-11" />
    <path d="M37 28c2 2 4 3 9 3s7-1 9-3" />
    <circle cx="35" cy="24" r="1.5" fill="currentColor" stroke="none"/>
    <circle cx="58" cy="24" r="1.5" fill="currentColor" stroke="none"/>
    <path d="M89 5v10M84 10h10" className="spark" />
  </svg>
);

export default function Home(){
  return <main className="home final-home">
    <header className="final-header">
      <div className="final-logo"><BrandLogo/><span className="mobile-wordmark">Evlenne<small>CUSTOM PET PORTRAIT KEEPSAKES</small></span></div>
      <nav className="desktop-nav">
        <a href="#how">How It Works</a><a href="#inside">What&apos;s Included</a><a href="#story">Our Portraits</a>
      </nav>
      <div className="header-actions"><Link className="header-cta" href="/studio">Create yours</Link><span className="cart-icon" aria-hidden="true">♡</span><span className="menu-icon" aria-hidden="true">☰</span></div>
    </header>

    <section className="final-hero">
      <div className="final-copy">
        <p className="eyebrow">A portrait made from their photograph</p>
        <h1>Keep them<br/><em>close.</em></h1>
        <p className="lead">A favorite photograph, thoughtfully transformed into a delicate portrait and made into a personal keepsake you can hold onto.</p>
        <Link className="button hero-button" href="/studio">Create their portrait <span>→</span></Link>
        <p className="hero-note">Created from your photo · Preview before ordering</p>
      </div>
      <div className="hero-product-placeholder">
        <p className="eyebrow">THE COMPLETE KEEPSAKE</p>
        <h2>Your portrait.<br/>Their memories.<br/><em>Kept together.</em></h2>
        <p>30 mm portrait medallion · walnut keepsake box · memory details · glass fur keepsake vial</p>
        <span>Final product photography coming after sample assembly.</span>
      </div>
    </section>

    <section className="benefits">
      <article><b>▣</b><span>Created from<br/>your photo</span></article>
      <article><b>◉</b><span>Preview<br/>before ordering</span></article>
      <article><b>♡</b><span>A lasting<br/>keepsake</span></article>
      <article><b>◇</b><span>A meaningful<br/>gift</span></article>
    </section>

    <section className="promise" id="story">
      <p>NOT A FILTER. NOT A TEMPLATE.</p>
      <h2>A portrait that still<br/>feels like <em>them.</em></h2>
      <p className="promise-copy">Every Evlenne portrait begins with your photograph. We preserve the expression, features and little details you recognize, then refine the artwork for a small, timeless engraving.</p>
    </section>

    <section className="inside" id="inside">
      <div className="section-intro"><p className="eyebrow">The complete keepsake</p><h2>More than<br/>a pendant.</h2><p className="section-copy">A quiet place for the details you never want to lose. The complete set is arranged inside a walnut keepsake box and personalized around one beloved photograph.</p></div>
      <div className="inside-grid">
        <article><span>01</span><h3>Portrait medallion</h3><p>Your pet&apos;s custom portrait on a 30 mm gold or silver medallion, personalized with their name and years.</p></article>
        <article><span>02</span><h3>Memory details</h3><p>A printed photograph, name &amp; years card and a small card for a memory in your own words.</p></article>
        <article><span>03</span><h3>Something to keep</h3><p>A glass keepsake vial for a small lock of fur and a soft memory pouch, presented inside the walnut box.</p></article>
        <article><span>04</span><h3>Wear it close</h3><p>Add the matching chain when you want the portrait to be something you can wear as well as keep.</p></article>
      </div>
    </section>

    <section className="how" id="how">
      <div className="section-intro"><p className="eyebrow">Made personal</p><h2>From photo<br/>to keepsake.</h2></div>
      <div className="steps"><article><span>01</span><h3>Share a photograph</h3><p>Choose a clear photo that feels like them.</p></article><article><span>02</span><h3>Meet their portrait</h3><p>Preview the refined engraving portrait before ordering.</p></article><article><span>03</span><h3>Made to keep</h3><p>Your approved portrait is engraved and prepared with care.</p></article></div>
    </section>

    <section className="home-cta"><p className="eyebrow">Begin with one photograph</p><h2>Keep their story<br/>within reach.</h2><Link className="button" href="/studio">Create their portrait <span>→</span></Link></section>
    <footer className="home-footer"><div className="final-logo footer-logo"><BrandLogo/></div><p>Made with care in Canada</p><p>© 2026 Evlenne</p></footer>
  </main>
}