export const runtime = "nodejs";

export async function POST(request) {
  try {
    const key = process.env.PHOTOROOM_API_KEY;
    if (!key) {
      return Response.json({ error: "PhotoRoom API key is not configured." }, { status: 500 });
    }

    const incoming = await request.formData();
    const image = incoming.get("image");
    if (!image || typeof image === "string") {
      return Response.json({ error: "No image uploaded." }, { status: 400 });
    }

    const body = new FormData();
    body.append("image_file", image, image.name || "pet-photo.jpg");

    const response = await fetch("https://sdk.photoroom.com/v1/segment", {
      method: "POST",
      headers: { "x-api-key": key },
      body,
      cache: "no-store"
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error("PhotoRoom error:", response.status, detail);
      return Response.json({ error: "Could not remove the background." }, { status: 502 });
    }

    const bytes = await response.arrayBuffer();
    return new Response(bytes, {
      status: 200,
      headers: {
        "Content-Type": response.headers.get("content-type") || "image/png",
        "Cache-Control": "no-store"
      }
    });
  } catch (error) {
    console.error("Background removal failed:", error);
    return Response.json({ error: "Background removal failed." }, { status: 500 });
  }
}
