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
  return <main className="home">
    <nav className="home-nav">
      <div className="brand-lockup production-brand"><span className="brand-name">Evlenne</span><span className="brand-sub">CUSTOM PET PORTRAIT KEEPSAKES</span></div>
      <div className="nav-links"><a href="#inside">What’s inside</a><a href="#how">How it works</a><Link href="/studio">Create yours</Link></div>
    </nav>

    <section className="home-hero">
      <div className="hero-copy">
        <p className="eyebrow">A portrait made from their photograph</p>
        <h1>Keep them<br/><em>close.</em></h1>
        <p className="lead">A favorite photograph, thoughtfully transformed into a delicate portrait and made into a personal keepsake you can hold onto.</p>
        <Link className="button hero-button" href="/studio">Create their portrait <span>→</span></Link>
        <p className="hero-note">Created from your photo · Preview before ordering</p>
      </div>
      <div className="hero-product" aria-label="Evlenne walnut keepsake box">
        <div className="product-box">
          <div className="product-lid"><PetIcon/></div>
          <div className="product-tray">
            <span className="tray-magnet tm1"/><span className="tray-magnet tm2"/><span className="tray-magnet tm3"/><span className="tray-magnet tm4"/>
            <div className="tray-medallion"><span>♡</span></div>
            <div className="tray-vial"><i/></div>
            <div className="tray-card"><span>MEMORY</span><b>Always close.</b></div>
          </div>
        </div>
        <p>30 mm portrait medallion · Keepsake vial · Memory card</p>
      </div>
    </section>

    <section className="promise">
      <p>NOT A FILTER. NOT A TEMPLATE.</p>
      <h2>A portrait that still<br/>feels like <em>them.</em></h2>
      <p className="promise-copy">Every Evlenne portrait begins with your photograph. We preserve the expression, features and little details you recognize, then refine the artwork for a small, timeless engraving.</p>
    </section>

    <section className="inside" id="inside">
      <div className="section-intro"><p className="eyebrow">The complete keepsake</p><h2>More than<br/>a pendant.</h2><p className="section-copy">A quiet place for the details you never want to lose. The complete set is arranged inside a walnut keepsake box and personalized around one beloved photograph.</p></div>
      <div className="inside-grid">
        <article><span>01</span><h3>Portrait medallion</h3><p>Your pet’s custom portrait on a 30 mm gold or silver medallion, personalized with their name and years.</p></article>
        <article><span>02</span><h3>Memory details</h3><p>A printed photograph, name &amp; years card and a small card for a memory in your own words.</p></article>
        <article><span>03</span><h3>Something to keep</h3><p>A small keepsake vial and soft memory pouch, presented together inside the walnut box.</p></article>
        <article><span>04</span><h3>Wear it close</h3><p>Add the matching chain when you want the portrait to be something you can wear as well as keep.</p></article>
      </div>
      <p className="inside-note">Final arrangement may vary slightly as we refine the production box and inserts.</p>
    </section>

    <section className="how" id="how">
      <div className="section-intro"><p className="eyebrow">Made personal</p><h2>From photo<br/>to keepsake.</h2></div>
      <div className="steps">
        <article><span>01</span><h3>Share a photograph</h3><p>Choose a clear photo that feels like them. It does not need to be perfect.</p></article>
        <article><span>02</span><h3>Meet their portrait</h3><p>We create a refined engraving portrait and let you preview the composition before ordering.</p></article>
        <article><span>03</span><h3>Made to keep</h3><p>Your approved portrait is engraved onto your chosen metal keepsake and prepared with care.</p></article>
      </div>
    </section>

    <section className="materials">
      <div className="product-finishes"><div className="material-disc gold-disc"><span>♡</span></div><div className="material-disc silver-disc"><span>♡</span></div></div>
      <div className="material-copy"><p className="eyebrow">Your keepsake</p><h2>Quietly personal.<br/>Made to last.</h2><p>Choose warm gold or classic silver. The 30 mm format gives the portrait room to breathe while remaining intimate enough to wear or keep close.</p><div className="finish-row"><span><i className="gold-dot"/>Gold</span><span><i className="silver-dot"/>Silver</span></div></div>
    </section>

    <section className="home-cta">
      <p className="eyebrow">Begin with one photograph</p>
      <h2>Keep their story<br/>within reach.</h2>
      <Link className="button" href="/studio">Create their portrait <span>→</span></Link>
    </section>

    <footer className="home-footer"><div className="brand-lockup official-lockup"><BrandLogo/></div><p>Made with care in Canada</p><p>© 2026 Evlenne</p></footer>
  </main>
}