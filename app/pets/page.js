"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
import {createClient} from "../lib/supabaseClient";
import styles from "./pets.module.css";

function Plus(){return <span className={styles.plus} aria-hidden="true">+</span>}
function Arrow(){return <span className={styles.arrow} aria-hidden="true">→</span>}
function Download(){return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 20h14"/></svg>}
function Trash(){return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M10 11v6m4-6v6M9 7l.7-2h4.6l.7 2M6.5 7l.8 12h9.4l.8-12"/></svg>}
function Paw({portrait=false}){return <span className={portrait?styles.portraitPaw:styles.paw} aria-hidden="true"><img src={portrait?"/brand/pets-portrait-paw.svg":"/brand/pets-paw.svg"} alt=""/></span>}
function PetCard({pet,deletingId,deletePet}){return <article className={styles.card}><Link className={styles.portrait} href={"/studio?pet="+pet.id} aria-label={"View "+pet.name}>{pet.portraitUrl?<img src={pet.portraitUrl} alt={pet.name+" portrait"}/>:<div className={styles.portraitPending}><Paw portrait/><span>Their portrait is taking shape</span></div>}</Link><div className={styles.cardCopy}><p className={styles.eyebrow}>PET IDENTITY</p><h2>{pet.name}</h2>{pet.years&&<p className={styles.years}>{pet.years}</p>}<div className={styles.features}><span>Portrait <b>{pet.status==="portrait_ready"?"Ready":"In progress"}</b></span><span>Paw <b>{pet.pet_assets?.some(a=>a.kind==="paw")?"Added":"Not added"}</b></span><span>Fur <b>Ready for keepsake</b></span></div>{pet.portraitUrl&&<a href={pet.portraitUrl} download={`${pet.name}-evlenne-portrait.png`} className={styles.downloadPortrait}><span><Download/>Download portrait</span><Arrow/></a>}<Link href={`/pets/${pet.id}/paw`} className={styles.pawLink}>{pet.pet_assets?.some(a=>a.kind==="paw")?"Update paw print":"Add paw print"}<Arrow/></Link><div className={styles.cardActions}><Link href={"/studio?pet="+pet.id} className={styles.cardLink}>Create with {pet.name}<Arrow/></Link><button type="button" className={styles.removePet} onClick={()=>deletePet(pet)} disabled={Boolean(deletingId)} aria-label={`Remove ${pet.name}`} title={`Remove ${pet.name}`}>{deletingId===pet.id?<span className={styles.removing} aria-hidden="true"/>:<Trash/>}</button></div></div></article>}

export default function PetsPage(){
 const [pets,setPets]=useState([]),[loading,setLoading]=useState(true),[signedIn,setSignedIn]=useState(false),[error,setError]=useState(""),[deletingId,setDeletingId]=useState("");
 useEffect(()=>{let live=true;(async()=>{try{
   const supabase=createClient();const {data:{user},error:authError}=await supabase.auth.getUser();
   if(authError && authError.name!=="AuthSessionMissingError")throw authError;
   if(!user)return;
   if(live)setSignedIn(true);
   const {data,error:queryError}=await supabase.from("pets").select("id,name,years,status,pet_assets(id,kind,storage_path,approved)").order("created_at",{ascending:false});
   if(queryError)throw queryError;
   const hydrated=await Promise.all((data||[]).map(async pet=>{
     const portrait=pet.pet_assets?.find(a=>a.kind==="portrait_engraving"||a.kind==="portrait_master");let portraitUrl="";
     if(portrait?.storage_path){const {data:signed}=await supabase.storage.from("pet-assets").createSignedUrl(portrait.storage_path,3600);portraitUrl=signed?.signedUrl||"";}
     return {...pet,portraitUrl};
   }));if(live)setPets(hydrated);
 }catch{if(live)setError("We couldn’t load your pets. Please try again.");}finally{if(live)setLoading(false);}})();return()=>{live=false};},[]);
 async function deletePet(pet){
   if(deletingId||!window.confirm(`Remove ${pet.name} and their saved portrait? This can’t be undone.`))return;
   setDeletingId(pet.id);setError("");
   try{
     const supabase=createClient();
     const paths=(pet.pet_assets||[]).map(asset=>asset.storage_path).filter(Boolean);
     if(paths.length){const {error:storageError}=await supabase.storage.from("pet-assets").remove(paths);if(storageError)throw storageError;}
     const {error:deleteError}=await supabase.from("pets").delete().eq("id",pet.id);
     if(deleteError)throw deleteError;
     setPets(current=>current.filter(item=>item.id!==pet.id));
   }catch(err){setError(err.message||"We couldn’t remove this pet. Please try again.");}
   finally{setDeletingId("");}
 }
 return <PetsView {...{pets,loading,signedIn,error,deletingId,deletePet}}/>;
}

export function PetsView({pets=[],loading=false,signedIn=false,error="",deletingId="",deletePet=()=>{}}){
 return <main className={styles.page}>
  <section className={styles.heading}><div><p className={styles.eyebrow}>YOUR EVLENNE WORLD</p><h1>My pets.</h1><p>One identity for every piece you make with them.</p></div></section>
  {error?<section className={styles.empty} role="alert"><span className={styles.emblem}><Paw/></span><h2>Let’s try that again.</h2><p>{error}</p><button className={styles.primary} onClick={()=>window.location.reload()}>Try again <Arrow/></button></section>
   :loading?<div className={styles.loading} role="status"><div className={styles.skeleton}/><div className={styles.skeleton}/><div className={styles.skeleton}/><span>Loading your pets…</span></div>
   :!signedIn?<section className={styles.empty}><span className={styles.emblem}><Paw/></span><p className={styles.eyebrow}>A PLACE FOR THEIR WORLD</p><h2>Keep them close.<br/><em>Come back anytime.</em></h2><p>Sign in to find your pets, their portraits and the pieces you create together.</p><Link href="/account" className={styles.primary}>Sign in to your account <Arrow/></Link></section>
   :pets.length===0?<section className={styles.empty}><span className={styles.emblem}><Paw/></span><p className={styles.eyebrow}>EVERY WORLD STARTS WITH ONE PET</p><h2>Make a little space<br/><em>just for them.</em></h2><p>Start with a favorite photo. We’ll keep their portrait and personal details together, ready for every piece you create.</p><Link href="/studio?mode=new" className={styles.primary}><Plus/>Create your first pet</Link><span className={styles.note}>Their photo. Their personality. A world made personal.</span></section>
   :<section className={styles.collection} aria-label="Your pet identities"><div className={styles.grid}>{pets.map(pet=><PetCard key={pet.id} pet={pet} deletingId={deletingId} deletePet={deletePet}/>)}<Link href="/studio?mode=new" className={styles.addCard}><span><Plus/></span><h2>Another pet.<br/>Another world.</h2><p>Add someone else you love.</p><b>Create a pet <Arrow/></b></Link></div></section>}
  {!loading&&!error&&<aside className={styles.details}><div><span>01</span><h3>A portrait of their own</h3><p>Made from a photo you love.</p></div><div><span>02</span><h3>All the little details</h3><p>Their name, their story, their identity.</p></div><div><span>03</span><h3>Create with them again</h3><p>One pet, a growing world of pieces.</p></div></aside>}
 </main>;
}
