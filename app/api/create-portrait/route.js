export const runtime = "nodejs";
export const maxDuration = 120;

const PROMPT = `Transform the provided photograph into an elegant CUSTOM PET FACE LINE-ENGRAVING DESIGN suitable for a tiny gold or silver jewelry charm, as in a fine bespoke laser-engraved dog-face bracelet or ring.

Identity is essential: depict the SAME pet, keeping its distinctive ear shape and position, eye spacing, muzzle proportions, nose, markings, and characteristic hairstyle. Do not substitute a generic breed or invent features.

Artwork only: one front-facing or source-matching three-quarter pet HEAD, centered on a clean pure WHITE background. Complete ears and top of head visible, no cut-off anatomy. No jewelry, metal, coin, frame, collar, words, props, or scene. Pet head silhouette should be suitable for later conversion into a die-cut or laser-cut metal charm. Preserve a clear outer contour and avoid tiny fragile protrusions.

Style: refined hand-drawn ENGRAVING LINE ART, not a photograph, not a graphite sketch, not a tonal shaded portrait. Use deliberate clean dark hairline strokes for eyes, nose, mouth, ear edges and a SMALL NUMBER of flowing coat-direction lines. Create expressive recognizable eyes with tiny dark pupils and restrained highlights. Use negative space liberally. Minimize dense fur strokes and avoid micro-hatching. Approximately 20–45 meaningful contour and feature lines rather than hundreds of fine hair strands. Render like a real laser-etched drawing on polished jewelry, with simplified but precise features that remain legible when reduced to a 12–18 mm charm.

Strictly monochrome black strokes on pure white; no gray wash, no gradients, no filled black patches except tiny eyes/nose accents, no photographic textures, no stippling, no embossed 3D shading, no decorative illustration flourishes, no cartoon exaggeration. Crisp sharp outlines and graceful restrained detail. Output a single isolated head illustration, square 1024px.`

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
