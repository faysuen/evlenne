"use client";
import {useRef,useState} from "react";

export default function Studio(){
  const input=useRef(null), previewRef=useRef(null);
  const [original,setOriginal]=useState(""),[portrait,setPortrait]=useState("");
  const [medallionPortrait,setMedallionPortrait]=useState("");
  const [name,setName]=useState(""),[years,setYears]=useState("");
  const [error,setError]=useState("");
  const [working,setWorking]=useState(false),[zoom,setZoom]=useState(1.55);
  const [x,setX]=useState(50),[y,setY]=useState(38),[aiPortrait,setAiPortrait]=useState("");
  const [aiWorking,setAiWorking]=useState(false);
  const [artWorking,setArtWorking]=useState(false);

  async function pick(e){
    const file=e.target.files?.[0]; if(!file)return;
    const local=URL.createObjectURL(file);
    setOriginal(local);setPortrait("");setAiPortrait("");setMedallionPortrait("");setWorking(true);setError("");
    setZoom(1.55);setX(50);setY(38);
    setTimeout(()=>previewRef.current?.scrollIntoView({behavior:"smooth",block:"start"}),120);
    setPortrait(local);
    setWorking(false);
  }


  async function removeWhiteBackground(blob){
    const bitmap=await createImageBitmap(blob);
    const canvas=document.createElement("canvas");canvas.width=bitmap.width;canvas.height=bitmap.height;
    const ctx=canvas.getContext("2d",{willReadFrequently:true});ctx.drawImage(bitmap,0,0);
    const image=ctx.getImageData(0,0,canvas.width,canvas.height),d=image.data;
    for(let i=0;i<d.length;i+=4){
      const r=d[i],g=d[i+1],b=d[i+2],min=Math.min(r,g,b),max=Math.max(r,g,b);
      if(min>246&&max-min<10)d[i+3]=0;
      else if(min>226&&max-min<16)d[i+3]=Math.round(255*(246-min)/20);
    }
    ctx.putImageData(image,0,0);return canvas.toDataURL("image/png");
  }

  async function createPortrait(){
    if(!original||aiWorking)return;
    setAiWorking(true);setError("");setAiPortrait("");
    try{
      const source=await fetch(original).then(r=>r.blob());
      const form=new FormData();
      form.append("image",source,"pet-photo.jpg");
      const response=await fetch("/api/create-portrait",{method:"POST",body:form});
      if(!response.ok){const info=await response.json().catch(()=>({}));throw new Error(info.error||"Portrait generation failed");}
      const blob=await response.blob();
      const url=URL.createObjectURL(blob);\n      setAiPortrait(url);\n      setMedallionPortrait(await removeWhiteBackground(blob));
      setTimeout(()=>document.getElementById("ai-portrait")?.scrollIntoView({behavior:"smooth",block:"center"}),100);
    }catch(err){console.error(err);setError(err.message||"We couldn't create the portrait. Please try again.");}
    finally{setAiWorking(false);}
  }

  function downloadPortrait(){if(!aiPortrait)return;const a=document.createElement("a");a.href=aiPortrait;a.download=(name||"evlenne-pet").trim().replace(/[^a-z0-9]+/gi,"-").toLowerCase()+"-portrait.png";a.click();}

  return <main>
    <header><a href="/" className="brand">EVLENNE<span>PORTRAIT STUDIO</span></a><p>Artwork preparation workspace</p></header>
    <section className="workspace">
      <div className="panel">
        <p className="step">01 · UPLOAD</p><h1>Frame their portrait.</h1>
        <p className="muted">Choose a clear photo of your pet. We’ll use it to create the EVLENNE engraving portrait.</p>
        <input ref={input} hidden type="file" accept="image/*" onChange={pick}/>
        <button className="upload" onClick={()=>input.current?.click()}>{original?"Choose another photo":"Upload pet photo"}</button>
        {error&&<div className="artwork-note"><strong>Photo processing failed.</strong><br/>{error}</div>}
        {working&&<div className="processing-card"><span className="spinner"/><div><strong>Photo uploaded ✓</strong><p>Preparing preview…</p></div></div>}
        {original&&!working&&<div className="original-card"><img src={original} alt="Uploaded pet"/><span>ORIGINAL PHOTO</span></div>}
        {medallionPortrait&&<div className="controls">
          <label>Portrait size<input type="range" min=".8" max="3" step=".05" value={zoom} onChange={e=>setZoom(+e.target.value)}/></label>
          <label>Left / right<input type="range" min="25" max="75" value={x} onChange={e=>setX(+e.target.value)}/></label>
          <label>Up / down<input type="range" min="10" max="75" value={y} onChange={e=>setY(+e.target.value)}/></label>
        </div>}
        {original&&!working&&<button className="create-art" disabled={aiWorking} onClick={createPortrait}>{aiWorking?"Creating EVLENNE portrait…":"Create EVLENNE portrait"}</button>}
        {aiPortrait&&<div className="artwork-note"><strong>Portrait ready.</strong><br/>OpenAI · Low quality · 1024 × 1024<button className="download-art" onClick={downloadPortrait}>Download PNG</button></div>}
        <label>Name<input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Coco"/></label>
        <label>Years<input value={years} onChange={e=>setYears(e.target.value)} placeholder="e.g. 2015 — 2024"/></label>
      </div>
      <div className="preview" ref={previewRef}>
        <p className="step">02 · PORTRAIT PREVIEW</p>
        <div className="medallion portrait-medallion clean-preview">
          {portrait&&!working?<img className="portrait-cutout clean-cutout" src={portrait} alt="Original pet portrait"
            style={{left:x+"%",top:y+"%",transform:"translate(-50%,-50%) scale("+zoom+")"}}/>:
          <span>{working?"Preparing portrait…":"Upload a photo\nto begin"}</span>}
        </div>
        {portrait&&!working&&<div className="proof-status">ORIGINAL PHOTO · POSITION & CROP</div>}
        <div className="memorial-copy"><h2>{name||"Their name"}</h2><p>{years||"Years together"}</p></div>
        <small>30 mm portrait composition preview</small>
        {aiPortrait&&<><p className="step artwork-step" id="ai-portrait">03 · EVLENNE PORTRAIT</p><div className="engraving-sheet"><img src={aiPortrait} alt="EVLENNE AI engraving portrait"/></div><small>OpenAI Low · white background · 30 mm artwork test</small></>}
      </div>
    </section>
  </main>
}