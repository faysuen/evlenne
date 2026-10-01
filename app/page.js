import Link from "next/link";

const PetIcon = () => (
  <svg className="pet-icon" viewBox="0 0 88 42" aria-hidden="true">
    <path d="M8 31c2-12 8-20 17-22 8-2 13 3 16 10 3-7 9-12 17-10 10 2 16 10 18 22M17 13l-5-7 10 3M68 13l6-7-11 3M31 27c3 4 7 6 11 6s8-2 11-6" />
    <path d="M79 5v9M74.5 9.5h9" className="spark" />
  </svg>
);

export default function Home(){
  return <main className="home">
    <nav className="home-nav">
      <div className="brand-lockup"><PetIcon/><div className="brand">Evlenne<span>CUSTOM PET PORTRAIT KEEPSAKES</span></div></div>
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
      <div className="hero-object" aria-label="Evlenne keepsake box">
        <div className="hero-box">
          <div className="box-lid"><PetIcon/></div>
          <div className="box-base">
            <i className="magnet m1"/><i className="magnet m2"/><i className="magnet m3"/><i className="magnet m4"/>
            <div className="hero-chain"/>
            <div className="hero-medallion"><div className="hero-bail"/><div className="portrait-lines">♡</div></div>
          </div>
        </div>
        <p>30 mm portrait medallion · Gold or silver</p>
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
      <PetIcon/><p className="eyebrow">Begin with one photograph</p>
      <h2>Keep their story<br/>within reach.</h2>
      <Link className="button" href="/studio">Create their portrait <span>→</span></Link>
    </section>

    <footer className="home-footer"><div className="brand-lockup"><PetIcon/><div className="brand">Evlenne<span>CUSTOM PET PORTRAIT KEEPSAKES</span></div></div><p>Made with care in Canada</p><p>© 2026 Evlenne</p></footer>
  </main>
}