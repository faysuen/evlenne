"use client";
export default function OrderBuilder({metal="gold",setMetal,petName="",years="",setPetName,setYears,kind="complete",setKind,memory="",setMemory,email="",setEmail,onBack}){
  const choices=[
    ["keepsake","Keepsake Box","Laser-engraved pendant · walnut box"],
    ["complete","Complete Memorial Box","Pendant · photo · memory pieces · walnut box"],
    ["wear","Wear & Keep","Complete box · matching chain"]
  ];
  const selected=choices.find(c=>c[0]===kind);
  const showMemory=kind!=="keepsake";
  const ready=petName.trim().length>0 && email.trim().length>3;
  return <section className="order-builder" aria-labelledby="finish-title">
    <p className="step">03 · FINISH</p><h1 id="finish-title">Make their keepsake.</h1>
    <p className="muted finish-intro">Add the details that make the memorial box theirs, then choose the finish and package you’d like to keep close.</p>
    <div className="personalization finish-details"><p className="section-label">THEIR DETAILS</p>
      <label>Pet name<input value={petName} onChange={e=>setPetName(e.target.value)} placeholder="e.g. Coco" /></label>
      <label>Years <span className="optional">optional</span><input value={years} onChange={e=>setYears(e.target.value)} placeholder="e.g. 2015 — 2026" /></label>
      {showMemory&&<label>Memory or message <span className="optional">optional</span><textarea maxLength={160} value={memory} onChange={e=>setMemory(e.target.value)} placeholder="A short memory, phrase or message…"/><small>{memory.length} / 160</small></label>}
      <label>Order email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" /></label>
    </div>
    <div className="finish-selection"><p className="section-label">FINISH</p><div className="metal-switch finish-switch"><button type="button" className={metal==="gold"?"active":""} onClick={()=>setMetal?.("gold")}>GOLD</button><button type="button" className={metal==="silver"?"active":""} onClick={()=>setMetal?.("silver")}>SILVER</button></div></div>
    <div className="package-selection"><p className="section-label">CHOOSE YOUR MEMORIAL BOX</p><p className="package-explainer">Each package centers on a laser-engraved pet pendant and can hold other meaningful small items, including a photo, hair keepsake vial, and memory card.</p><div className="package-options">{choices.map(([id,title,detail])=><button type="button" key={id} className={kind===id?"selected":""} onClick={()=>setKind?.(id)}><strong>{title}</strong><span>{detail}</span></button>)}</div></div>
    <div className="order-summary"><div><span>Package</span><strong>{selected?.[1]}</strong></div><div><span>Finish</span><strong>{metal==="silver"?"Silver":"Gold"}</strong></div><div><span>Engraving</span><strong>{petName||"Your pet artwork"}</strong></div><div><span>Includes</span><strong>Memorial keepsake box</strong></div></div>
    <button type="button" className="checkout-preview" disabled={!ready}>Continue to checkout</button><p className="checkout-note">{ready?"Your memorial box details are ready. Payment will be connected next.":"Add a pet name and order email to continue."}</p>
    {onBack&&<button className="flow-back" onClick={onBack}>← Back to artwork</button>}
  </section>;
}
