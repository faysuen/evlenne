"use client";
import {Suspense,useEffect,useRef,useState} from "react";
import {useSearchParams} from "next/navigation";
import {preparePhoto,readPhoto,preparePortraitUpload} from "../lib/preparePhoto";
import atelier from "./atelier.module.css";
import {StudioProgress,ProductStep,PhotoStep,ArtworkStep,FinishStep} from "./Atelier";
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
  const [hydrated,setHydrated]=useState(false),[original,setOriginal]=useState(""),[medallionPortrait,setMedallionPortrait]=useState(""),[selectedProduct,setSelectedProduct]=useState(()=>searchParams.get("product")||"portrait-coin");
  const [name,setName]=useState(""),[years,setYears]=useState(""),[step,setStep]=useState(1),[metal,setMetal]=useState("gold"),[packageType,setPackageType]=useState("complete"),[memoryText,setMemoryText]=useState(""),[email,setEmail]=useState("");
  const [rotation,setRotation]=useState(0),[zoom,setZoom]=useState(1.55),[x,setX]=useState(50),[y,setY]=useState(50),[aiPortrait,setAiPortrait]=useState(""),[aiWorking,setAiWorking]=useState(false),[error,setError]=useState("");
  const [photoBusy,setPhotoBusy]=useState(false),[photoReady,setPhotoReady]=useState(false),[photoError,setPhotoError]=useState("");
  const [sourceFile,setSourceFile]=useState(null),[petId,setPetId]=useState(""),[saving,setSaving]=useState(false);

  useEffect(()=>{let live=true;(async()=>{try{
    const requestedPet=searchParams.get("pet"),mode=searchParams.get("mode");
    if(mode==="discard"){
      sessionStorage.removeItem(SESSION_KEY);
      await clearDraft();
      if(live){setStep(1);setPetId("");setSelectedProduct("portrait-coin");}
      window.history.replaceState(null,"","/studio");
      return;
    }
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
      if(master?.storage_path){const {data}=await supabase.storage.from("pet-assets").createSignedUrl(master.storage_path,3600);if(live)setMedallionPortrait(data?.signedUrl||"")}else if(engraving?.storage_path){const {data}=await supabase.storage.from("pet-assets").createSignedUrl(engraving.storage_path,3600);if(live)setMedallionPortrait(data?.signedUrl||"")}
      if(live)setStep(3);
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
        if(!saved||saved.step>=5){sessionStorage.removeItem(SESSION_KEY);await clearDraft();saved=null;setStep(1)}else{setStep(saved.step||1)}
        window.history.replaceState(null,"","/studio");
      }
      if(saved){if(saved.original){setPhotoBusy(true);try{const blob=await fetch(saved.original).then(r=>r.blob());const restored=await preparePhoto(new File([blob],"pet-photo",{type:blob.type}));if(live){setOriginal(restored.url);setSourceFile(restored.file);setPhotoReady(true)}}catch{if(live)setPhotoError("This photo couldn’t be opened. Choose another photo, or export your iPhone photo as JPG.")}finally{if(live)setPhotoBusy(false)}}setSelectedProduct(searchParams.get("product")||saved.selectedProduct||"portrait-coin");setPetId(saved.petId||"");setMedallionPortrait(saved.medallionPortrait||"");setName(saved.name||"");setYears(saved.years||"");setMetal(saved.metal||"gold");setPackageType(saved.packageType||"complete");setMemoryText(saved.memoryText||"");setEmail(saved.email||"");setRotation(Number(saved.rotation)||0);setZoom(saved.zoom||1.55);setX(saved.x||50);setY(saved.y||38);setAiPortrait(saved.aiPortrait||"");setStep(saved.step||1)}
    }
  }catch(err){if(live)setError(err.message||"We couldn't load this Pet Identity.")}finally{if(live)setHydrated(true)}})();return()=>{live=false}},[searchParams]);
  useEffect(()=>{if(!hydrated)return;const draft={rotation,selectedProduct,original,medallionPortrait,name,years,step,metal,packageType,memoryText,email,zoom,x,y,aiPortrait,petId};
    // Keep a lightweight copy in sessionStorage and the complete draft in IndexedDB.
    // This avoids the silent 5 MB-class Web Storage quota problem with photo data URLs.
    try{sessionStorage.setItem(SESSION_KEY,JSON.stringify({...draft,original:"",medallionPortrait:"",aiPortrait:""}))}catch{}
    writeDraft(draft);
  },[hydrated,rotation,selectedProduct,original,medallionPortrait,name,years,step,metal,packageType,memoryText,email,zoom,x,y,aiPortrait,petId]);

  async function pick(e){
    const file=e.target.files?.[0];if(!file)return;e.target.value="";
    const request=++photoRequest.current;
    if(file.size>20*1024*1024){setPhotoBusy(false);setPhotoError("Choose a photo smaller than 20 MB.");setPhotoReady(false);return;}
    setPhotoBusy(true);setPhotoReady(false);setPhotoError("");setOriginal("");setSourceFile(null);setAiPortrait("");setMedallionPortrait("");setRotation(0);setError("");setStep(2);
    try{const photo=await preparePhoto(file);if(request!==photoRequest.current)return;setOriginal(photo.url);setSourceFile(photo.file);setPhotoReady(true)}
    catch{if(request===photoRequest.current)setPhotoError("This photo couldn’t be opened. Choose another photo, or export your iPhone photo as JPG.")}
    finally{if(request===photoRequest.current)setPhotoBusy(false)}
  }
  async function removeWhiteBackground(blob){
    // Engraving artwork is dark linework on a light background. Convert paper
    // brightness to transparency EVERYWHERE, including white pockets between
    // fur strokes. Edge-only flood fill leaves visible white islands on metal.
    const bitmap=await createImageBitmap(blob);
    const canvas=document.createElement("canvas");
    canvas.width=bitmap.width;canvas.height=bitmap.height;
    const ctx=canvas.getContext("2d",{willReadFrequently:true});
    if(!ctx){bitmap.close();throw new Error("Could not prepare the transparent engraving artwork.");}
    ctx.drawImage(bitmap,0,0);bitmap.close();
    const image=ctx.getImageData(0,0,canvas.width,canvas.height);
    const d=image.data;
    for(let i=0;i<d.length;i+=4){
      const existingAlpha=d[i+3]/255;
      const luminance=.2126*d[i]+.7152*d[i+1]+.0722*d[i+2];
      // White/off-white paper disappears; fine gray anti-aliased strokes remain.
      const ink=Math.max(0,Math.min(1,(244-luminance)/190));
      d[i]=29;d[i+1]=25;d[i+2]=22;
      d[i+3]=Math.round(255*ink*existingAlpha);
    }
    ctx.putImageData(image,0,0);
    return canvas.toDataURL("image/png");
  }
  async function createArtwork(){
    if(!original||!photoReady||photoBusy||aiWorking)return;
    setAiWorking(true);setError("");
    const controller=new AbortController(),timeout=window.setTimeout(()=>controller.abort(),115000);
    try{
      const source=await preparePortraitUpload(original),form=new FormData();
      form.append("image",source,"pet-photo.jpg");
      form.append("detail",["portrait-coin"].includes(selectedProduct)?"keepsake":"jewelry");
      const response=await fetch("/api/create-portrait",{method:"POST",body:form,signal:controller.signal});
      if(!response.ok){
        const info=await response.json().catch(()=>({}));
        throw new Error(info.error||(response.status===413?"This photo was too large to send. Please refresh Studio and try again.":response.status===504?"Portrait generation took too long. Please try again.":"Portrait generation failed. Please try again."));
      }
      const portrait=await removeWhiteBackground(await response.blob());
      setRotation(0);
      const durableDraft={rotation:0,selectedProduct,original,medallionPortrait:portrait,name,years,step:3,metal,packageType,memoryText,email,zoom,x,y,aiPortrait:portrait,petId};
      await writeDraft(durableDraft);
      try{sessionStorage.setItem(SESSION_KEY,JSON.stringify({...durableDraft,original:"",medallionPortrait:"",aiPortrait:""}))}catch{}
      setAiPortrait(portrait);setMedallionPortrait(portrait);setStep(3);
    }catch(err){
      setError(err.name==="AbortError"?"Portrait generation took too long. Please try again.":err.message||"We couldn't create the artwork. Please try again.");
    }finally{window.clearTimeout(timeout);setAiWorking(false)}
  }
  async function rotateEngraving(dataUrl,angle){
    if(!angle)return fetch(dataUrl).then(r=>r.blob());
    const source=await fetch(dataUrl).then(r=>r.blob());
    const bitmap=await createImageBitmap(source);
    const radians=angle*Math.PI/180;
    const width=Math.ceil(Math.abs(bitmap.width*Math.cos(radians))+Math.abs(bitmap.height*Math.sin(radians)));
    const height=Math.ceil(Math.abs(bitmap.width*Math.sin(radians))+Math.abs(bitmap.height*Math.cos(radians)));
    const canvas=document.createElement("canvas");canvas.width=width;canvas.height=height;
    const context=canvas.getContext("2d");
    if(!context){bitmap.close();throw new Error("Could not rotate engraving artwork.");}
    context.translate(width/2,height/2);context.rotate(radians);
    context.drawImage(bitmap,-bitmap.width/2,-bitmap.height/2);bitmap.close();
    return await new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error("Could not export rotated artwork.")),"image/png"));
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
      if(petId){const {error:updateError}=await supabase.from("pets").update({name:name.trim(),years:years.trim(),status:"portrait_ready"}).eq("id",id).eq("user_id",user.id);if(updateError)throw updateError;}
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
        const blob=await rotateEngraving(medallionPortrait,rotation),path=user.id+"/"+id+"/portrait-engraving.png";
        const {error}=await supabase.storage.from("pet-assets").upload(path,blob,{upsert:true,contentType:"image/png"});
        if(error)throw error;
        assets.push({pet_id:id,kind:"portrait_engraving",storage_path:path,approved:true});
      }
      for(const asset of assets){
        await supabase.from("pet_assets").delete().eq("pet_id",id).eq("kind",asset.kind);
        const {error}=await supabase.from("pet_assets").insert(asset);
        if(error)throw error;
      }
      setStep(5);window.scrollTo({top:0,behavior:"smooth"});
    }catch(err){setError(err.message||"We couldn't save this Pet Identity.")}
    finally{setSaving(false)}
  }
  const petIdentity=createPetIdentity({id:petId||"session-pet",name,years,sourcePhoto:original,masterPortrait:aiPortrait,engravingPortrait:medallionPortrait});
  const go=n=>{setStep(n);window.scrollTo({top:0,behavior:"smooth"})};
  function discardSession(){
    if(aiWorking||saving)return;
    if(!window.confirm("Discard this Studio session? Your unsaved photo, portrait, and customization will be removed from this device. Saved pets in My Pets will not be deleted."))return;
    // A full navigation avoids stale state effects writing the discarded draft back.
    window.location.assign("/studio?mode=discard");
  }
  return <main className={`${atelier.studio} studio-atelier`}>
    <StudioProgress step={step} go={go}/>
    {hydrated&&<div className={atelier.discardBar}><button type="button" className={atelier.discardButton} onClick={discardSession} disabled={aiWorking||saving}>Discard session</button></div>}
    {step===1&&<ProductStep {...{selectedProduct,setSelectedProduct,go}}/>}
    {step===2&&<PhotoStep {...{input,pick,original,photoReady,photoBusy,photoError,setPhotoReady,setPhotoError,go}}/>}
    {step===3&&<ArtworkStep {...{name,original,aiPortrait,medallionPortrait,aiWorking,error,createArtwork,rotation,setRotation,zoom,setZoom,x,setX,y,setY,go,petId,saving,savePetIdentity}}/>}
    {step===4&&<FinishStep {...{selectedProduct,name,setName,years,setYears,metal,setMetal,medallionPortrait,rotation,zoom,x,y,saving,error,savePetIdentity,go}}/>}
    {step===5&&<section className="flow-step flow-order"><OrderBuilder initialProduct={selectedProduct} metal={metal} setMetal={setMetal} petName={name} years={years} petIdentity={petIdentity} onBack={()=>go(4)}/></section>}
  </main>
}

export default function Studio(){return <Suspense fallback={<main className="studio-shell"><p className="muted">Loading Studio…</p></main>}><StudioContent/></Suspense>}
