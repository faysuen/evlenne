"use client";
import { useState } from "react";
export default function JewelryFinishSwatches({name}) {
  const [finish,setFinish]=useState("Gold");
  return <div aria-label={`${name} finish options`} style={{display:"flex",alignItems:"center",gap:9,marginTop:10}}>
    {["Gold","Silver"].map(option=><button key={option} type="button" aria-label={`${name}: ${option} finish`} aria-pressed={finish===option} title={option} onClick={()=>setFinish(option)} style={{width:24,height:24,borderRadius:"50%",background:option==="Gold"?"#e5bb76":"#d4d3d0",border:finish===option?"2px solid #806448":"1px solid #b7afa6",outline:finish===option?"2px solid #faf8f4":"none",boxShadow:finish===option?"0 0 0 1px #806448":"none",cursor:"pointer"}}/>)}
    <span aria-live="polite" style={{font:"11px Arial,sans-serif",color:"#887969",marginLeft:3}}>{finish}</span>
  </div>;
}
