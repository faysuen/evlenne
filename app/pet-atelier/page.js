import Link from "next/link";
export const metadata = {
 title: "Evlenne Pet Atelier | Private Entrance",
 description: "The standalone entrance to Evlenne's pet customization studio.",
 robots: { index: false, follow: false }
};
export default function PetAtelierEntry() {
 return <main style={{background:"#faf7f2",minHeight:"70vh",padding:"110px 24px",textAlign:"center",color:"#45382e"}}>
  <p style={{fontSize:11,letterSpacing:".2em"}}>EVLENNE · PET ATELIER</p>
  <h1 style={{font:"400 clamp(40px,6vw,74px) Georgia,serif",margin:"24px 0"}}>A little piece of them.</h1>
  <p style={{maxWidth:510,margin:"0 auto 35px",lineHeight:1.8,fontSize:16}}>Your existing personalized pet experience remains available here. This page is not linked from our new jewelry collection.</p>
  <Link href="/studio?mode=new" style={{display:"inline-block",background:"#45382e",color:"#fff",padding:"17px 30px",letterSpacing:".12em",fontSize:12}}>OPEN PET STUDIO ↗</Link>
  <p style={{marginTop:30,fontSize:13}}><Link href="/pets" style={{textDecoration:"underline"}}>My pets</Link></p>
 </main>;
}