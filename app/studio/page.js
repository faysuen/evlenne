"use client";
import {useRef,useState} from "react";

export default function Studio(){
  const input=useRef(null);\n  const previewRef=useRef(null);
  const [original,setOriginal]=useState("");
  const [portrait,setPortrait]=useState("");
  const [name,setName]=useState("");
  const [years,setYears]=useState("");
  const [working,setWorking]=useState(false);
  const [zoom,setZoom]=useState(2.25);
  const [x,setX]=useState(50);
  const [y,setY]=useState(28);

  async function pick(e){
    const file=e.target.files?.[0];
    if(!file)return;
    const local=URL.createObjectURL(file);
    setOriginal(local);
    setPortrait("");
    setWorking(true);
    setZoom(2.25); setX(50); setY(28);
    try{
      const {removeBackground}=await import("@imgly/background-removal");
      const blob=await removeBackground(file);
      setPortrait(URL.createObjectURL(blob));
    }catch(err){
      console.error("Background removal failed",err);
      setPortrait(local);
    }finally{
      setWorking(false);
    }
  }

  return <main>
    <header>
      <a href="/" className="brand">EVLENNE<span>PORTRAIT STUDIO</span></a>
      <p>Artwork preparation workspace</p>
    </header>
    <section className="workspace">
      <div className="panel">
        <p className="step">01 · PHOTO</p>
        <h1>Create their portrait.</h1>
        <p className="muted">Upload a clear photo. We remove the background first, then crop tightly for a head-and-shoulders engraving portrait.</p>
        <input ref={input} hidden type="file" accept="image/*" onChange={pick}/>
        <button className="upload" onClick={()=>input.current?.click()}>
          {original?"Choose another photo":"Upload pet photo"}
        </button>
        {working&&<div className="processing-card"><span className="spinner"/><div><strong>Photo uploaded ✓</strong><p>Removing background…</p></div></div>}
        {portrait&&!working&&<div className="controls">
          <label>Portrait size
            <input type="range" min="1.25" max="4" step=".05" value={zoom} onChange={e=>setZoom(Number(e.target.value))}/>
          </label>
          <label>Left / right
            <input type="range" min="25" max="75" value={x} onChange={e=>setX(Number(e.target.value))}/>
          </label>
          <label>Up / down
            <input type="range" min="5" max="70" value={y} onChange={e=>setY(Number(e.target.value))}/>
          </label>
        </div>}
        <label>Name<input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Coco"/></label>
        <label>Years<input value={years} onChange={e=>setYears(e.target.value)} placeholder="e.g. 2015 — 2024"/></label>
      </div>
      <div className="preview" ref={previewRef}>
        <p className="step">02 · 30 MM PREVIEW</p>
        <div className="medallion portrait-medallion">
          {portrait&&!working
            ? <img className="portrait-cutout" src={portrait} alt="Background-free pet portrait"
                style={{left:x+"%",top:y+"%",transform:"translate(-50%,-50%) scale("+zoom+")"}}/>
            : <span>{working?"Preparing portrait…":"Upload a photo\nto begin"}</span>}
        </div>
        <h2>{name||"Their name"}</h2>
        <p>{years||"Years together"}</p>
        <small>Head portrait · background removed · 30 mm</small>
      </div>
    </section>
  </main>
}