import {readPhoto} from "./preparePhoto";

export async function preparePawPrint(file){
  const url=await readPhoto(file),image=new Image();
  await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=()=>reject(new Error("Paw print could not be opened."));image.src=url});
  const scale=Math.min(1,1600/Math.max(image.naturalWidth,image.naturalHeight));
  const source=document.createElement("canvas");source.width=Math.max(1,Math.round(image.naturalWidth*scale));source.height=Math.max(1,Math.round(image.naturalHeight*scale));
  const sourceContext=source.getContext("2d",{willReadFrequently:true});if(!sourceContext)throw new Error("Paw print could not be prepared.");
  sourceContext.fillStyle="#fff";sourceContext.fillRect(0,0,source.width,source.height);sourceContext.drawImage(image,0,0,source.width,source.height);
  const pixels=sourceContext.getImageData(0,0,source.width,source.height),d=pixels.data,total=source.width*source.height,visited=new Uint8Array(total),queue=new Int32Array(total),parts=[];
  for(let start=0;start<total;start++){
    if(visited[start])continue;const value=.299*d[start*4]+.587*d[start*4+1]+.114*d[start*4+2];if(value>165){visited[start]=1;continue}
    let head=0,tail=0,area=0,minPartX=source.width,minPartY=source.height,maxPartX=0,maxPartY=0;queue[tail++]=start;visited[start]=1;
    while(head<tail){const point=queue[head++],x=point%source.width,y=(point-x)/source.width;area++;minPartX=Math.min(minPartX,x);minPartY=Math.min(minPartY,y);maxPartX=Math.max(maxPartX,x);maxPartY=Math.max(maxPartY,y);for(let yy=Math.max(0,y-1);yy<=Math.min(source.height-1,y+1);yy++)for(let xx=Math.max(0,x-1);xx<=Math.min(source.width-1,x+1);xx++){const next=yy*source.width+xx;if(visited[next])continue;const shade=.299*d[next*4]+.587*d[next*4+1]+.114*d[next*4+2];visited[next]=1;if(shade<=165)queue[tail++]=next}}
    const width=maxPartX-minPartX+1,height=maxPartY-minPartY+1,density=area/(width*height);if(area>Math.max(120,total*.00018)&&density>.12&&width>10&&height>10)parts.push({minPartX,minPartY,maxPartX,maxPartY});
  }
  if(!parts.length)throw new Error("We couldn’t find a clear paw print. Try a darker ink or clay impression on a light background.");
  let minX=source.width,minY=source.height,maxX=-1,maxY=-1;for(const part of parts){minX=Math.min(minX,part.minPartX);minY=Math.min(minY,part.minPartY);maxX=Math.max(maxX,part.maxPartX);maxY=Math.max(maxY,part.maxPartY)}
  const pad=Math.round(Math.max(maxX-minX,maxY-minY)*.14);minX=Math.max(0,minX-pad);minY=Math.max(0,minY-pad);maxX=Math.min(source.width-1,maxX+pad);maxY=Math.min(source.height-1,maxY+pad);
  const crop=document.createElement("canvas");crop.width=maxX-minX+1;crop.height=maxY-minY+1;crop.getContext("2d").drawImage(source,minX,minY,crop.width,crop.height,0,0,crop.width,crop.height);
  const out=document.createElement("canvas");out.width=1200;out.height=1200;const context=out.getContext("2d",{willReadFrequently:true});if(!context)throw new Error("Paw print could not be cleaned.");context.fillStyle="#fff";context.fillRect(0,0,1200,1200);const fit=Math.min(980/crop.width,980/crop.height),w=Math.round(crop.width*fit),h=Math.round(crop.height*fit);context.drawImage(crop,(1200-w)/2,(1200-h)/2,w,h);
  const cleaned=context.getImageData(0,0,1200,1200),c=cleaned.data;for(let i=0;i<c.length;i+=4){const value=.299*c[i]+.587*c[i+1]+.114*c[i+2],ink=Math.max(0,Math.min(1,(228-value)/128)),tone=Math.round(255-Math.pow(ink,.82)*225);c[i]=tone;c[i+1]=tone;c[i+2]=tone;c[i+3]=255}context.putImageData(cleaned,0,0);
  const blob=await new Promise(resolve=>out.toBlob(resolve,"image/png"));if(!blob)throw new Error("Paw print could not be saved.");const cleanedFile=new File([blob],"paw-print.png",{type:"image/png"});return {file:cleanedFile,url:await readPhoto(cleanedFile)};
}
