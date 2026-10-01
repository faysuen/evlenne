"use client";
import {useRef,useState} from "react";

export default function Studio(){
  const input=useRef(null), previewRef=useRef(null);
  const [original,setOriginal]=useState(""),[portrait,setPortrait]=useState("");
  const [name,setName]=useState(""),[years,setYears]=useState("");
  const [working,setWorking]=useState(false),[zoom,setZoom]=useState(2.25);
  const [x,setX]=useState(50),[y,setY]=useState(35),[style,setStyle]=useState("fine");

  async function pick(e){
    const file=e.target.files?.[0]; if(!file)return;
    const local=URL.createObjectURL(file);
    setOriginal(local);setPortrait("");setWorking(true);setZoom(1.55);setX(50);setY(38);
    setTimeout(()=>previewRef.current?.scrollIntoView({behavior:"smooth",block:"start"}),120);
    try{
      const {removeBackground}=await import("@imgly/background-removal");
      const blob=await removeBackground(file);
      setPortrait(URL.createObjectURL(blob));
    }catch(err){console.error(err);setPortrait(local)}
    finally{setWorking(false)}
  }

  const filter=style==="fine"?"grayscale(1) contrast(1.12) brightness(1.12)":
    style==="bold"?"grayscale(1) contrast(1.8) brightness(.93)":
    "grayscale(1) contrast(1.42) brightness(1.04)";

  return <main>
    <header><a href="/" className="brand">EVLENNE<span>PORTRAIT STUDIO</span></a><p>Artwork preparation workspace</p></header>
    <section className="workspace">
      <div className="panel">
        <p className="step">01 · PHOTO</p><h1>Create their portrait.</h1>
        <p className="muted">Start with a clear photo. We remove the background and frame the face as a head-and-shoulders portrait for engraving.</p>
        <input ref={input} hidden type="file" accept="image/*" onChange={pick}/>
        <button className="upload" onClick={()=>input.current?.click()}>{original?"Choose another photo":"Upload pet photo"}</button>
        {working&&<div className="processing-card"><span className="spinner"/><div><strong>Photo uploaded ✓</strong><p>Preparing the portrait…</p></div></div>}
        {portrait&&!working&&<>
          <p className="section-label">PORTRAIT STYLE</p>
          <div className="style-picker">
            {["fine","balanced","bold"].map(v=><button key={v} className={style===v?"active":""} onClick={()=>setStyle(v)}>{v[0].toUpperCase()+v.slice(1)}</button>)}
          </div>
          <div className="controls">
            <label>Portrait size<input type="range" min="1.25" max="4" step=".05" value={zoom} onChange={e=>setZoom(+e.target.value)}/></label>
            <label>Left / right<input type="range" min="25" max="75" value={x} onChange={e=>setX(+e.target.value)}/></label>
            <label>Up / down<input type="range" min="5" max="70" value={y} onChange={e=>setY(+e.target.value)}/></label>
          </div>
        </>}
        <label>Name<input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Coco"/></label>
        <label>Years<input value={years} onChange={e=>setYears(e.target.value)} placeholder="e.g. 2015 — 2024"/></label>
      </div>
      <div className="preview" ref={previewRef}>
        <p className="step">02 · PORTRAIT PROOF</p>
        <div className="medallion portrait-medallion">
          {portrait&&!working?<img className="portrait-cutout" src={portrait} alt="Pet portrait" style={{left:x+"%",top:y+"%",transform:"translate(-50%,-50%) scale("+zoom+")",filter}}/>:
          <span>{working?"Creating portrait…":"Upload a photo\nto begin"}</span>}
        </div>
        {portrait&&!working&&<div className="proof-status">BACKGROUND REMOVED · {style.toUpperCase()} DETAIL</div>}
        <h2>{name||"Their name"}</h2><p>{years||"Years together"}</p>
        <small>30 mm · head portrait · engraving preview</small>
      </div>
    </section>
  </main>
}