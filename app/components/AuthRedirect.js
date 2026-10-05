"use client";
import {useEffect} from "react";
import {createClient} from "../lib/supabaseClient";

// Older emails may return to Site URL instead of the callback route.
export default function AuthRedirect(){
  useEffect(()=>{
    const url=new URL(window.location.href);
    if(url.pathname.startsWith("/auth/"))return;
    const code=url.searchParams.get("code");
    const tokenHash=url.searchParams.get("token_hash");
    if(code || tokenHash){
      const callback=new URL("/auth/callback",url.origin);
      if(code)callback.searchParams.set("code",code);
      if(tokenHash){callback.searchParams.set("token_hash",tokenHash);callback.searchParams.set("type",url.searchParams.get("type") || "email");}
      callback.searchParams.set("next","/pets");
      window.location.replace(callback.toString());
      return;
    }
    const hash=new URLSearchParams(url.hash.slice(1));
    if(hash.has("access_token") && hash.has("refresh_token")){
      // The browser client initializes legacy implicit sessions from the fragment.
      (async()=>{try{
        const {data:{user},error}=await createClient().auth.getUser();
        window.history.replaceState(null,"",url.pathname);
        window.location.replace(user && !error ? "/pets" : "/account?auth_error=invalid_link");
      }catch{window.history.replaceState(null,"",url.pathname);window.location.replace("/account?auth_error=invalid_link");}})();
    }else if(hash.has("error") || url.searchParams.has("error")){
      window.history.replaceState(null,"",url.pathname);
      window.location.replace("/account?auth_error=invalid_link");
    }
  },[]);
  return null;
}
