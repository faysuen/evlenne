"use client";
import {useState} from "react";

export default function OrderBuilder({metal="gold",petName="",years=""}){
  const [kind,setKind]=useState("complete");
  const [memory,setMemory]=useState("");
  const [email,setEmail]=useState("");
  const choices=[
    ["keepsake","Keepsake","Portrait medallion · walnut box"],
    ["complete","Complete","Medallion · memory pieces · walnut box"],
    ["wear","Wear & Keep","Complete keepsake · matching chain"]
  ];
  const selected=choices.find(c=>c[0]===kind);
  const showMemory=kind!=="keepsake";
  const ready=petName.trim().length>0 && email.trim().length>3;

  return (
    <section className="order-builder">
      <p className="step">04 · CHOOSE YOUR KEEPSAKE</p>
      <h2>How would you like to keep them close?</h2>
      <div className="package-options">
        {choices.map(([id,title,detail])=>(
          <button type="button" key={id} className={kind===id?"selected":""} onClick={()=>setKind(id)}>
            <strong>{title}</strong><span>{detail}</span>
          </button>
        ))}
      </div>

      <div className="personalization">
        <p className="step">ORDER DETAILS</p>
        <div className="personalization-readonly">
          <span>Pet name</span><strong>{petName||"Add their name above"}</strong>
          <span>Years</span><strong>{years||"Optional"}</strong>
        </div>
        {showMemory ? (
          <label>Memory card <span className="optional">optional</span>
            <textarea maxLength={160} value={memory} onChange={e=>setMemory(e.target.value)} placeholder="A short memory, phrase or message…"></textarea>
            <small>{memory.length} / 160</small>
          </label>
        ) : null}
        <label>Order email
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" />
        </label>
      </div>

      <div className="order-summary">
        <div><span>Selection</span><strong>{selected?.[1]}</strong></div>
        <div><span>Finish</span><strong>{metal==="silver"?"Silver":"Gold"}</strong></div>
        <div><span>Portrait</span><strong>{petName||"Custom pet portrait"}</strong></div>
      </div>
      <button type="button" className="checkout-preview" disabled={!ready}>Continue to checkout</button>
      <p className="checkout-note">{ready?"Your personalization is ready. Payment will be connected next.":"Add a pet name and order email to continue."}</p>
    </section>
  );
}
