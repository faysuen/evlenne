"use client";
import {useRef,useState} from "react";
import OrderBuilder from "./OrderBuilder";

export default function Studio(){
  const input=useRef(null), previewRef=useRef(null);
  const [original,setOriginal]=useState("");
  const [medallionPortrait,setMedallionPortrait]=useState("");
  const [name,setName]=useState(""),[years,setYears]=useState("");
  const [error,setError]=useState("");
  const [working,setWorking]=useState(false),[zoom,setZoom]=useState(1.55);
  const [x,setX]=useState(50),[y,setY]=useState(38),[aiPortrait,setAiPortrait]=useState("");
  const [aiWorking,setAiWorking]=useState(false);
  const [metal,setMetal]=useState("gold");
  const [step,setStep]=useState(1);
  const [packageType,setPackageType]=useState("complete");
  const [memoryText,setMemoryText]=useState("");
  const [email,setEmail]=useState("");
  const packageLabels={keepsake:"Keepsake",complete:"Complete",wear:"Wear & Keep"};
  const checkoutDisabled = name.trim().length === 0 ? true : email.trim().length === 0;

  async function pick(e){
    const file=e.target.files?.[0]; if(!file)return;
    const local=URL.createObjectURL(file);
    setOriginal(local);setAiPortrait("");setMedallionPortrait("");setWorking(true);setError("");
    setZoom(1.55);setX(50);setY(38);
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
      const url=URL.createObjectURL(blob);
      setAiPortrait(url);
      setMedallionPortrait(await removeWhiteBackground(blob));
      setStep(2); setTimeout(()=>previewRef.current?.scrollIntoView({behavior:"smooth",block:"start"}),100);
    }catch(err){console.error(err);setError(err.message||"We couldn't create the portrait. Please try again.");}
    finally{setAiWorking(false);}
  }

  function fileStem(){return (name||"evlenne-pet").trim().replace(/[^a-z0-9]+/gi,"-").toLowerCase();}
  function downloadPortrait(){if(!aiPortrait)return;const a=document.createElement("a");a.href=aiPortrait;a.download=fileStem()+"-portrait.png";a.click();}
  async function downloadLaserArtwork(){
    if(!medallionPortrait)return;
    const img=new Image();img.src=medallionPortrait;await img.decode();
    const size=1200,canvas=document.createElement("canvas");canvas.width=size;canvas.height=size;
    const ctx=canvas.getContext("2d");ctx.fillStyle="#fff";ctx.fillRect(0,0,size,size);
    ctx.save();ctx.beginPath();ctx.arc(size/2,size/2,size*.46,0,Math.PI*2);ctx.clip();
    const scale=zoom,drawW=size*scale,drawH=size*scale;
    ctx.drawImage(img,size*(x/100)-drawW/2,size*(y/100)-drawH/2,drawW,drawH);ctx.restore();
    const image=ctx.getImageData(0,0,size,size),d=image.data;
    for(let i=0;i<d.length;i+=4){
      const gray=Math.round(.299*d[i]+.587*d[i+1]+.114*d[i+2]);
      const clean=gray>238?255:gray<38?0:Math.round((gray-38)*255/200);
      d[i]=clean;d[i+1]=clean;d[i+2]=clean;d[i+3]=255;
    }
    ctx.putImageData(image,0,0);
    ctx.strokeStyle="#bdbdbd";ctx.lineWidth=3;ctx.beginPath();ctx.arc(size/2,size/2,size*.46,0,Math.PI*2);ctx.stroke();
    const a=document.createElement("a");a.href=canvas.toDataURL("image/png");a.download=fileStem()+"-laser-artwork.png";a.click();
  }

  const go=n=>{setStep(n);window.scrollTo({top:0,behavior:"smooth"});};
  return <main className="studio-flow">
    <header className="studio-site-header"><a href="/" className="studio-site-logo"><img src="/evlenne-logo-mark.png" alt="Evlenne" /></a><nav aria-label="Main"><a href="/#how">How It Works</a><a href="/#keepsakes">What's Included</a><a href="/#about">Reviews</a></nav><p>Artwork preparation workspace</p></header>
    <nav className="studio-progress" aria-label="Order progress">
      {["Photo","Portrait","Personalize","Keepsake"].map((label,i)=><button key={label} className={step===i+1?"active":step>i+1?"done":""} onClick={()=>i+1<step&&go(i+1)}><b>0{i+1}</b><span>{label}</span></button>)}
    </nav>

    {step===1&&<section className="flow-step upload-step">
      <div className="upload-intro"><p className="step">01 · PHOTO</p><h1>Start with their photograph.</h1><p className="muted">Choose a clear, well-lit photo of your pet. We’ll turn it into a portrait made to keep close.</p></div>
      <input ref={input} hidden type="file" accept="image/*" onChange={pick}/>
      <div className="upload-layout">
        <button className="upload-dropzone" onClick={()=>input.current?.click()}>
          {original?<><img src={original} alt="Uploaded pet"/><span className="dropzone-overlay">Choose another photo</span></>:<><span className="upload-camera" aria-hidden="true">⌾</span><strong>Upload a photo</strong><span>or drag and drop here</span><small>JPG, PNG or HEIC · up to 10MB</small></>}
        </button>
        <aside className="upload-guidance"><p className="guidance-kicker">A good photo helps</p><h2>Let them look like themselves.</h2><ul><li>Face the camera in natural light</li><li>Keep their eyes and features clear</li><li>Use one pet per photo</li></ul><p className="guidance-note">You’ll review the portrait before choosing your keepsake.</p></aside>
      </div>
      {original&&<div className="upload-success">
        <div className="upload-success-head"><span className="upload-check">✓</span><div><strong>Photo uploaded</strong><small>Ready to create their portrait</small></div></div>
        <button className="create-art upload-create" disabled={aiWorking} onClick={createPortrait}>{aiWorking?"Creating Evlenne portrait…":"Create Evlenne portrait →"}</button>
      </div>}
    </section>}

    {step===2&&<section className="flow-step" ref={previewRef}>
      <p className="step">02 · REVIEW PORTRAIT</p><h1>Make it feel like them.</h1>
      {!aiPortrait&&<p className="muted">Your portrait is being prepared. You’ll be able to review the crop and finish before continuing.</p>}
      {error&&<div className="artwork-note"><strong>Portrait creation failed.</strong><br/>{error}</div>}
      {aiPortrait&&<div className="portrait-review-grid">
        <div><div className={"medallion portrait-medallion clean-preview "+(metal==="silver"?"silver-preview":"gold-preview")}>{medallionPortrait&&<img className="portrait-cutout clean-cutout" src={medallionPortrait} alt="Evlenne portrait" style={{left:x+"%",top:y+"%",transform:"translate(-50%,-50%) scale("+zoom+")"}}/>}</div>
        <div className="metal-switch"><button className={metal==="gold"?"active":""} onClick={()=>setMetal("gold")}>GOLD</button><button className={metal==="silver"?"active":""} onClick={()=>setMetal("silver")}>SILVER</button></div></div>
        <div className="controls"><label>Portrait size<input type="range" min=".8" max="3" step=".05" value={zoom} onChange={e=>setZoom(+e.target.value)}/></label><label>Left / right<input type="range" min="25" max="75" value={x} onChange={e=>setX(+e.target.value)}/></label><label>Up / down<input type="range" min="10" max="75" value={y} onChange={e=>setY(+e.target.value)}/></label></div>
      </div>}
      {aiPortrait&&<><button className="create-art secondary-action" disabled={aiWorking} onClick={createPortrait}>{aiWorking?"Creating…":"Regenerate portrait"}</button><button className="flow-next" onClick={()=>go(3)}>Looks good → Personalize</button></>}
      <button className="flow-back" onClick={()=>go(1)}>← Back</button>
    </section>}

    {step===3&&<section className="flow-step">
      <p className="step">03 · PERSONALIZE</p><h1>Add the details you remember.</h1>
      <label>Pet name<input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Coco"/></label>
      <label>Years <span className="optional">optional</span><input value={years} onChange={e=>setYears(e.target.value)} placeholder="e.g. 2015 — 2026"/></label>
      <div className="mini-proof"><div className={"mini-medallion "+metal}>{medallionPortrait&&<img src={medallionPortrait} alt="Portrait"/>}</div><div><strong>{name||"Their name"}</strong><span>{years||"Years together"}</span></div></div>
      <button className="flow-next" disabled={!name.trim()} onClick={()=>go(4)}>Choose your keepsake →</button>
      <button className="flow-back" onClick={()=>go(2)}>← Back</button>
    </section>}

    {step===4&&<section className="flow-step flow-order">
      <OrderBuilder metal={metal} petName={name} years={years}/>
      <button className="flow-back" onClick={()=>go(3)}>← Back</button>
    </section>}
  </main>
}
