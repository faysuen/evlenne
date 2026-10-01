"use client";
import {useRef,useState} from "react";

export default function Studio(){
  const input=useRef(null), previewRef=useRef(null);
  const [original,setOriginal]=useState(""),[portrait,setPortrait]=useState("");
  const [name,setName]=useState(""),[years,setYears]=useState("");
  const [error,setError]=useState("");
  const [working,setWorking]=useState(false),[zoom,setZoom]=useState(1.55);
  const [x,setX]=useState(50),[y,setY]=useState(38),[artwork,setArtwork]=useState("");
  const [artWorking,setArtWorking]=useState(false);

  async function pick(e){
    const file=e.target.files?.[0]; if(!file)return;
    const local=URL.createObjectURL(file);
    setOriginal(local);setPortrait("");setArtwork("");setWorking(true);setError("");
    setZoom(1.55);setX(50);setY(38);
    setTimeout(()=>previewRef.current?.scrollIntoView({behavior:"smooth",block:"start"}),120);
    try{
      const form=new FormData();
      form.append("image",file);
      const response=await fetch("/api/remove-background",{method:"POST",body:form});
      if(!response.ok) throw new Error("Background removal failed");
      const blob=await response.blob();
      setPortrait(URL.createObjectURL(blob));
    }catch(err){
      console.error(err);
      setError("We couldn't remove the background. Please try another photo.");
    }finally{
      setWorking(false);
    }
  }

  async function createArtwork(){
    if(!portrait||artWorking)return;
    setArtWorking(true);setError("");setArtwork("");
    try{
      const source=await fetch(portrait).then(r=>r.blob());
      const bitmap=await createImageBitmap(source);
      const size=1200, canvas=document.createElement("canvas");
      canvas.width=size;canvas.height=size;
      const ctx=canvas.getContext("2d",{willReadFrequently:true});
      ctx.clearRect(0,0,size,size);
      const scale=Math.min((size*.78)/bitmap.width,(size*.78)/bitmap.height);
      const w=bitmap.width*scale,h=bitmap.height*scale;
      ctx.drawImage(bitmap,(size-w)/2,(size-h)/2,w,h);
      const img=ctx.getImageData(0,0,size,size), d=img.data;
      const gray=new Float32Array(size*size), alpha=new Uint8ClampedArray(size*size);
      for(let i=0,p=0;i<d.length;i+=4,p++){
        gray[p]=.299*d[i]+.587*d[i+1]+.114*d[i+2];alpha[p]=d[i+3];
      }
      const out=ctx.createImageData(size,size),o=out.data;
      for(let yy=1;yy<size-1;yy++)for(let xx=1;xx<size-1;xx++){
        const p=yy*size+xx,a=alpha[p]; if(a<20)continue;
        const gx=-gray[p-size-1]+gray[p-size+1]-2*gray[p-1]+2*gray[p+1]-gray[p+size-1]+gray[p+size+1];
        const gy=-gray[p-size-1]-2*gray[p-size]-gray[p-size+1]+gray[p+size-1]+2*gray[p+size]+gray[p+size+1];
        const edge=Math.min(255,Math.hypot(gx,gy)*1.15);
        const shade=Math.max(0,150-gray[p])*.22;
        const ink=Math.min(255,edge+shade);
        const v=255-ink;
        const i=p*4;o[i]=v;o[i+1]=v;o[i+2]=v;o[i+3]=Math.min(255,a*(ink/105));
      }
      ctx.clearRect(0,0,size,size);ctx.putImageData(out,0,0);
      setArtwork(canvas.toDataURL("image/png"));
    }catch(err){console.error(err);setError("We couldn’t create the engraving preview. Please try again.");}
    finally{setArtWorking(false);}
  }

  function downloadArtwork(){
    if(!artwork)return; const a=document.createElement("a");a.href=artwork;
    a.download=(name||"evlenne-pet").trim().replace(/[^a-z0-9]+/gi,"-").toLowerCase()+"-engraving.png";a.click();
  }

  return <main>
    <header><a href="/" className="brand">EVLENNE<span>PORTRAIT STUDIO</span></a><p>Artwork preparation workspace</p></header>
    <section className="workspace">
      <div className="panel">
        <p className="step">01 · UPLOAD</p><h1>Frame their portrait.</h1>
        <p className="muted">Choose a clear photo. We remove the background so you can position the portrait before creating the engraving artwork.</p>
        <input ref={input} hidden type="file" accept="image/*" onChange={pick}/>
        <button className="upload" onClick={()=>input.current?.click()}>{original?"Choose another photo":"Upload pet photo"}</button>
        {error&&<div className="artwork-note"><strong>Photo processing failed.</strong><br/>{error}</div>}
        {working&&<div className="processing-card"><span className="spinner"/><div><strong>Photo uploaded ✓</strong><p>Removing background…</p></div></div>}
        {portrait&&!working&&<>
          <div className="controls">
            <label>Portrait size<input type="range" min=".8" max="3" step=".05" value={zoom} onChange={e=>setZoom(+e.target.value)}/></label>
            <label>Left / right<input type="range" min="25" max="75" value={x} onChange={e=>setX(+e.target.value)}/></label>
            <label>Up / down<input type="range" min="10" max="75" value={y} onChange={e=>setY(+e.target.value)}/></label>
          </div>
          <button className="create-art" disabled={artWorking} onClick={createArtwork}>{artWorking?"Creating artwork…":"Create engraving artwork"}</button>
          {artwork&&<div className="artwork-note"><strong>Engraving preview ready.</strong><br/>Fine monochrome detail on a transparent background. Review the face and fur before laser testing.<button className="download-art" onClick={downloadArtwork}>Download PNG</button></div>}
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
        {artwork&&<><p className="step artwork-step">03 · ENGRAVING ARTWORK</p><div className="engraving-sheet"><img src={artwork} alt="EVLENNE engraving artwork preview"/></div><small>1200 × 1200 transparent PNG · laser-test artwork</small></>}
      </div>
    </section>
  </main>
}