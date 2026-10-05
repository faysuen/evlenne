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
