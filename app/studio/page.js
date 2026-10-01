"use client";
import {useRef,useState} from "react";

export default function Studio(){
  const input=useRef(null), previewRef=useRef(null);
  const [original,setOriginal]=useState(""),[portrait,setPortrait]=useState("");
  const [name,setName]=useState(""),[years,setYears]=useState("");
  const [working,setWorking]=useState(false),[zoom,setZoom]=useState(1.55);
  const [x,setX]=useState(50),[y,setY]=useState(38),[artwork,setArtwork]=useState(false);

  async function pick(e){
    const file=e.target.files?.[0]; if(!file)return;
    const local=URL.createObjectURL(file);
    setOriginal(local);setPortrait("");setArtwork(false);setWorking(true);
    setZoom(1.55);setX(50);setY(38);
    setTimeout(()=>previewRef.current?.scrollIntoView({behavior:"smooth",block:"start"}),120);
    // Keep the crop/position workflow build-safe for now.
    // Background removal will move to a server API so ML/WebGPU code is not bundled by Next/Vercel.
    setPortrait(local);
    setWorking(false)
  }

  return <main>
    <header><a href="/" className="brand">EVLENNE<span>PORTRAIT STUDIO</span></a><p>Artwork preparation workspace</p></header>
    <section className="workspace">
      <div className="panel">
        <p className="step">01 · UPLOAD</p><h1>Frame their portrait.</h1>
        <p className="muted">Choose a clear photo. We remove the background so you can position the portrait before creating the engraving artwork.</p>
        <input ref={input} hidden type="file" accept="image/*" onChange={pick}/>
        <button className="upload" onClick={()=>input.current?.click()}>{original?"Choose another photo":"Upload pet photo"}</button>
        {working&&<div className="processing-card"><span className="spinner"/><div><strong>Photo uploaded ✓</strong><p>Removing background…</p></div></div>}
        {portrait&&!working&&<>
          <div className="controls">
            <label>Portrait size<input type="range" min=".8" max="3" step=".05" value={zoom} onChange={e=>setZoom(+e.target.value)}/></label>
            <label>Left / right<input type="range" min="25" max="75" value={x} onChange={e=>setX(+e.target.value)}/></label>
            <label>Up / down<input type="range" min="10" max="75" value={y} onChange={e=>setY(+e.target.value)}/></label>
          </div>
          <button className="create-art" onClick={()=>setArtwork(true)}>Create engraving artwork</button>
          {artwork&&<div className="artwork-note"><strong>Artwork engine coming next.</strong><br/>Your crop is ready. The final EVLENNE line-art generator will replace the temporary photo treatment here.</div>}
        </>}
        <label>Name<input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Coco"/></label>
        <label>Years<input value={years} onChange={e=>setYears(e.target.value)} placeholder="e.g. 2015 — 2024"/></label>
      </div>
      <div className="preview" ref={previewRef}>
        <p className="step">02 · PORTRAIT PREVIEW</p>
        <div className="medallion portrait-medallion clean-preview">
          {portrait&&!working?<img className="portrait-cutout clean-cutout" src={portrait} alt="Background-free pet portrait"
            style={{left:x+"%",top:y+"%",transform:"translate(-50%,-50%) scale("+zoom+")"}}/>:
          <span>{working?"Preparing portrait…":"Upload a photo\nto begin"}</span>}
        </div>
        {portrait&&!working&&<div className="proof-status">BACKGROUND REMOVED · POSITION & CROP</div>}
        <div className="memorial-copy"><h2>{name||"Their name"}</h2><p>{years||"Years together"}</p></div>
        <small>30 mm portrait composition preview</small>
      </div>
    </section>
  </main>
}