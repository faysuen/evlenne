"use client";
import {Suspense,useEffect,useRef,useState} from "react";
import {useSearchParams} from "next/navigation";
import {preparePhoto,readPhoto,preparePortraitUpload} from "../lib/preparePhoto";
import atelier from "./atelier.module.css";
import {StudioProgress,PhotoStep,ArtworkStep,FinishStep} from "./Atelier";
import OrderBuilder from "./OrderBuilder";
import {createPetIdentity} from "../lib/petIdentity";
import {createClient} from "../lib/supabaseClient";

const SESSION_KEY="evlenne-studio-session";

const DRAFT_DB="evlenne-studio-draft";
const DRAFT_STORE="sessions";
function openDraftDB(){return new Promise((resolve,reject)=>{if(typeof indexedDB==="undefined"){reject(new Error("IndexedDB unavailable"));return}const req=indexedDB.open(DRAFT_DB,1);req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains(DRAFT_STORE))req.result.createObjectStore(DRAFT_STORE)};req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error||new Error("Draft storage unavailable"))})}
async function readDraft(){try{const db=await openDraftDB();return await new Promise((resolve,reject)=>{const req=db.transaction(DRAFT_STORE,"readonly").objectStore(DRAFT_STORE).get("current");req.onsuccess=()=>resolve(req.result||null);req.onerror=()=>reject(req.error)})}catch{return null}}
async function writeDraft(value){const db=await openDraftDB();return await new Promise((resolve,reject)=>{const tx=db.transaction(DRAFT_STORE,"readwrite");tx.objectStore(DRAFT_STORE).put(value,"current");tx.oncomplete=()=>resolve(true);tx.onerror=()=>reject(tx.error||new Error("Draft write failed"));tx.onabort=()=>reject(tx.error||new Error("Draft write aborted"))})}
async function clearDraft(){try{const db=await openDraftDB();await new Promise((resolve,reject)=>{const req=db.transaction(DRAFT_STORE,"readwrite").objectStore(DRAFT_STORE).delete("current");req.onsuccess=()=>resolve();req.onerror=()=>reject(req.error)})}catch{}}

function StudioContent(){
  const searchParams=useSearchParams();
  const input=useRef(null),photoRequest=useRef(0);
  const [hydrated,setHydrated]=useState(false),[original,setOriginal]=useState(""),[medallionPortrait,setMedallionPortrait]=useState("");
  const [name,setName]=useState(""),[years,setYears]=useState(""),[step,setStep]=useState(1),[metal,setMetal]=useState("gold"),[packageType,setPackageType]=useState("complete"),[memoryText,setMemoryText]=useState(""),[email,setEmail]=useState("");
  const [zoom,setZoom]=useState(1.55),[x,setX]=useState(50),[y,setY]=useState(38),[aiPortrait,setAiPortrait]=useState(""),[aiWorking,setAiWorking]=useState(false),[error,setError]=useState("");
  const [photoBusy,setPhotoBusy]=useState(false),[photoReady,setPhotoReady]=useState(false),[photoError,setPhotoError]=useState("");
  const [sourceFile,setSourceFile]=useState(null),[petId,setPetId]=useState(""),[saving,setSaving]=useState(false);

  useEffect(()=>{let live=true;(async()=>{try{
    const requestedPet=searchParams.get("pet"),mode=searchParams.get("mode");
    if(requestedPet){
      const supabase=createClient();
      const {data:{user}}=await supabase.auth.getUser();
      if(!user){window.location.assign("/account");return}
      const {data:pet,error}=await supabase.from("pets").select("id,name,years,status,pet_assets(kind,storage_path)").eq("id",requestedPet).single();
      if(error)throw error;
      const source=pet.pet_assets?.find(a=>a.kind==="source_photo");
      if(source?.storage_path){const {data}=await supabase.storage.from("pet-assets").createSignedUrl(source.storage_path,3600);if(data?.signedUrl){try{const blob=await fetch(data.signedUrl).then(r=>r.blob());const photo=await preparePhoto(new File([blob],"pet-photo",{type:blob.type}));if(live){setOriginal(photo.url);setSourceFile(photo.file);setPhotoReady(true)}}catch{if(live)setPhotoError("Choose another photo to regenerate this portrait.")}}}
      if(!live)return;
      setPetId(pet.id);setName(pet.name||"");setYears(pet.years||"");
      const master=pet.pet_assets?.find(a=>a.kind==="portrait_master"),engraving=pet.pet_assets?.find(a=>a.kind==="portrait_engraving");
      if(master?.storage_path){const {data}=await supabase.storage.from("pet-assets").createSignedUrl(master.storage_path,3600);if(live)setAiPortrait(data?.signedUrl||"")}
      if(engraving?.storage_path){const {data}=await supabase.storage.from("pet-assets").createSignedUrl(engraving.storage_path,3600);if(live)setMedallionPortrait(data?.signedUrl||"")}
      if(live)setStep(pet.status==="portrait_ready"?4:2);
    }else{
      let saved=null;
      try{saved=JSON.parse(sessionStorage.getItem(SESSION_KEY)||"null")}catch{}
      // sessionStorage is only a small cache. The actual Studio draft (including
      // large photos/portraits) lives in IndexedDB so leaving Studio or navigating
      // to another page cannot silently lose the work when storage quota is exceeded.
      const durable=await readDraft();
      if(durable)saved={...(saved||{}),...durable};
      if(mode==="new"){
        // "new" is a one-time entry instruction. Do not erase an unfinished draft
        // just because the user left Studio and came back through the homepage.
        if(!saved||saved.step>=4){sessionStorage.removeItem(SESSION_KEY);await clearDraft();saved=null;setStep(1)}else{setStep(saved.step||1)}
        window.history.replaceState(null,"","/studio");
      }
      if(saved){if(saved.original){setPhotoBusy(true);try{const blob=await fetch(saved.original).then(r=>r.blob());const restored=await preparePhoto(new File([blob],"pet-photo",{type:blob.type}));if(live){setOriginal(restored.url);setSourceFile(restored.file);setPhotoReady(true)}}catch{if(live)setPhotoError("This photo couldn’t be opened. Choose another photo, or export your iPhone photo as JPG.")}finally{if(live)setPhotoBusy(false)}}setPetId(saved.petId||"");setMedallionPortrait(saved.medallionPortrait||"");setName(saved.name||"");setYears(saved.years||"");setMetal(saved.metal||"gold");setPackageType(saved.packageType||"complete");setMemoryText(saved.memoryText||"");setEmail(saved.email||"");setZoom(saved.zoom||1.55);setX(saved.x||50);setY(saved.y||38);setAiPortrait(saved.aiPortrait||"");setStep(saved.step||1)}
    }
  }catch(err){if(live)setError(err.message||"We couldn't load this Pet Identity.")}finally{if(live)setHydrated(true)}})();return()=>{live=false}},[searchParams]);
  useEffect(()=>{if(!hydrated)return;const draft={original,medallionPortrait,name,years,step,metal,packageType,memoryText,email,zoom,x,y,aiPortrait,petId};
    // Keep a lightweight copy in sessionStorage and the complete draft in IndexedDB.
    // This avoids the silent 5 MB-class Web Storage quota problem with photo data URLs.
    try{sessionStorage.setItem(SESSION_KEY,JSON.stringify({...draft,original:"",medallionPortrait:"",aiPortrait:""}))}catch{}
    writeDraft(draft);
  },[hydrated,original,medallionPortrait,name,years,step,metal,packageType,memoryText,email,zoom,x,y,aiPortrait,petId]);

  async function pick(e){
    const file=e.target.files?.[0];if(!file)return;e.target.value="";
    const request=++photoRequest.current;
    if(file.size>20*1024*1024){setPhotoBusy(false);setPhotoError("Choose a photo smaller than 20 MB.");setPhotoReady(false);return;}
    setPhotoBusy(true);setPhotoReady(false);setPhotoError("");setOriginal("");setSourceFile(null);setAiPortrait("");setMedallionPortrait("");setError("");setStep(1);
    try{const photo=await preparePhoto(file);if(request!==photoRequest.current)return;setOriginal(photo.url);setSourceFile(photo.file);setPhotoReady(true)}
    catch{if(request===photoRequest.current)setPhotoError("This photo couldn’t be opened. Choose another photo, or export your iPhone photo as JPG.")}
    finally{if(request===photoRequest.current)setPhotoBusy(false)}
  }
  async function removeWhiteBackground(blob){
    const bitmap=await createImageBitmap(blob),canvas=document.createElement("canvas");canvas.width=bitmap.width;canvas.height=bitmap.height;
    const ctx=canvas.getContext("2d",{willReadFrequently:true});ctx.drawImage(bitmap,0,0);bitmap.close();
    const image=ctx.getImageData(0,0,canvas.width,canvas.height),d=image.data,w=canvas.width,h=canvas.height;
    // Remove only near-white background connected to an edge; preserve white fur inside the portrait.
    const seen=new Uint8Array(w*h),queue=new Uint32Array(w*h);let head=0,tail=0;
    function visit(p){if(seen[p])return;seen[p]=1;const i=p*4,min=Math.min(d[i],d[i+1],d[i+2]),max=Math.max(d[i],d[i+1],d[i+2]);if(d[i+3]===0||(min>226&&max-min<16))queue[tail++]=p;}
    for(let col=0;col<w;col++){visit(col);visit((h-1)*w+col)}for(let row=0;row<h;row++){visit(row*w);visit(row*w+w-1)}
    while(head<tail){const p=queue[head++],i=p*4,min=Math.min(d[i],d[i+1],d[i+2]);d[i+3]=min>246?0:Math.min(d[i+3],Math.round(255*(246-min)/20));const col=p%w;if(col>0)visit(p-1);if(col<w-1)visit(p+1);if(p>=w)visit(p-w);if(p<(h-1)*w)visit(p+w);}
    ctx.putImageData(image,0,0);return canvas.toDataURL("image/png");
  }
  async function createArtwork(){
    if(!original||!photoReady||photoBusy||aiWorking)return;
    setAiWorking(true);setError("");
    const controller=new AbortController(),timeout=window.setTimeout(()=>controller.abort(),115000);
    try{
      const source=await preparePortraitUpload(original),form=new FormData();
      form.append("image",source,"pet-photo.jpg");
      const response=await fetch("/api/create-portrait",{method:"POST",body:form,signal:controller.signal});
      if(!response.ok){
        const info=await response.json().catch(()=>({}));
        throw new Error(info.error||(response.status===413?"This photo was too large to send. Please refresh Studio and try again.":response.status===504?"Portrait generation took too long. Please try again.":"Portrait generation failed. Please try again."));
      }
      const portrait=await readPhoto(await response.blob());
      const durableDraft={original,medallionPortrait:portrait,name,years,step:2,metal,packageType,memoryText,email,zoom,x,y,aiPortrait:portrait,petId};
      await writeDraft(durableDraft);
      try{sessionStorage.setItem(SESSION_KEY,JSON.stringify({...durableDraft,original:"",medallionPortrait:"",aiPortrait:""}))}catch{}
      setAiPortrait(portrait);setMedallionPortrait(portrait);setStep(2);
    }catch(err){
      setError(err.name==="AbortError"?"Portrait generation took too long. Please try again.":err.message||"We couldn't create the artwork. Please try again.");
    }finally{window.clearTimeout(timeout);setAiWorking(false)}
  }
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
  return <main className={`${atelier.studio} studio-atelier`}>
    <StudioProgress step={step} go={go}/>
    {step===1&&<PhotoStep {...{input,pick,original,photoReady,photoBusy,photoError,setPhotoReady,setPhotoError,go}}/>}
    {step===2&&<ArtworkStep {...{name,original,aiPortrait,medallionPortrait,aiWorking,error,createArtwork,zoom,setZoom,x,setX,y,setY,go}}/>}
    {step===3&&<FinishStep {...{name,setName,years,setYears,metal,setMetal,medallionPortrait,zoom,x,y,saving,error,savePetIdentity,go}}/>}
    {step===4&&<section className="flow-step flow-order"><OrderBuilder metal={metal} setMetal={setMetal} petName={name} years={years} petIdentity={petIdentity} onBack={()=>go(3)}/></section>}
  </main>
}

export default function Studio(){return <Suspense fallback={<main className="studio-shell"><p className="muted">Loading Studio…</p></main>}><StudioContent/></Suspense>}
