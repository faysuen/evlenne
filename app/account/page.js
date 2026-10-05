"use client";
import {useState} from "react";
import Link from "next/link";
import {createClient} from "../lib/supabaseClient";

export default function AccountPage(){
 const [email,setEmail]=useState(""),[message,setMessage]=useState(""),[working,setWorking]=useState(false);
 async function signIn(e){e.preventDefault();setWorking(true);setMessage("");try{const supabase=createClient();const {error}=await supabase.auth.signInWithOtp({email,options:{emailRedirectTo:window.location.origin+"/pets"}});if(error)throw error;setMessage("Check your email for your secure sign-in link.")}catch(err){setMessage(err.message||"Unable to sign in.")}finally{setWorking(false)}}
 return <main className="account-page"><Link href="/" className="studio-logo"><img src="/evlenne-logo.png" alt="Evlenne"/></Link><section className="account-card"><p className="step">YOUR EVLENNE</p><h1>Keep their world with you.</h1><p>Sign in with your email to save Pet Identities and create with them again from any device.</p><form onSubmit={signIn}><label>Email<input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></label><button type="submit" disabled={working}>{working?"Sending…":"Email me a sign-in link →"}</button></form>{message&&<p className="account-message">{message}</p>}</section></main>;
}
