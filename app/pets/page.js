"use client";
import Link from "next/link";
import {useEffect,useState} from "react";

const SESSION_KEY="evlenne-studio-session";

export default function PetsPage(){
  const [pet,setPet]=useState(null);
  useEffect(()=>{try{const saved=JSON.parse(sessionStorage.getItem(SESSION_KEY)||"null");if(saved?.name)setPet({name:saved.name,years:saved.years||"",portrait:saved.medallionPortrait||saved.aiPortrait||"",ready:Boolean(saved.medallionPortrait||saved.aiPortrait)})}catch{}},[]);
  return <main className="pets-page">
    <header className="pets-header"><Link href="/" className="studio-logo"><img src="/evlenne-logo.png" alt="Evlenne"/></Link><Link href="/studio" className="pets-create">+ Create a pet</Link></header>
    <section className="pets-hero"><p className="step">YOUR PETS</p><h1>Their world starts here.</h1><p>Each Pet Identity keeps their approved portrait and personal details ready for whatever you create next.</p></section>
    <section className="pets-grid">
      {pet&&<article className="pet-profile-card"><div className="pet-profile-portrait">{pet.portrait?<img src={pet.portrait} alt={pet.name+" portrait"}/>:<span>PORTRAIT</span>}</div><div className="pet-profile-copy"><p>PET IDENTITY</p><h2>{pet.name}</h2>{pet.years&&<span>{pet.years}</span>}<div className="pet-status"><b>PORTRAIT</b><em>{pet.ready?"READY ✓":"IN PROGRESS"}</em></div><div className="pet-status"><b>PAW</b><em>ADD +</em></div><div className="pet-status"><b>FUR</b><em>ADD +</em></div><Link href="/studio" className="pet-create-link">Create with {pet.name} →</Link></div></article>}
      <Link href="/studio" className="add-pet-card"><span>+</span><strong>Add a pet</strong><small>Create another Pet Identity</small></Link>
    </section>
    {!pet&&<p className="pets-empty">Create your first Pet Identity to see them here.</p>}
  </main>;
}
