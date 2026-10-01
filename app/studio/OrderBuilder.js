"use client";
import {useState} from "react";

export default function OrderBuilder({metal="gold",petName="",years=""}){
  const [kind,setKind]=useState("complete");
  const choices=[
    ["keepsake","Keepsake","Portrait medallion · walnut box"],
    ["complete","Complete","Medallion · memory pieces · walnut box"],
    ["wear","Wear & Keep","Complete keepsake · matching chain"]
  ];
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
      <div className="order-summary">
        <div><span>Selection</span><strong>{choices.find(c=>c[0]===kind)?.[1]}</strong></div>
        <div><span>Finish</span><strong>{metal==="silver"?"Silver":"Gold"}</strong></div>
        <div><span>Portrait</span><strong>{petName||"Custom pet portrait"}</strong></div>
        {years?<div><span>Years</span><strong>{years}</strong></div>:null}
      </div>
      <p className="checkout-note">Personalization and checkout are added after the product selection is confirmed.</p>
    </section>
  );
}
