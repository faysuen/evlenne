export function readPhoto(blob){
  return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result));reader.onerror=()=>reject(new Error('Photo could not be read'));reader.readAsDataURL(blob)});
}
export function validatePhoto(url){
  return new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>image.naturalWidth&&image.naturalHeight?resolve():reject(new Error('Empty photo'));image.onerror=()=>reject(new Error('Photo could not be decoded'));image.src=url});
}
export async function preparePhoto(file){
  const header=new TextDecoder().decode(await file.slice(0,64).arrayBuffer());
  const heic=/\.hei[cf]$/i.test(file.name||'')||/image\/hei[cf]/i.test(file.type)||(/ftyp/.test(header)&&/heic|heix|hevc|hevx|mif1|msf1/.test(header));
  let photo=file;
  if(heic){
    const {heicTo}=await import('heic-to/csp');
    const jpeg=await heicTo({blob:file,type:'image/jpeg',quality:.92});
    photo=new File([jpeg],(file.name||'pet-photo').replace(/\.[^.]+$/,'')+'.jpg',{type:'image/jpeg'});
  }
  const url=await readPhoto(photo);await validatePhoto(url);
  return {file:photo,url};
}

// Keep multipart uploads below the hosting platform's request limit.
export async function preparePortraitUpload(photoUrl){
  const image=new Image();
  await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=()=>reject(new Error('Your photo could not be opened. Please choose it again.'));image.src=photoUrl});
  const canvas=document.createElement('canvas');
  const scale=Math.min(1,2048/Math.max(image.naturalWidth,image.naturalHeight));
  canvas.width=Math.max(1,Math.round(image.naturalWidth*scale));
  canvas.height=Math.max(1,Math.round(image.naturalHeight*scale));
  const ctx=canvas.getContext('2d');
  if(!ctx)throw new Error('Your browser could not prepare this photo. Please try another browser.');
  ctx.fillStyle='#ffffff';ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.drawImage(image,0,0,canvas.width,canvas.height);
  for(const quality of [.9,.8,.7,.6]){
    const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',quality));
    if(!blob)throw new Error('Your photo could not be prepared. Please choose it again.');
    if(blob.size<=3*1024*1024)return blob;
  }
  throw new Error('This photo is too detailed to send. Please choose a smaller photo.');
}
