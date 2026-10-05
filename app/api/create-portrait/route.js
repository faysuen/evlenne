export const runtime = "nodejs";
export const maxDuration = 120;

const PROMPT = `Create a clean black-and-white engraving portrait of the SAME pet in the reference photo, designed as a reusable master portrait for the Evlenne Pet Identity system. The same master must remain recognizable and adaptable across small metal jewelry, portrait coins, leather accessories, travel pieces, and future personalized products.

Preserve the pet's identity exactly: face shape, eye size and spacing, expression, nose and muzzle shape, ears, markings, and distinctive features. Do not beautify, breed-standardize, or invent features.

Show the head and a small amount of upper chest, centered, following the source pose. Remove the original scene and use a pure white background.

Use an elegant, restrained engraving style with clean selective linework. Keep white or light fur mostly as clean white negative space instead of drawing every strand. Use fewer, cleaner lines and prioritize likeness over fur texture. Concentrate detail around the facial features and silhouette.

Keep the eyes recognizable and natural. Avoid dark rings around the eyes. Keep highlights in the eyes. Avoid overly dark nose shading or large solid-black areas.

No pencil-sketch texture, dense crosshatching, noisy micro-lines, edge-detection look, cartoon styling, stencil styling, heavy outlines, scenery, border, text, or decorative elements.

Final result: a refined, highly recognizable master portrait of this specific pet. Keep the composition product-neutral and scalable: clear enough for a 30 mm engraving, elegant enough for jewelry, and consistent enough to reuse across the Evlenne product library.`;

export async function POST(request) {
  try {
    const key=process.env.OPENAI_API_KEY;
    if(!key) return Response.json({error:"OpenAI API key is not configured."},{status:500});
    const incoming=await request.formData();
    const image=incoming.get("image");
    if(!image || typeof image==="string") return Response.json({error:"No image uploaded."},{status:400});
    if(image.size>20*1024*1024) return Response.json({error:"Image is too large."},{status:413});

    const bytes=Buffer.from(await image.arrayBuffer());
    const dataUrl=`data:${image.type||"image/jpeg"};base64,${bytes.toString("base64")}`;
    const response=await fetch("https://api.openai.com/v1/images/edits",{
      method:"POST",
      headers:{"Authorization":`Bearer ${key}`,"Content-Type":"application/json"},
      body:JSON.stringify({
        model:"gpt-image-2",
        images:[{image_url:dataUrl}],
        prompt:PROMPT,
        quality:"low",
        size:"1024x1024",
        output_format:"png",
        n:1
      }),
      cache:"no-store"
    });
    const result=await response.json();
    if(!response.ok){
      console.error("OpenAI image error:",response.status,result);
      return Response.json({error:result?.error?.message||"Portrait generation failed."},{status:response.status});
    }
    const b64=result?.data?.[0]?.b64_json;
    if(!b64) return Response.json({error:"No portrait returned."},{status:502});
    return new Response(Buffer.from(b64,"base64"),{headers:{"Content-Type":"image/png","Cache-Control":"no-store"}});
  }catch(error){
    console.error("Portrait generation failed:",error);
    return Response.json({error:"Portrait generation failed."},{status:500});
  }
}
