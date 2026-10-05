import {createServerClient} from "@supabase/ssr";
import {NextResponse} from "next/server";

export const dynamic="force-dynamic";

export async function GET(request){
  const url=new URL(request.url);
  const next=url.searchParams.get("next") || "/pets";
  // Only allow redirects within this origin, including encoded/backslash cases.
  let destination=new URL("/pets",url.origin);
  if(next.startsWith("/") && !next.startsWith("//")){
    const candidate=new URL(next,url.origin);
    if(candidate.origin===url.origin && !candidate.pathname.startsWith("/auth/"))destination=candidate;
  }
  const response=NextResponse.redirect(destination);
  response.headers.set("Cache-Control","private, no-store");
  const supabase=createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {cookies:{
      getAll(){return request.cookies.getAll();},
      setAll(cookiesToSet){cookiesToSet.forEach(({name,value,options})=>{
        request.cookies.set(name,value);
        response.cookies.set(name,value,options);
      });}
    }}
  );
  const code=url.searchParams.get("code");
  const tokenHash=url.searchParams.get("token_hash");
  const type=url.searchParams.get("type");
  let error=true;
  if(!url.searchParams.has("error")){
    if(code){({error}=await supabase.auth.exchangeCodeForSession(code));}
    else if(tokenHash && ["email","magiclink","signup","invite","recovery","email_change"].includes(type)){
      ({error}=await supabase.auth.verifyOtp({token_hash:tokenHash,type}));
    }
  }
  if(error){
    response.headers.set("Location",new URL("/account?auth_error=1",url.origin).toString());
  }
  // Return the SAME response that received Set-Cookie during the exchange.
  return response;
}
