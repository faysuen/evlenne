"use client";
import {Suspense,useEffect,useRef,useState} from "react";
import {useSearchParams} from "next/navigation";
import OrderBuilder from "./OrderBuilder";
import {createPetIdentity} from "../lib/petIdentity";
import {createClient} from "../lib/supabaseClient";

const SESSION_KEY="evlenne-studio-session";

function StudioContent(){
  const searchParams=useSearchParams();
  const input=useRef(null), previewRef=useRef(null);
  const [hydrated,setHydrated]=useState(false),[original,setOriginal]=useState(""),[medallionPortrait,setMedallionPortrait]=useState("");
  const [name,setName]=useState(""),[years,setYears]=useState(""),[step,setStep]=useState(1),[metal,setMetal]=useState("gold"),[packageType,setPackageType]=useState("complete"),[memoryText,setMemoryText]=useState(""),[email,setEmail]=useState("");
  const [zoom,setZoom]=useState(1.55),[x,setX]=useState(50),[y,setY]=useState(38),[aiPortrait,setAiPortrait]=useState(""),[aiWorking,setAiWorking]=useState(false),[error,setError]=useState("");
  const [sourceFile,setSourceFile]=useState(null),[petId,setPetId]=useState(""),[saving,setSaving]=useState(false);

  useEffect(()=>{let live=true;(async()=>{try{
    const requestedPet=searchParams.get("pet"),mode=searchParams.get("mode");
    if(requestedPet){
      const supabase=createClient();
      const {data:{user}}=await supabase.auth.getUser();
      if(!user){window.location.assign("/account");return}
      const {data:pet,error}=await supabase.from("pets").select("id,name,years,status,pet_assets(kind,storage_path)").eq("id",requestedPet).single();
      if(error)throw error;
      if(!live)return;
      setPetId(pet.id);setName(pet.name||"");setYears(pet.years||"");
      const master=pet.pet_assets?.find(a=>a.kind==="portrait_master"),engraving=pet.pet_assets?.find(a=>a.kind==="portrait_engraving");
      if(master?.storage_path){const {data}=await supabase.storage.from("pet-assets").createSignedUrl(master.storage_path,3600);if(live)setAiPortrait(data?.signedUrl||"")}
      if(engraving?.storage_path){const {data}=await supabase.storage.from("pet-assets").createSignedUrl(engraving.storage_path,3600);if(live)setMedallionPortrait(data?.signedUrl||"")}
      if(live)setStep(pet.status==="portrait_ready"?4:2);
    }else{
      const saved=JSON.parse(sessionStorage.getItem(SESSION_KEY)||"null");
      if(mode==="new"){sessionStorage.removeItem(SESSION_KEY);setStep(1)}
      else if(saved){setOriginal(saved.original||"");setMedallionPortrait(saved.medallionPortrait||"");setName(saved.name||"");setYears(saved.years||"");setMetal(saved.metal||"gold");setPackageType(saved.packageType||"complete");setMemoryText(saved.memoryText||"");setEmail(saved.email||"");setZoom(saved.zoom||1.55);setX(saved.x||50);setY(saved.y||38);setAiPortrait(saved.aiPortrait||"");setStep(saved.step||1)}
    }
  }catch(err){if(live)setError(err.message||"We couldn't load this Pet Identity.")}finally{if(live)setHydrated(true)}})();return()=>{live=false}},[searchParams]);
  useEffect(()=>{if(!hydrated)return;try{sessionStorage.setItem(SESSION_KEY,JSON.stringify({original,medallionPortrait,name,years,step,metal,packageType,memoryText,email,zoom,x,y,aiPortrait}))}catch{}},[hydrated,original,medallionPortrait,name,years,step,metal,packageType,memoryText,email,zoom,x,y,aiPortrait]);

  function pick(e){const file=e.target.files?.[0];if(!file)return;setSourceFile(file);const reader=new FileReader();reader.onload=()=>{setOriginal(String(reader.result));setAiPortrait("");setMedallionPortrait("");setError("");setStep(1)};reader.readAsDataURL(file)}
  async function removeWhiteBackground(blob){const bitmap=await createImageBitmap(blob),canvas=document.createElement("canvas");canvas.width=bitmap.width;canvas.height=bitmap.height;const ctx=canvas.getContext("2d",{willReadFrequently:true});ctx.drawImage(bitmap,0,0);const image=ctx.getImageData(0,0,canvas.width,canvas.height),d=image.data;for(let i=0;i<d.length;i+=4){const r=d[i],g=d[i+1],b=d[i+2],min=Math.min(r,g,b),max=Math.max(r,g,b);if(min>246&&max-min<10)d[i+3]=0;else if(min>226&&max-min<16)d[i+3]=Math.round(255*(246-min)/20)}ctx.putImageData(image,0,0);return canvas.toDataURL("image/png")}
  async function createArtwork(){if(!original||aiWorking)return;setAiWorking(true);setError("");try{const source=await fetch(original).then(r=>r.blob()),form=new FormData();form.append("image",source,"pet-photo.jpg");const response=await fetch("/api/create-portrait",{method:"POST",body:form});if(!response.ok){const info=await response.json().catch(()=>({}));throw new Error(info.error||"Artwork generation failed")}const blob=await response.blob();setAiPortrait(URL.createObjectURL(blob));setMedallionPortrait(await removeWhiteBackground(blob))}catch(err){setError(err.message||"We couldn't create the artwork. Please try again.")}finally{setAiWorking(false)}}
  async function savePetIdentity(){
    if(!name.trim()||saving)return;
    setSaving(true);setError("");
    try{
      const supabase=createClient();
      const {data:{user}}=await supabase.auth.getUser();
      if(!user){window.location.assign("/account");return}
      let id=petId;
      if(!id){
        const {data:pet,error:petError}=await supabase.from("pets").insert({user_id:user.id,name:name.trim(),years:years.trim(),status:aiPortrait?"portrait_ready":"draft"}).select("id").single();
        if(petError)throw petError;
        id=pet.id;setPetId(id);
      }
      const assets=[];
      if(sourceFile){
        const ext=(sourceFile.name.split(".").pop()||"jpg").toLowerCase();
        const path=user.id+"/"+id+"/source."+ext;
        const {error}=await supabase.storage.from("pet-assets").upload(path,sourceFile,{upsert:true,contentType:sourceFile.type});
        if(error)throw error;
        assets.push({pet_id:id,kind:"source_photo",storage_path:path,approved:true});
      }
      if(aiPortrait){
        const blob=await fetch(aiPortrait).then(r=>r.blob()),path=user.id+"/"+id+"/portrait-master.png";
        const {error}=await supabase.storage.from("pet-assets").upload(path,blob,{upsert:true,contentType:"image/png"});
        if(error)throw error;
        assets.push({pet_id:id,kind:"portrait_master",storage_path:path,approved:true});
      }
      if(medallionPortrait){
        const blob=await fetch(medallionPortrait).then(r=>r.blob()),path=user.id+"/"+id+"/portrait-engraving.png";
        const {error}=await supabase.storage.from("pet-assets").upload(path,blob,{upsert:true,contentType:"image/png"});
        if(error)throw error;
        assets.push({pet_id:id,kind:"portrait_engraving",storage_path:path,approved:true});
      }
      for(const asset of assets){
        await supabase.from("pet_assets").delete().eq("pet_id",id).eq("kind",asset.kind);
        const {error}=await supabase.from("pet_assets").insert(asset);
        if(error)throw error;
      }
      setStep(4);window.scrollTo({top:0,behavior:"smooth"});
    }catch(err){setError(err.message||"We couldn't save this Pet Identity.")}
    finally{setSaving(false)}
  }
  const petIdentity=createPetIdentity({id:petId||"session-pet",name,years,sourcePhoto:original,masterPortrait:aiPortrait,engravingPortrait:medallionPortrait});
  const go=n=>{setStep(n);window.scrollTo({top:0,behavior:"smooth"})};
  return <main className="studio-flow">
    <header className="studio-header"><a href="/" className="studio-logo"><img src="/evlenne-logo.png" alt="Evlenne"/></a><p>{searchParams.get("mode")==="existing"&&name ? "Creating with "+name : "Pet Identity Studio"} <span>· Session saved</span></p></header>
    <nav className="studio-progress" aria-label="Order progress">{["Pet","Portrait","Personalize","Piece"].map((label,i)=><button key={label} className={step===i+1?"active":step>i+1?"done":""} onClick={()=>i+1<step&&go(i+1)}><b>0{i+1}</b><span>{label}</span></button>)}</nav>
    {step===1&&<section className="flow-step photo-step"><p className="step">01 · CREATE YOUR PET</p><h1>Start with who they are.</h1><p className="muted">Choose a clear favorite photo. We’ll use it to create the first portrait in their Evlenne Pet Identity.</p><input ref={input} hidden type="file" accept="image/*" onChange={pick}/><button className="upload-dropzone" onClick={()=>input.current?.click()}><span className="upload-icon">↑</span><strong>{original?"Choose another photo":"Upload their photo"}</strong><small>JPG, PNG or HEIC · clear photos work best</small></button><aside className="photo-guidance"><strong>Photo guidance</strong><span>Choose a well-lit photo where their face is easy to see.</span><span>One pet per photo gives the clearest engraving.</span></aside>{original&&<div className="upload-success"><div className="upload-success-head"><span className="upload-check">✓</span><div><strong>Photo uploaded</strong><small>Ready to create their Pet Identity</small></div></div><div className="original-card"><img src={original} alt="Uploaded pet"/><span>YOUR PHOTO</span></div><button className="change-photo" onClick={()=>input.current?.click()}>Choose a different photo</button></div>}{original&&<button className="flow-next" onClick={()=>go(2)}>Create their portrait →</button>}</section>}
    {step===2&&<section className="flow-step" ref={previewRef}><p className="step">02 · PORTRAIT</p><h1>Create their Evlenne portrait.</h1>{!aiPortrait&&<><p className="muted">Generate and review their reusable portrait master. This becomes the visual foundation for the personalized pieces you create with them.</p>{original&&<button className="create-art" disabled={aiWorking} onClick={createArtwork}>{aiWorking?"Creating engraving artwork…":"Create Pet Identity portrait"}</button>}</>}{error&&<div className="artwork-note"><strong>Artwork generation failed.</strong><br/>{error}</div>}{aiPortrait&&<><div className="portrait-review-grid"><div><p className="review-label">PORTRAIT MASTER PREVIEW</p><div className={"medallion portrait-medallion clean-preview "+(metal==="silver"?"silver-preview":"gold-preview")}>{medallionPortrait&&<img className="portrait-cutout clean-cutout" src={medallionPortrait} alt="Laser engraving artwork" style={{left:x+"%",top:y+"%",transform:"translate(-50%,-50%) scale("+zoom+")"}}/>}</div><div className="metal-switch"><button className={metal==="gold"?"active":""} onClick={()=>setMetal("gold")}>GOLD</button><button className={metal==="silver"?"active":""} onClick={()=>setMetal("silver")}>SILVER</button></div></div><div className="controls"><p className="review-label">REVIEW PORTRAIT & FINISH</p><label>Crop size<input type="range" min=".8" max="3" step=".05" value={zoom} onChange={e=>setZoom(+e.target.value)}/></label><label>Left / right<input type="range" min="25" max="75" value={x} onChange={e=>setX(+e.target.value)}/></label><label>Up / down<input type="range" min="10" max="75" value={y} onChange={e=>setY(+e.target.value)}/></label></div></div><button className="create-art secondary-action" disabled={aiWorking} onClick={createArtwork}>{aiWorking?"Creating…":"Regenerate artwork"}</button><button className="flow-next" onClick={()=>go(3)}>Continue to personalize →</button></>}<button className="flow-back" onClick={()=>go(1)}>← Back to photo</button></section>}
    {step===3&&<section className="flow-step"><p className="step">03 · THEIR DETAILS</p><h1>Make the identity theirs.</h1><p className="muted">Add their name and, if you want, the years that are part of their story. Their name becomes part of this Pet Identity.</p><label>Pet name<input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Coco"/></label><label>Years <span className="optional">optional</span><input value={years} onChange={e=>setYears(e.target.value)} placeholder="e.g. 2015 — 2026"/></label><div className="mini-proof"><div className={"mini-medallion "+metal}>{medallionPortrait&&<img src={medallionPortrait} alt="Portrait"/>}</div><div><strong>{name||"Their name"}</strong><span>{years||"Years together"}</span></div></div><button className="flow-next" disabled={!name.trim()||saving} onClick={savePetIdentity}>{saving?"Saving Pet Identity…":"Save & choose their piece →"}</button><button className="flow-back" onClick={()=>go(2)}>← Back to portrait</button></section>}
    {step===4&&<section className="flow-step flow-order"><OrderBuilder metal={metal} setMetal={setMetal} petName={name} years={years} petIdentity={petIdentity} onBack={()=>go(3)}/></section>}
  </main>
}

export default function Studio(){return <Suspense fallback={<main className="studio-shell"><p className="muted">Loading Studio…</p></main>}><StudioContent/></Suspense>}
