export const runtime = "nodejs";
export const maxDuration = 120;

const BASE_PROMPT = `Create an exceptionally refined, bespoke PET PORTRAIT LINE ENGRAVING from the supplied photograph. The result must be unmistakably the SAME individual pet, not a generic breed illustration. Faithfully preserve head shape, exact ear placement, eye spacing and expression, muzzle length, nose shape, distinctive coat markings, asymmetries, and characteristic fur growth. Do not beautify away defining features, invent accessories, or change the pose unnecessarily.

Produce a centered head-and-ears portrait with complete silhouette, clean pure white background, and no jewelry, medal, border, text, collar, props, or scenery. The design must be a carefully composed engraving illustration, not a photo filter, pencil sketch, comic, icon, or clipart. Draw controlled, elegant, tapered DARK linework with purposeful variation in line length and direction following the real fur. Maintain negative space between neighboring strokes. Make the eyes, nose, and mouth immediately legible; preserve their natural expression. Use fine but clear contours, coherent fur grouping, and selective emphasis rather than uniform outlines. No random scribbles, chaotic crosshatching, grayscale shading, gradients, stippling, photographic textures, or filled background. No large solid black areas except essential tiny nose/pupil details. Crisp monochrome ink on white, square composition.

Treat the input photo as identity ground truth. Never replace the actual pet with a stylized lookalike. This is engraving artwork intended to be faithfully reproduced on metal.`;

const DETAIL_PROMPTS = {
  jewelry: `JEWELRY DETAIL / 12–20 mm engraving: Prioritize recognition and visual elegance at miniature scale. Keep the exact distinctive face and expression while simplifying fur into well-spaced, intentional contours and short flowing groups. Preserve important curls or tufts where identity depends on them. Avoid dense clusters near the eyes, nose, and mouth, hairline gaps that will close when reduced, and microscopic marks. Strong hierarchy: eyes/nose/muzzle first, silhouette second, coat texture third. The result should still read clearly when printed at 15 mm.`,
  keepsake: `KEEPSAKE DETAIL / 25–45 mm engraving: Preserve the same pet identity with richer, organized fur direction and expressive coat detail, like an excellent artisan-engraved pet portrait. Use layered but separated short and medium strokes, with more detail around distinctive curls, eyebrows, ears, and muzzle, without hiding the eyes or turning fur into noise. Keep generous negative space and clean contours; no tonal photo shading. The design must remain legible as a laser-engraved metal medallion.`
};


export async function POST(request) {
  try {
    const key=process.env.OPENAI_API_KEY;
    if(!key) return Response.json({error:"OpenAI API key is not configured."},{status:500});
    const incoming=await request.formData();
    const image=incoming.get("image");
    const detail=incoming.get("detail")==="keepsake"?"keepsake":"jewelry";
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
        prompt:`${BASE_PROMPT}\n\n${DETAIL_PROMPTS[detail]}`,
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
