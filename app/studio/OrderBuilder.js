"use client";
import {useEffect,useMemo,useState} from "react";
import {personalizationForProduct} from "../lib/petIdentity";

const productLibrary=[
  {family:"WEAR",id:"portrait-pendant",name:"Portrait Pendant",note:"Their portrait, close to you.",finish:true,options:["45 cm chain","50 cm chain"]},
  {family:"WEAR",id:"portrait-bracelet",name:"Portrait Bracelet",note:"A quiet everyday piece.",finish:true,options:["16 cm","18 cm","20 cm"]},
  {family:"CARRY",id:"leather-travel-tag",name:"Leather Travel Tag",note:"Take them wherever you go.",finish:false,options:["Mocha","Ivory","Etoupe"]},
  {family:"CARRY",id:"bag-charm",name:"Bag Charm",note:"A small piece of them, with you.",finish:true,options:["Classic","Mini"]},
  {family:"KEEP",id:"portrait-coin",name:"Portrait Coin",note:"Their portrait, made permanent.",finish:true,options:["30 mm","35 mm"]},
  {family:"KEEP",id:"paw-keepsake",name:"Paw Keepsake",note:"Made from their actual paw print.",requires:"paw",finish:true,options:["30 mm","35 mm"]},
  {family:"KEEP",id:"fur-keepsake",name:"Fur Keepsake",note:"A fitted vessel for a small lock of their fur.",finish:true,options:["Keepsake capsule"]}
];

function Choice({active,onClick,children}){return <button type="button" className={"choice-pill "+(active?"selected":"")} onClick={onClick}>{children}</button>}

export default function OrderBuilder({initialProduct="portrait-coin",metal="gold",setMetal,petName="",petIdentity=null,onBack}){
  const initial=productLibrary.find(item=>item.id===initialProduct)||productLibrary[0];
  const [selectedProduct,setSelectedProduct]=useState(initial.id);
  const [productOption,setProductOption]=useState(initial.options?.[0]||"");
  const [finish,setFinish]=useState(metal||"gold");
  useEffect(()=>setFinish(metal||"gold"),[metal]);
  const product=useMemo(()=>productLibrary.find(item=>item.id===selectedProduct)||productLibrary[0],[selectedProduct]);
  const personalization=useMemo(()=>petIdentity?.id?personalizationForProduct(petIdentity,selectedProduct):null,[petIdentity,selectedProduct]);
  function chooseFinish(next){setFinish(next);setMetal?.(next)}
  function chooseProduct(item){if(item.requires==="paw"&&!petIdentity?.assets?.paw)return;setSelectedProduct(item.id);setProductOption(item.options?.[0]||"")}
  const productSelection=personalization?{...personalization,templateVersion:1,option:productOption,finish:product.finish?finish:null}:null;

  return <section className="order-builder configurable-builder" aria-labelledby="finish-title">
    <p className="step">04 · CHOOSE A PIECE</p>
    <h1 id="finish-title">Now make it theirs.</h1>
    <p className="muted finish-intro">{petIdentity?.status==="portrait_ready"?petName+"’s Pet Identity is ready. Choose where they go next.":"Complete their portrait first."}</p>

    {petIdentity?.status==="portrait_ready"&&<>
      <section className="identity-ready" aria-label="Pet Identity ready"><div><p className="section-label">PET IDENTITY READY</p><h2>Made for {petName}.</h2><p>Your approved portrait can now move with {petName} across Evlenne — without uploading their photo again.</p></div><div className="identity-ready-meta"><span>PORTRAIT <b>READY</b></span><span>PAW <b>{petIdentity?.assets?.paw?"READY":"ADD LATER"}</b></span><span>FUR <b>KEEPSAKE READY</b></span></div></section>

      <section className="product-library" aria-labelledby="library-heading"><div className="builder-section-heading"><p className="section-label">MADE FOR {petName.toUpperCase()}</p><h2 id="library-heading">Choose where they go next.</h2><p className="builder-note">One Pet Identity, ready across the Evlenne product library.</p></div><div className="product-library-grid">{productLibrary.map(item=>{const locked=item.requires==="paw"&&!petIdentity?.assets?.paw;return <button type="button" key={item.id} disabled={locked} className={"library-product "+(selectedProduct===item.id?"selected ":"")+(locked?"locked":"")} onClick={()=>chooseProduct(item)}><small>{item.family}</small><strong>{item.name}</strong><span>{locked?"Add paw print to unlock":item.note}</span><em>{selectedProduct===item.id?"Selected":"Use "+petName}</em></button>})}</div></section>

      <section className="builder-section product-config" aria-labelledby="product-config-heading"><p className="section-label">PRODUCT DETAILS</p><h2 id="product-config-heading">{product.name} for {petName}.</h2><p className="builder-note">{selectedProduct==="fur-keepsake"?"Your piece arrives ready for you to place a small, dry lock of fur inside — nothing to upload or mail back.":"Their approved Pet Identity portrait is already attached. No re-upload needed."}</p>{product.finish&&<div className="finish-swatches compact-finishes"><button type="button" className={finish==="gold"?"selected":""} onClick={()=>chooseFinish("gold")}><span className="finish-swatch gold-swatch"/><strong>Gold</strong></button><button type="button" className={finish==="silver"?"selected":""} onClick={()=>chooseFinish("silver")}><span className="finish-swatch silver-swatch"/><strong>Silver</strong></button></div>}<div className="product-option-row">{product.options.map(option=><Choice key={option} active={productOption===option} onClick={()=>setProductOption(option)}>{option}</Choice>)}</div><div className="identity-attachment"><span>PET IDENTITY</span><strong>{petName} · Portrait ready ✓</strong></div><div className="product-next"><strong>{product.name}</strong><span>{productOption}{product.finish?" · "+(finish==="silver"?"Silver":"Gold"):""}</span><button type="button" className="checkout-preview">Continue with {petName} →</button></div></section>

      {productSelection&&<aside className="selection-summary"><span>READY FOR CHECKOUT</span><strong>{productSelection.productId}</strong><small>{productSelection.petName} · template v{productSelection.templateVersion} · {productSelection.option}{productSelection.finish?" · "+productSelection.finish:""}</small></aside>}
    </>}
    {onBack&&<button className="flow-back" onClick={onBack}>← Back to personalization</button>}
  </section>;
}
