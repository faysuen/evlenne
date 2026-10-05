"use client";
import {useEffect,useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {createClient} from "../lib/supabaseClient";

export default function AccountPage(){
 const router=useRouter();
 const [email,setEmail]=useState(""),[message,setMessage]=useState(""),[working,setWorking]=useState(false),[googleWorking,setGoogleWorking]=useState(false);
 useEffect(()=>{if(new URLSearchParams(window.location.search).has("auth_error"))setMessage("This sign-in link is invalid or expired. Please request a new link or try Google.");const supabase=createClient();supabase.auth.getUser().then(({data})=>{if(data.user)router.replace("/pets")})},[router]);
 async function signIn(e){e.preventDefault();setWorking(true);setMessage("");try{const supabase=createClient();const {error}=await supabase.auth.signInWithOtp({email,options:{emailRedirectTo:window.location.origin+"/auth/callback?next=/pets"}});if(error)throw error;setMessage("Check your email for your secure sign-in link.")}catch(err){setMessage(err.message||"Unable to sign in.")}finally{setWorking(false)}}
 async function signInWithGoogle(){setGoogleWorking(true);setMessage("");try{const supabase=createClient();const {error}=await supabase.auth.signInWithOAuth({provider:"google",options:{redirectTo:window.location.origin+"/auth/callback?next=/pets"}});if(error)throw error}catch(err){setMessage(err.message||"Unable to sign in with Google.");setGoogleWorking(false)}}
 return <main className="account-page"><Link href="/" className="studio-logo"><img src="/evlenne-logo-mark.png" alt="Evlenne"/></Link><section className="account-card"><p className="step">YOUR EVLENNE</p><h1>Keep their world with you.</h1><p>Sign in to save Pet Identities and create with them again from any device.</p><button type="button" className="account-google" onClick={signInWithGoogle} disabled={googleWorking}><span aria-hidden="true">G</span>{googleWorking?"Connecting…":"Continue with Google"}</button><div className="account-divider"><span>or</span></div><form onSubmit={signIn}><label>Email<input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></label><button type="submit" disabled={working}>{working?"Sending…":"Email me a sign-in link →"}</button></form>{message&&<p className="account-message">{message}</p>}<p className="account-privacy">Your Pet Identities stay private to your account.</p></section></main>;
}
