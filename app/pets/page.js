"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
import {createClient} from "../lib/supabaseClient";

export default function PetsPage(){
 const [pets,setPets]=useState([]),[loading,setLoading]=useState(true),[signedIn,setSignedIn]=useState(true),[email,setEmail]=useState("");
 useEffect(()=>{let live=true;(async()=>{try{const supabase=createClient();const {data:{user}}=await supabase.auth.getUser();if(!user){if(live){setSignedIn(false);setLoading(false)}return}if(live)setEmail(user.email||"");const {data,error}=await supabase.from("pets").select("id,name,years,status,pet_assets(id,kind,storage_path,approved)").order("created_at",{ascending:false});if(error)throw error;const hydrated=await Promise.all((data||[]).map(async pet=>{const portrait=pet.pet_assets?.find(a=>a.kind==="portrait_engraving"||a.kind==="portrait_master");let portraitUrl="";if(portrait?.storage_path){const {data:signed}=await supabase.storage.from("pet-assets").createSignedUrl(portrait.storage_path,3600);portraitUrl=signed?.signedUrl||""}return {...pet,portraitUrl}}));if(live)setPets(hydrated)}catch(e){console.error(e)}finally{if(live)setLoading(false)}})();return()=>{live=false}},[]);
 if(loading)return <main className="pets-page"><p className="pets-empty">Loading your pets…</p></main>;
 async function signOut(){const supabase=createClient();await supabase.auth.signOut();window.location.assign("/");}
 if(!signedIn)return <main className="pets-page"><section className="pets-hero"><p className="step">YOUR PETS</p><h1>Their world starts here.</h1><p>Sign in to keep every Pet Identity ready across devices.</p><Link href="/account" className="pet-create-link">Sign in →</Link></section></main>;
 return <main className="pets-page">
  <div className="pets-header"><div className="pets-account-actions"><span>{email}</span><Link href="/studio?mode=new" className="pets-create">+ Create a pet</Link><button type="button" className="pets-signout" onClick={signOut}>Sign out</button></div></div>
  <section className="pets-hero"><p className="step">YOUR PETS</p><h1>Their world starts here.</h1><p>Each Pet Identity keeps their approved portrait and personal details ready for whatever you create next.</p></section>
  <section className="pets-grid">{pets.map(pet=>{const paw=pet.pet_assets?.some(a=>a.kind==="paw"),fur=pet.pet_assets?.some(a=>a.kind==="fur");return <article className="pet-profile-card" key={pet.id}><div className="pet-profile-portrait">{pet.portraitUrl?<img src={pet.portraitUrl} alt={pet.name+" portrait"}/>:<span>PORTRAIT</span>}</div><div className="pet-profile-copy"><p>PET IDENTITY</p><h2>{pet.name}</h2>{pet.years&&<span>{pet.years}</span>}<div className="pet-status"><b>PORTRAIT</b><em>{pet.status==="portrait_ready"?"READY ✓":"IN PROGRESS"}</em></div><div className="pet-status"><b>PAW</b><em>{paw?"READY ✓":"ADD +"}</em></div><div className="pet-status"><b>FUR</b><em>{fur?"READY ✓":"ADD +"}</em></div><Link href={"/studio?pet="+pet.id} className="pet-create-link">Create with {pet.name} →</Link></div></article>})}<Link href="/studio?mode=new" className="add-pet-card"><span>+</span><strong>Add a pet</strong><small>Create another Pet Identity</small></Link></section>
  {!pets.length&&<p className="pets-empty">Create your first Pet Identity to see them here.</p>}
 </main>;
}
