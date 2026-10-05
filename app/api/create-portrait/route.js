export const runtime = "nodejs";
export const maxDuration = 120;

const PROMPT = `Create a detailed monochrome grayscale engraving portrait of the SAME pet in the reference photo. This is a portrait master for a personalized keepsake, with the visual character of a fine photographic graphite engraving rather than a sparse outline drawing.

Preserve the actual pet's identity: face proportions, eyes and their spacing, expression, nose, muzzle, ears, markings, and distinctive coat. Follow the source pose. Do not replace the pet with an idealized breed illustration.

Compose the complete head, both ears, and a small natural amount of upper chest, centered and comfortably inside the image with breathing room. Remove the scene and use a pure white background. No border, text, jewelry, or decorations.

Render a complete, readable silhouette. For pale or white fur, use controlled light-to-mid gray shading and darker selective contours to separate the crown, ears, cheeks and muzzle from the background. Do not let the top of the head or face disappear into white. White fur must retain visible depth, curl groups and natural directional texture.

Use a laser-ready three-tone hierarchy: darkest marks only for pupils, nose, mouth and a few deepest facial shadows; medium gray for the eyes, ear folds, curl groups and facial shape; near-white for highlights and open fur. Make the face readable at a 30 mm pendant scale before adding any small texture. Prefer broad, flowing locks of fur over individual hairs.

The result should look like a finished high-contrast grayscale pet engraving portrait: an intimate centered head-and-chest composition, polished enough for heirloom jewelry. Avoid pale blue or faint gray wireframe linework, ghostly outlines, edge-detection, flat vector stencil, cartoon styling, dense mechanical crosshatching, or sketchy unfinished marks. Favor the recognizable face, coherent fur masses and clean silhouette over microscopic detail. Output monochrome only.`;

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
    const abortController=new AbortController();
    const timeout=setTimeout(()=>abortController.abort(),100000);
    const response=await fetch("https://api.openai.com/v1/images/edits",{
      method:"POST",
      headers:{"Authorization":`Bearer ${key}`,"Content-Type":"application/json"},
      body:JSON.stringify({
        model:"gpt-image-2",
        images:[{image_url:dataUrl}],
        prompt:PROMPT,
        quality:"medium",
        size:"1024x1024",
        output_format:"jpeg",
        n:1
      }),
      cache:"no-store",
      signal:abortController.signal
    });
    clearTimeout(timeout);
    const result=await response.json();
    if(!response.ok){
      console.error("OpenAI image error:",response.status,result);
      return Response.json({error:result?.error?.message||"Portrait generation failed."},{status:response.status});
    }
    const b64=result?.data?.[0]?.b64_json;
    if(!b64) return Response.json({error:"No portrait returned."},{status:502});
    return new Response(Buffer.from(b64,"base64"),{headers:{"Content-Type":"image/jpeg","Cache-Control":"no-store"}});
  }catch(error){
    console.error("Portrait generation failed:",error);
    const timedOut=error?.name==="AbortError";
    return Response.json({error:timedOut?"Portrait generation took too long. Please try again.":"Portrait generation failed. Please try again."},{status:timedOut?504:500});
  }
}
