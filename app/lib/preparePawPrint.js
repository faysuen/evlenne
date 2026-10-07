import {readPhoto} from "./preparePhoto";

export async function preparePawPrint(file){
  const url=await readPhoto(file),image=new Image();
  await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=()=>reject(new Error("Paw print could not be opened."));image.src=url});
  const scale=Math.min(1,1600/Math.max(image.naturalWidth,image.naturalHeight));
  const source=document.createElement("canvas");source.width=Math.max(1,Math.round(image.naturalWidth*scale));source.height=Math.max(1,Math.round(image.naturalHeight*scale));
  const sourceContext=source.getContext("2d",{willReadFrequently:true});if(!sourceContext)throw new Error("Paw print could not be prepared.");
  sourceContext.fillStyle="#fff";sourceContext.fillRect(0,0,source.width,source.height);sourceContext.drawImage(image,0,0,source.width,source.height);
  const pixels=sourceContext.getImageData(0,0,source.width,source.height),d=pixels.data;let minX=source.width,minY=source.height,maxX=-1,maxY=-1;
  for(let y=0;y<source.height;y++)for(let x=0;x<source.width;x++){const i=(y*source.width+x)*4,v=.299*d[i]+.587*d[i+1]+.114*d[i+2];if(v<205){minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y)}}
  if(maxX<0)throw new Error("We couldn’t find a clear paw print. Try a darker ink or clay impression on a light background.");
  const pad=Math.round(Math.max(maxX-minX,maxY-minY)*.14);minX=Math.max(0,minX-pad);minY=Math.max(0,minY-pad);maxX=Math.min(source.width-1,maxX+pad);maxY=Math.min(source.height-1,maxY+pad);
  const crop=document.createElement("canvas");crop.width=maxX-minX+1;crop.height=maxY-minY+1;crop.getContext("2d").drawImage(source,minX,minY,crop.width,crop.height,0,0,crop.width,crop.height);
  const out=document.createElement("canvas");out.width=1200;out.height=1200;const context=out.getContext("2d",{willReadFrequently:true});if(!context)throw new Error("Paw print could not be cleaned.");context.fillStyle="#fff";context.fillRect(0,0,1200,1200);const fit=Math.min(980/crop.width,980/crop.height),w=Math.round(crop.width*fit),h=Math.round(crop.height*fit);context.drawImage(crop,(1200-w)/2,(1200-h)/2,w,h);
  const cleaned=context.getImageData(0,0,1200,1200),c=cleaned.data;for(let i=0;i<c.length;i+=4){const value=.299*c[i]+.587*c[i+1]+.114*c[i+2],ink=Math.max(0,Math.min(1,(228-value)/128)),tone=Math.round(255-Math.pow(ink,.82)*225);c[i]=tone;c[i+1]=tone;c[i+2]=tone;c[i+3]=255}context.putImageData(cleaned,0,0);
  const blob=await new Promise(resolve=>out.toBlob(resolve,"image/png"));if(!blob)throw new Error("Paw print could not be saved.");const cleanedFile=new File([blob],"paw-print.png",{type:"image/png"});return {file:cleanedFile,url:await readPhoto(cleanedFile)};
}
