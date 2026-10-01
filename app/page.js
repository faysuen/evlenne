import Link from "next/link";

export default function Home(){
  return <main className="home">
    <nav className="home-nav">
      <div className="brand">EVLENNE<span>PET MEMORIAL KEEPSAKES</span></div>
      <div className="nav-links"><a href="#how">How it works</a><Link href="/studio">Create yours</Link></div>
    </nav>

    <section className="home-hero">
      <div className="hero-copy">
        <p className="eyebrow">A portrait made from their photograph</p>
        <h1>Keep them<br/><em>close.</em></h1>
        <p className="lead">A favorite photograph, thoughtfully transformed into a delicate portrait and engraved onto a keepsake made to stay with you.</p>
        <Link className="button hero-button" href="/studio">Create their portrait <span>→</span></Link>
        <p className="hero-note">Created from your photo · Preview before ordering</p>
      </div>
      <div className="hero-object" aria-label="EVLENNE memorial medallion">
        <div className="hero-chain"/>
        <div className="hero-medallion">
          <div className="hero-bail"/>
          <div className="hero-pet">E</div>
        </div>
        <p>30 mm · Stainless steel</p>
      </div>
    </section>

    <section className="promise">
      <p>Not a filter. Not a template.</p>
      <h2>A portrait that still<br/>feels like <em>them.</em></h2>
      <p className="promise-copy">Every EVLENNE portrait begins with your photograph. We preserve the expression, features and little details you recognize, then refine the artwork for a small, timeless engraving.</p>
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
      <div className="material-disc gold-disc">E</div>
      <div className="material-copy"><p className="eyebrow">Your keepsake</p><h2>Quietly personal.<br/>Made to last.</h2><p>Choose warm gold or classic silver. Each 30 mm medallion gives the portrait room to breathe while remaining intimate enough to wear or keep close.</p><div className="finish-row"><span><i className="gold-dot"/>Gold</span><span><i className="silver-dot"/>Silver</span></div></div>
    </section>

    <section className="home-cta">
      <p className="eyebrow">Begin with one photograph</p>
      <h2>For the love that<br/>doesn’t leave.</h2>
      <Link className="button" href="/studio">Create their portrait <span>→</span></Link>
    </section>

    <footer className="home-footer"><div className="brand">EVLENNE<span>PET MEMORIAL KEEPSAKES</span></div><p>Made with care in Canada</p><p>© 2026 EVLENNE</p></footer>
  </main>
}