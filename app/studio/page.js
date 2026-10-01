"use client";
import {useRef,useState} from "react";

export default function Studio(){
  const input=useRef(null);
  const [original,setOriginal]=useState("");
  const [portrait,setPortrait]=useState("");
  const [name,setName]=useState("");
  const [years,setYears]=useState("");
  const [working,setWorking]=useState(false);
  const [zoom,setZoom]=useState(2.15);
  const [x,setX]=useState(50);
  const [y,setY]=useState(24);

  async function pick(e){
    const file=e.target.files?.[0];
    if(!file)return;
    const local=URL.createObjectURL(file);
    setOriginal(local); setPortrait(""); setWorking(true);
    try{
      const {removeBackground}=await import("@imgly/background-removal");
      const blob=await removeBackground(file);
      setPortrait(URL.createObjectURL(blob));
    }catch(err){
      console.error(err);
      setPortrait(local);
    }finally{setWorking(false)}
  }

  return <main>
    <header><a href="/" className="brand">EVLENNE<span>PORTRAIT STUDIO</span></a><p>Artwork preparation workspace</p></header>
    <section className="workspace">
      <div className="panel">
        <p className="step">01 · PHOTO</p>
        <h1>Create their portrait.</h1>
        <p className="muted">Upload a clear photo. EVLENNE removes the background and frames the portrait tightly around your pet’s head.</p>
        <input ref={input} hidden type="file" accept="image/*" onChange={pick}/>
        <button className="upload" onClick={()=>input.current?.click()}>{original?"Choose another photo":"Upload pet photo"}</button>
        {working&&<p className="processing">Removing background… first use can take a moment.</p>}
        {portrait&&!working&&<>
          <label>Portrait size<input type="range" min="1.35" max="3.5" step=".05" value={zoom} onChange={e=>setZoom(+e.target.value)}/></label>
          <label>Move left / right<input type="range" min="20" max="80" value={x} onChange={e=>setX(+e.target.value)}/></label>
          <label>Move up / down<input type="range" min="5" max="65" value={y} onChange={e=>setY(+e.target.value)}/></label>
        </>}
        <label>Name<input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Coco"/></label>
        <label>Years<input value={years} onChange={e=>setYears(e.target.value)} placeholder="e.g. 2015 — 2024"/></label>
      </div>
      <div className="preview">
        <p className="step">02 · 30 MM PREVIEW</p>
        <div className="medallion">
          {portrait&&!working
            ? <img className="portrait-cutout" src={portrait} alt="Background-free pet portrait" style={{transform:`translate(${x-50}%,${y-50}%) scale(${zoom})`}}/>
            : <span>{working?"Preparing portrait…":"Upload a photo\nto begin"}</span>}
        </div>
        <h2>{name||"Their name"}</h2>
        <p>{years||"Years together"}</p>
        <small>Head portrait · background removed · 30 mm</small>
      </div>
    </section>
  </main>
}