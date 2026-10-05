export const runtime = "nodejs";
export const maxDuration = 300;

const PROMPT = `Create a detailed monochrome grayscale engraving portrait of the SAME pet in the reference photo. This is a portrait master for a personalized keepsake, with the visual character of a fine photographic graphite engraving rather than a sparse outline drawing.

Preserve the actual pet's identity: face proportions, eyes and their spacing, expression, nose, muzzle, ears, markings, and distinctive coat. Follow the source pose. Do not replace the pet with an idealized breed illustration.

Compose the complete head, both ears, and a small natural amount of upper chest, centered and comfortably inside the image with breathing room. Remove the scene and use a pure white background. No border, text, jewelry, or decorations.

Render a complete, readable silhouette. For pale or white fur, use controlled light-to-mid gray shading and darker selective contours to separate the crown, ears, cheeks and muzzle from the background. Do not let the top of the head or face disappear into white. White fur must retain visible depth, curl groups and natural directional texture.

Use balanced tonal modeling: crisp dark facial landmarks, natural eye highlights, clearly shaped nose and mouth, and visible midtones throughout the head. Keep eye surrounds proportionate and avoid oversized solid-black patches. Group individual hairs into meaningful locks and curls; make their direction recognizable without covering the portrait in noisy hairline hatching.

The result should look like a finished, high-contrast grayscale pet engraving portrait with substantial coat texture and soft dimensional shading. Avoid pale blue or faint gray wireframe linework, ghostly outlines, edge-detection, flat vector stencil, cartoon styling, dense mechanical crosshatching, or sketchy unfinished marks. Favor the recognizable face and coherent fur masses over microscopic detail. Output monochrome only.`;

export async function POST(request) {
  try {
    const key=process.env.OPENAI_API_KEY;
    if(!key) return Response.json({error:"OpenAI API key is not configured."},{status:500});
    const incoming=await request.formData();
    const image=incoming.get("image");
    if(!image || typeof image==="string") return Response.json({error:"No image uploaded."},{status:400});
    if(image.size>3*1024*1024) return Response.json({error:"This photo is too large to send. Please refresh Studio and try again."},{status:413});

    const bytes=Buffer.from(await image.arrayBuffer());
    const dataUrl=`data:${image.type||"image/jpeg"};base64,${bytes.toString("base64")}`;
    const response=await fetch("https://api.openai.com/v1/images/edits",{
      method:"POST",
      headers:{"Authorization":`Bearer ${key}`,"Content-Type":"application/json"},
      body:JSON.stringify({
        model:"gpt-image-2",
        images:[{image_url:dataUrl}],
        prompt:PROMPT,
        quality:"high",
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
