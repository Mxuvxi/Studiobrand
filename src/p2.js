/* ---------- images ---------- */
const readDataURL=f=>new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=()=>rej(r.error);r.readAsDataURL(f)});
const loadImg=src=>new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=()=>rej(new Error('image'));i.src=src});
function canvasFromImg(img,maxSide){
  const r=Math.min(1,maxSide/Math.max(img.width,img.height));
  const c=document.createElement('canvas');c.width=Math.max(1,Math.round(img.width*r));c.height=Math.max(1,Math.round(img.height*r));
  c.getContext('2d').drawImage(img,0,0,c.width,c.height);return c;
}
function hasAlphaOf(c){
  const d=c.getContext('2d',{willReadFrequently:true}).getImageData(0,0,c.width,c.height).data;let n=0;
  for(let i=3;i<d.length;i+=4)if(d[i]<250)n++;
  return n/(d.length/4)>.01;
}
function detectBg(c){
  const x=c.getContext('2d',{willReadFrequently:true}),w=c.width,h=c.height;
  const pts=[[0,0],[w-3,0],[0,h-3],[w-3,h-3]];
  const cols=pts.map(([px,py])=>{const d=x.getImageData(Math.max(0,px),Math.max(0,py),Math.min(3,w),Math.min(3,h)).data;let r=0,g=0,b=0,a=0;const n=d.length/4;
    for(let i=0;i<d.length;i+=4){r+=d[i];g+=d[i+1];b+=d[i+2];a+=d[i+3]}return[r/n,g/n,b/n,a/n]});
  if(cols.some(c=>c[3]<200))return null;
  return cols.every(c=>dist(c,cols[0])<40)?rgbToHex(...cols[0]):null;
}
function removeBg(c,opt){
  const w=c.width,h=c.height,ctx=c.getContext('2d',{willReadFrequently:true}),im=ctx.getImageData(0,0,w,h),d=im.data;
  const[br,bg,bb]=hexToRgb(opt.bg),tol=opt.tol,soft=tol*1.6;
  const dd=i=>Math.hypot(d[i]-br,d[i+1]-bg,d[i+2]-bb);
  const apply=(i,dist)=>{const a=clamp((dist-tol)/(soft-tol),0,1);d[i+3]=Math.round(d[i+3]*a)};
  if(opt.mode==='all'){
    for(let i=0;i<d.length;i+=4){const dist=dd(i);if(dist<soft)apply(i,dist)}
  }else{
    const seen=new Uint8Array(w*h),q=new Int32Array(w*h);let qs=0,qe=0;
    const ok=p=>{const i=p*4;return d[i+3]<10||dd(i)<soft};
    const push=p=>{if(!seen[p]&&ok(p)){seen[p]=1;q[qe++]=p}};
    for(let x=0;x<w;x++){push(x);push((h-1)*w+x)}
    for(let y=0;y<h;y++){push(y*w);push(y*w+w-1)}
    while(qs<qe){
      const p=q[qs++],i=p*4;if(d[i+3]>=10)apply(i,dd(i));
      const x=p%w,y=(p-x)/w;
      if(x>0)push(p-1);if(x<w-1)push(p+1);if(y>0)push(p-w);if(y<h-1)push(p+w);
    }
  }
  ctx.putImageData(im,0,0);
}
function trimAlpha(c){
  const w=c.width,h=c.height,d=c.getContext('2d',{willReadFrequently:true}).getImageData(0,0,w,h).data;
  let x0=w,y0=h,x1=-1,y1=-1;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(d[(y*w+x)*4+3]>8){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y}
  if(x1<0||(x0===0&&y0===0&&x1===w-1&&y1===h-1))return c;
  const o=document.createElement('canvas');o.width=x1-x0+1;o.height=y1-y0+1;o.getContext('2d').drawImage(c,-x0,-y0);return o;
}
function extractPalette(img){
  const c=canvasFromImg(img,90),x=c.getContext('2d',{willReadFrequently:true}),d=x.getImageData(0,0,c.width,c.height).data;
  const map=new Map();let opaque=0,kept=0,lumSum=0;
  for(let i=0;i<d.length;i+=4){
    if(d[i+3]<128)continue;opaque++;
    const R=d[i],G=d[i+1],B=d[i+2],[,s,l]=rgbToHsl(R,G,B);
    if(l>.94)continue;kept++;lumSum+=l;
    const key=((R>>4)<<8)|((G>>4)<<4)|(B>>4);let b=map.get(key);
    if(!b){b={n:0,r:0,g:0,b:0,s:0};map.set(key,b)}b.n++;b.r+=R;b.g+=G;b.b+=B;b.s+=s;
  }
  const whiteLogo=opaque>0&&kept/opaque<.03;
  const list=[...map.values()].map(b=>({rgb:[b.r/b.n,b.g/b.n,b.b/b.n],score:b.n*(.35+(b.s/b.n)*1.65)})).sort((a,b)=>b.score-a.score);
  const picked=[];for(const it of list){if(picked.every(p=>dist(p.rgb,it.rgb)>70))picked.push(it);if(picked.length>=4)break}
  return{colors:picked.map(p=>rgbToHex(...p.rgb)),avgLum:whiteLogo?1:(kept?lumSum/kept:.5)};
}
async function buildLogo(b){
  const src=await loadImg(b.logoSrc);
  let c=canvasFromImg(src,600);
  b.hasAlphaSrc=hasAlphaOf(c);
  b.bgGuess=b.hasAlphaSrc?null:detectBg(c);
  if(b.logoOpt.rm)removeBg(c,b.logoOpt);
  c=trimAlpha(c);
  b.hasAlpha=hasAlphaOf(c);
  b.logo=c.toDataURL('image/png');
  b.logoImg=await loadImg(b.logo);
  const pal=extractPalette(b.logoImg);b.palette=pal.colors;b.logoLum=pal.avgLum;
}

function genChartes(cols){
  const p1=cols[0]||'#0B7A75',[h1,s1,l1]=hsl(p1),sat=Math.max(.35,s1),out=[];
  {const bg=hslToHex(h1,Math.min(sat,.45),.09);
   out.push({name:'Signature',pair:0,logoPos:'tl',iconStyle:'contour',colors:{bg,text:'#F5F7F8',accent:ensureContrast(l1<.45?hslToHex(h1,Math.max(s1,.6),.6):p1,bg,4),second:hslToHex(h1,.25,.75)}})}
  {const bg=hslToHex(h1,.22,.96);
   out.push({name:'Éditorial',pair:1,logoPos:'tc',iconStyle:'plein',colors:{bg,text:hslToHex(h1,Math.min(sat,.5),.12),accent:ensureContrast(p1,bg,3.2),second:hslToHex(h1+180,.45,.4)}})}
  {const bg=s1<.2?p1:hslToHex(h1,Math.max(s1,.6),clamp(l1,.28,.5));
   out.push({name:'Vif',pair:2,logoPos:'tr',iconStyle:'pastille',colors:{bg,text:readableOn(bg),accent:ensureContrast(hslToHex(h1+180,.85,.6),bg,2.6),second:'#FFFFFF'}})}
  {const bg=hslToHex(h1,.1,.06);
   out.push({name:'Contraste',pair:3,logoPos:'br',iconStyle:'plein',colors:{bg,text:'#FFFFFF',accent:ensureContrast(cols[1]||hslToHex(h1+40,.9,.58),bg,4.5),second:p1}})}
  {const bg=hslToHex(h1+15,.35,.9);
   out.push({name:'Doux',pair:4,logoPos:'bl',iconStyle:'contour',colors:{bg,text:hslToHex(h1+15,.4,.16),accent:ensureContrast(hslToHex(h1+120,.4,.38),bg,3.2),second:p1}})}
  return out;
}
function makeDemoLogo(){
  const c=document.createElement('canvas');c.width=c.height=400;const x=c.getContext('2d');
  x.fillStyle='#2A6FDB';x.beginPath();x.arc(200,200,180,0,Math.PI*2);x.fill();
  x.fillStyle='#FFFFFF';x.font='700 220px Arial, sans-serif';x.textAlign='center';x.fillText('V',200,282);
  x.fillStyle='#F2B134';x.beginPath();x.arc(310,312,46,0,Math.PI*2);x.fill();
  return c.toDataURL('image/png');
}
function makeSamplePhoto(){
  const W=1800,H=1800,c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');
  const g=x.createLinearGradient(0,0,0,H*.72);g.addColorStop(0,'#16324F');g.addColorStop(.45,'#5C7FA3');g.addColorStop(.78,'#F0B48A');g.addColorStop(1,'#F7D9A8');
  x.fillStyle=g;x.fillRect(0,0,W,H);
  const sg=x.createRadialGradient(1150,1100,10,1150,1100,440);sg.addColorStop(0,'rgba(255,246,220,1)');sg.addColorStop(.25,'rgba(255,228,175,.9)');sg.addColorStop(1,'rgba(255,200,140,0)');
  x.fillStyle=sg;x.beginPath();x.arc(1150,1100,440,0,Math.PI*2);x.fill();
  ['#6C5B7B','#4A4A6A','#2E3552','#1B2238'].forEach((col,i)=>{
    x.fillStyle=col;x.beginPath();x.moveTo(0,H);const base=1130+i*175;
    for(let px=0;px<=W;px+=18)x.lineTo(px,base+Math.sin(px/270+i*1.7)*72+Math.sin(px/95+i)*22-i*10);
    x.lineTo(W,H);x.closePath();x.fill();
  });
  return{src:c,w:W,h:H};
}
