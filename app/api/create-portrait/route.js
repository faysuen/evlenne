export const runtime = "nodejs";
export const maxDuration = 120;

const PROMPT = `Create a detailed monochrome grayscale engraving portrait of the SAME pet in the reference photo. This is a portrait master for a personalized keepsake, with the visual character of a fine photographic graphite engraving rather than a sparse outline drawing.

Preserve the actual pet's identity: face proportions, eyes and their spacing, expression, nose, muzzle, ears, markings, and distinctive coat. Follow the source pose. Do not replace the pet with an idealized breed illustration.

Compose a close, intimate head-and-upper-chest portrait. The face should fill about 85–90% of the square, like a premium close-up pet portrait: make the eyes, nose and muzzle large and immediately readable. Keep both ears and the complete crown inside the image, but crop tightly around the pet and do not leave empty space around the silhouette. Remove the scene and use a pure white background. No border, text, jewelry, or decorations.

Render a complete, readable silhouette. For pale or white fur, use controlled light-to-mid gray shading and darker selective contours to separate the crown, ears, cheeks and muzzle from the background. Do not let the top of the head or face disappear into white. White fur must retain visible depth, curl groups and natural directional texture.

Make this a high-fidelity portrait master, not a simplified production engraving. Use a bold, laser-ready graphite tonal range: crisp rich-black pupils, nose and mouth; pronounced dark framing around the eyes; decisive medium-to-dark gray structure through the forehead, cheek curls, ears and muzzle; and controlled clean white highlights. Render hair in elegant, layered locks that follow the coat direction, with enough precise texture to feel lifelike, but never fuzzy, washed out or generic. The eyes must be expressive and proportionately prominent, the muzzle full and dimensional, and the silhouette clean and confident.

The result should look like a finished, premium black-and-white pet portrait made for an heirloom keepsake: detailed, luminous, emotionally recognizable and polished. Avoid pale blue or faint gray wireframe linework, ghostly outlines, soft airbrushed fuzz, flat vector stencil, cartoon styling, dense mechanical crosshatching, or sketchy unfinished marks. Preserve the recognizable face, coherent fur masses and refined detail. Output monochrome only.`;

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
