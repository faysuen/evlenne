export const runtime = "nodejs";
export const maxDuration = 120;

const PROMPT = `Create a refined black-and-white engraving-style memorial portrait of the SAME pet in the reference photo. Preserve the pet's identity precisely: face shape, eye placement and expression, nose shape, ears, distinctive markings, and recognizable fur pattern. Crop to head and a small amount of upper chest, centered and front-facing as in the source. Remove the entire original scene and background. Render soft fur with selective delicate curved linework, restrained hatching and minimal stippling; keep light fur mostly clean white. Make the eyes and nose clear and recognizable but avoid crushed black areas. No pencil-sketch mess, no edge-detection look, no cartoon, no stencil, no decorative elements, no text, no frame. The result must remain legible when engraved on a 30 mm metal medallion. Transparent background, monochrome black/gray artwork only.`;

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
        background:"transparent",
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
