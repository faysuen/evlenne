import {createServerClient} from "@supabase/ssr";
import {NextResponse} from "next/server";

export async function middleware(request){
  let response=NextResponse.next({request});
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if(!url || !key)return response;
  const supabase=createServerClient(url,key,{cookies:{
    getAll(){return request.cookies.getAll();},
    setAll(cookiesToSet){
      cookiesToSet.forEach(({name,value})=>request.cookies.set(name,value));
      response=NextResponse.next({request});
      cookiesToSet.forEach(({name,value,options})=>response.cookies.set(name,value,options));
    }
  }});
  // Verify with Auth and refresh both request and response cookies.
  const {data:{user}}=await supabase.auth.getUser();
  if(user && request.nextUrl.pathname==="/account"){
    const redirect=NextResponse.redirect(new URL("/pets",request.url));
    response.cookies.getAll().forEach(cookie=>redirect.cookies.set(cookie));
    response=redirect;
  }
  response.headers.set("Cache-Control","private, no-store");
  return response;
}

export const config={matcher:["/account","/pets/:path*","/studio/:path*"]};
