export const runtime = "nodejs";
export const maxDuration = 120;

const PROMPT = `Create a clean black-and-white engraving portrait of the SAME pet in the reference photo, optimized specifically for a 30 mm metal medallion.

IDENTITY IS THE HIGHEST PRIORITY. Do not beautify, idealize, breed-standardize, or invent a different pet. Preserve the exact face proportions, eye size/spacing/shape and expression, nose size/shape/position, muzzle length and width, ear shape and placement, head silhouette, asymmetries, markings, and distinctive fur features visible in the reference.

Composition: head and only a small amount of upper chest, centered, following the source pose. Remove the original scene completely. Use a pure clean white background with no scenery, border, shadow, floor, halo, text, or decorative elements.

Engraving treatment: simplify aggressively for small-scale laser engraving. Use about 25% fewer fur strokes than a detailed pen drawing. Keep light/white fur predominantly white. Describe curls and fur direction with selective short curved lines and small separated groups, leaving generous clean negative space between them. Concentrate useful detail around the eyes, nose, muzzle, ear edges, and outer silhouette. Eyes and nose should be crisp and recognizable, with controlled midtones and highlights, not solid black blobs. Use very limited hatching and stippling only where needed to define facial structure.

Avoid pencil-sketch texture, dense crosshatching, photographic shading, edge-detection artifacts, noisy micro-lines, cartoon styling, stencil styling, heavy outlines, large black masses, and excessive detail that would disappear at 30 mm.

Final result: elegant, restrained, recognizable memorial engraving artwork; monochrome black/gray on pure white; readable at 30 mm.`;

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
