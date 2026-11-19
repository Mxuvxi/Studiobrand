
/* ================= photos multiples et détourage ================= */
v.extra=[];v.cut=null;v.sampleMain=true;
const MAXX=3;
const _sc={};
function sampleCut(i){
  i=i%4;if(_sc[i])return _sc[i];
  const c=document.createElement('canvas');c.width=600;c.height=800;const x=c.getContext('2d');
  const skin=['#8A5A3C','#C58B5C','#6B4430','#A66E4B'][i],cloth=['#F4F1EA','#2F4B7C','#E07A2D','#7A3E8C'][i],hair='#1B1410';
  x.fillStyle=cloth;x.beginPath();x.moveTo(30,800);x.quadraticCurveTo(50,520,200,478);x.lineTo(400,478);x.quadraticCurveTo(550,520,570,800);x.closePath();x.fill();
  x.fillStyle='rgba(0,0,0,.12)';x.beginPath();x.moveTo(30,800);x.quadraticCurveTo(50,560,150,520);x.lineTo(170,800);x.fill();
  x.fillStyle=skin;x.fillRect(255,400,90,100);x.beginPath();x.moveTo(230,478);x.quadraticCurveTo(300,560,370,478);x.lineTo(345,440);x.lineTo(255,440);x.fill();
  x.beginPath();x.ellipse(300,300,102,122,0,0,7);x.fill();
  x.fillStyle=hair;x.beginPath();x.ellipse(300,238,116,100,0,Math.PI,0);x.fill();x.fillRect(184,236,24,70);x.fillRect(392,236,24,70);
  x.fillStyle='rgba(0,0,0,.28)';x.beginPath();x.ellipse(262,312,9,5,0,0,7);x.ellipse(338,312,9,5,0,0,7);x.fill();
  x.strokeStyle='rgba(0,0,0,.3)';x.lineWidth=6;x.lineCap='round';x.beginPath();x.moveTo(266,372);x.quadraticCurveTo(300,392,334,372);x.stroke();
  return _sc[i]=c;
}
function slotPhoto(i,thumb){if(i===0)return thumb&&v.photoSm?v.photoSm:v.photo;const a=v.extra[i-1];return a?(thumb&&a.photoSm?a.photoSm:a.photo):null}
function slotCut(i){
  if(i===0)return v.cut||(v.sampleMain?sampleCut(0):null);
  const a=v.extra[i-1];if(a)return a.cut||null;
  return v.sampleMain?sampleCut(i):null;
}
function trimAlpha(c,thr){
  const w=c.width,h=c.height,d=c.getContext('2d',{willReadFrequently:true}).getImageData(0,0,w,h).data;
  let x0=w,y0=h,x1=-1,y1=-1;thr=thr||10;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(d[(y*w+x)*4+3]>thr){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y}
  if(x1<0)return null;
  const o=document.createElement('canvas');o.width=x1-x0+1;o.height=y1-y0+1;o.getContext('2d').drawImage(c,x0,y0,o.width,o.height,0,0,o.width,o.height);return o;
}
/* ---------- segmentation légère (histogrammes de couleur + traits) ---------- */
function workCanvas(src,maxS){
  const r=Math.min(1,maxS/Math.max(src.width,src.height)),c=document.createElement('canvas');
  c.width=Math.max(8,Math.round(src.width*r));c.height=Math.max(8,Math.round(src.height*r));
  c.getContext('2d',{willReadFrequently:true}).drawImage(src,0,0,c.width,c.height);return c;
}
function boxBlurF(a,w,h,r){
  const t=new Float32Array(a.length),o=new Float32Array(a.length),n=2*r+1;
  for(let y=0;y<h;y++){let s=0;const row=y*w;for(let x=-r;x<=r;x++)s+=a[row+Math.min(w-1,Math.max(0,x))];
    for(let x=0;x<w;x++){t[row+x]=s/n;s+=a[row+Math.min(w-1,x+r+1)]-a[row+Math.max(0,x-r)]}}
  for(let x=0;x<w;x++){let s=0;for(let y=-r;y<=r;y++)s+=t[Math.min(h-1,Math.max(0,y))*w+x];
    for(let y=0;y<h;y++){o[y*w+x]=s/n;s+=t[Math.min(h-1,y+r+1)*w+x]-t[Math.max(0,y-r)*w+x]}}
  return o;
}
function largestCC(lab,w,h){
  const N=w*h,id=new Int32Array(N),st=new Int32Array(N);let best=0,bestId=0,cur=0;
  for(let s=0;s<N;s++){if(lab[s]!==1||id[s])continue;cur++;let sp=0,cnt=0;st[sp++]=s;id[s]=cur;
    while(sp){const p=st[--sp];cnt++;const x=p%w,y=(p/w)|0;
      if(x>0&&lab[p-1]===1&&!id[p-1]){id[p-1]=cur;st[sp++]=p-1}
      if(x<w-1&&lab[p+1]===1&&!id[p+1]){id[p+1]=cur;st[sp++]=p+1}
      if(y>0&&lab[p-w]===1&&!id[p-w]){id[p-w]=cur;st[sp++]=p-w}
      if(y<h-1&&lab[p+w]===1&&!id[p+w]){id[p+w]=cur;st[sp++]=p+w}}
    if(cnt>best){best=cnt;bestId=cur}}
  for(let i=0;i<N;i++)lab[i]=id[i]===bestId?1:0;
}
function fillHoles(lab,w,h,bg){
  const N=w*h,seen=new Uint8Array(N),st=new Int32Array(N);let sp=0;
  const push=p=>{if(!seen[p]&&lab[p]===0){seen[p]=1;st[sp++]=p}};
  for(let x=0;x<w;x++){push(x);push((h-1)*w+x)}for(let y=0;y<h;y++){push(y*w);push(y*w+w-1)}
  while(sp){const p=st[--sp],x=p%w,y=(p/w)|0;if(x>0)push(p-1);if(x<w-1)push(p+1);if(y>0)push(p-w);if(y<h-1)push(p+w)}
  for(let i=0;i<N;i++)if(lab[i]===0&&!seen[i]&&!(bg&&bg[i]))lab[i]=1;
}
function openMask(lab,w,h,r){
  const a=new Float32Array(lab.length);for(let i=0;i<a.length;i++)a[i]=lab[i];
  const b=boxBlurF(a,w,h,r);const e=new Float32Array(a.length);for(let i=0;i<a.length;i++)e[i]=b[i]>.97?1:0;
  const c=boxBlurF(e,w,h,r+1);for(let i=0;i<a.length;i++)lab[i]=(c[i]>.04||(fgKeep&&0))?1:0;
}
let fgKeep=null;
function segmentLite(d,w,h,fg,bg){
  const N=w*h,lab=new Uint8Array(N),q=new Uint16Array(N);
  for(let i=0;i<N;i++)q[i]=((d[i*4]>>4)<<8)|((d[i*4+1]>>4)<<4)|(d[i*4+2]>>4);
  const hasFg=fg&&fg.some(x=>x);
  let cx=w*.5,cy=h*.52,vx=w*.3,vy=h*.4;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){const e=((x-cx)/(w*.2))**2+((y-cy)/(h*.32))**2;lab[y*w+x]=e<1?1:0}
  if(hasFg)for(let i=0;i<N;i++)if(fg[i])lab[i]=1;
  const bx=Math.max(2,Math.round(w*.03)),by=Math.max(2,Math.round(h*.03));
  const border=i=>{const x=i%w,y=(i/w)|0;return x<bx||x>=w-bx||y<by||y>=h-by};
  let ps=new Float32Array(N);
  for(let it=0;it<6;it++){
    const hf=new Float32Array(4096),hb=new Float32Array(4096);let nf=1,nb=1;
    for(let i=0;i<N;i++){
      const sf=fg&&fg[i],sb=bg&&bg[i];
      if(lab[i]||sf){const wt=sf?10:1;hf[q[i]]+=wt;nf+=wt}
      if(!lab[i]||sb){const wt=sb?10:(border(i)?3:1);hb[q[i]]+=wt;nb+=wt}
    }
    let sx=0,sy=0,sxx=0,syy=0,sn=0;
    for(let i=0;i<N;i++)if(lab[i]){const x=i%w,y=(i/w)|0;sx+=x;sy+=y;sxx+=x*x;syy+=y*y;sn++}
    if(sn>20){cx=sx/sn;cy=sy/sn;vx=Math.min(w*.3,Math.max(w*.12,Math.sqrt(Math.max(0,sxx/sn-cx*cx))*1.6));vy=Math.min(h*.4,Math.max(h*.14,Math.sqrt(Math.max(0,syy/sn-cy*cy))*1.6))}
    for(let y=0,i=0;y<h;y++)for(let x=0;x<w;x++,i++){
      const f=(hf[q[i]]+.3)/nf,b=(hb[q[i]]+.3)/nb,p=f/(f+b),sp=Math.exp(-.5*(((x-cx)/vx)**2+((y-cy)/vy)**2));
      ps[i]=p*.68+sp*.32}
    ps=boxBlurF(ps,w,h,2);
    let ch=0;for(let i=0;i<N;i++){const l=ps[i]>.5?1:0;if(l!==lab[i])ch++;lab[i]=l}
    if(fg)for(let i=0;i<N;i++)if(fg[i])lab[i]=1;
    if(bg)for(let i=0;i<N;i++)if(bg[i])lab[i]=0;
    openMask(lab,w,h,Math.max(2,Math.round(Math.min(w,h)*.012)));largestCC(lab,w,h);fillHoles(lab,w,h,bg);
    if(it>1&&ch<N*.002)break;
  }
  return lab;
}
function floodBg(d,w,h,tol){
  const N=w*h,rs=[],gs=[],bs=[];
  const sample=i=>{rs.push(d[i*4]);gs.push(d[i*4+1]);bs.push(d[i*4+2])};
  for(let x=0;x<w;x++){sample(x);sample((h-1)*w+x)}for(let y=0;y<h;y++){sample(y*w);sample(y*w+w-1)}
  const med=a=>a.sort((x,y)=>x-y)[a.length>>1],R=med(rs),G=med(gs),B=med(bs);
  const dist=(i,r,g,b)=>Math.hypot(d[i*4]-r,d[i*4+1]-g,d[i*4+2]-b);
  const fl=new Uint8Array(N),st=new Int32Array(N);let sp=0;
  const tryPush=(p,from)=>{if(fl[p])return;const dd=dist(p,R,G,B);
    if(dd<tol||(from>=0&&dist(p,d[from*4],d[from*4+1],d[from*4+2])<tol*.3&&dd<tol*2.2)){fl[p]=1;st[sp++]=p}};
  for(let x=0;x<w;x++){tryPush(x,-1);tryPush((h-1)*w+x,-1)}for(let y=0;y<h;y++){tryPush(y*w,-1);tryPush(y*w+w-1,-1)}
  while(sp){const p=st[--sp],x=p%w,y=(p/w)|0;if(x>0)tryPush(p-1,p);if(x<w-1)tryPush(p+1,p);if(y>0)tryPush(p-w,p);if(y<h-1)tryPush(p+w,p)}
  const lab=new Uint8Array(N);for(let i=0;i<N;i++)lab[i]=fl[i]?0:1;
  largestCC(lab,w,h);return lab;
}
/* ---------- éditeur de détourage ---------- */
const CUT={slot:0,src:null,w:0,h:0,data:null,mask:null,fgS:null,bgS:null,undo:[],tool:'keep',busy:false};
function cutRender(){
  const cv=$('cutcv'),x=cv.getContext('2d'),w=CUT.w,h=CUT.h,out=x.createImageData(w,h),o=out.data,d=CUT.data,m=CUT.mask;
  for(let yy=0,i=0;yy<h;yy++)for(let xx=0;xx<w;xx++,i++){
    const a=m[i]/255,chk=(((xx>>3)+(yy>>3))&1)?206:238,j=i*4;
    let r,g,b;
    if(a>=1){r=d[j];g=d[j+1];b=d[j+2]}else{const k=.2*(1-a);r=d[j]*(a+k)+chk*(1-a-k);g=d[j+1]*(a+k)+chk*(1-a-k);b=d[j+2]*(a+k)+chk*(1-a-k)}
    if(CUT.fgS[i]){g=g*.6+255*.4;r*=.6;b*=.6}else if(CUT.bgS[i]){r=r*.6+255*.4;g*=.6;b*=.6}
    o[j]=r;o[j+1]=g;o[j+2]=b;o[j+3]=255;
  }
  x.putImageData(out,0,0);
}
function cutPush(){CUT.undo.push({m:CUT.mask.slice(),f:CUT.fgS.slice(),b:CUT.bgS.slice()});if(CUT.undo.length>14)CUT.undo.shift()}
function cutAuto(){
  if(CUT.busy)return;CUT.busy=true;$('cut-state').textContent='Détection en cours…';
  setTimeout(()=>{
    try{cutPush();const lab=segmentLite(CUT.data,CUT.w,CUT.h,CUT.fgS,CUT.bgS);for(let i=0;i<lab.length;i++)CUT.mask[i]=lab[i]?255:0;cutRender();$('cut-state').textContent='Corrigez avec les pinceaux, puis validez.'}
    catch(e){console.error(e);$('cut-state').textContent='La détection a échoué.'}
    CUT.busy=false;
  },30);
}
function cutFlood(){
  cutPush();const lab=floodBg(CUT.data,CUT.w,CUT.h,+$('cut-tol').value);
  for(let i=0;i<lab.length;i++)CUT.mask[i]=lab[i]?255:0;
  for(let i=0;i<lab.length;i++){if(CUT.fgS[i])CUT.mask[i]=255;if(CUT.bgS[i])CUT.mask[i]=0}
  cutRender();$('cut-state').textContent='Fond uni retiré. Corrigez avec les pinceaux si besoin.';
}
function cutOpen(slot){
  const ph=slotPhoto(slot,false);if(!ph){toast("Ajoutez d'abord une photo.");return}
  const wc=workCanvas(ph.src,460),w=wc.width,h=wc.height;
  Object.assign(CUT,{slot,src:ph.src,w,h,data:wc.getContext('2d',{willReadFrequently:true}).getImageData(0,0,w,h).data,mask:new Uint8Array(w*h).fill(255),fgS:new Uint8Array(w*h),bgS:new Uint8Array(w*h),undo:[],tool:'keep'});
  const cv=$('cutcv');cv.width=w;cv.height=h;
  $('cutov').hidden=false;document.body.style.overflow='hidden';cutRender();syncCutUI();cutAuto();
}
function syncCutUI(){document.querySelectorAll('#cut-tools button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.t===CUT.tool)))}
function cutPaint(px,py){
  const cv=$('cutcv'),rc=cv.getBoundingClientRect(),k=CUT.w/rc.width,r=Math.max(2,+$('cut-size').value*k/2),x=(px-rc.left)*k,y=(py-rc.top)*k;
  const x0=Math.max(0,Math.floor(x-r)),x1=Math.min(CUT.w-1,Math.ceil(x+r)),y0=Math.max(0,Math.floor(y-r)),y1=Math.min(CUT.h-1,Math.ceil(y+r));
  const keep=CUT.tool==='keep';
  for(let yy=y0;yy<=y1;yy++)for(let xx=x0;xx<=x1;xx++){if((xx-x)**2+(yy-y)**2>r*r)continue;const i=yy*CUT.w+xx;
    if(keep){CUT.fgS[i]=1;CUT.bgS[i]=0;CUT.mask[i]=255}else{CUT.bgS[i]=1;CUT.fgS[i]=0;CUT.mask[i]=0}}
  cutRender();
}
function cutFinish(){
  const src=CUT.src,S=Math.min(1,1400/Math.max(src.width,src.height)),W=Math.max(8,Math.round(src.width*S)),H=Math.max(8,Math.round(src.height*S));
  const mc=document.createElement('canvas');mc.width=CUT.w;mc.height=CUT.h;const mx=mc.getContext('2d'),id=mx.createImageData(CUT.w,CUT.h);
  for(let i=0;i<CUT.mask.length;i++){id.data[i*4]=255;id.data[i*4+1]=255;id.data[i*4+2]=255;id.data[i*4+3]=CUT.mask[i]}
  mx.putImageData(id,0,0);
  const big=document.createElement('canvas');big.width=W;big.height=H;const bx=big.getContext('2d',{willReadFrequently:true});
  bx.imageSmoothingQuality='high';const fe=+$('cut-feather').value*(W/CUT.w);
  if(CAN_FILTER&&fe>0.2)bx.filter=`blur(${fe.toFixed(2)}px)`;
  bx.drawImage(mc,0,0,W,H);bx.filter='none';
  const bd=bx.getImageData(0,0,W,H),ad=bd.data;
  const out=document.createElement('canvas');out.width=W;out.height=H;const ox=out.getContext('2d',{willReadFrequently:true});
  ox.drawImage(src,0,0,W,H);const od=ox.getImageData(0,0,W,H),dd=od.data;
  for(let i=0;i<W*H;i++){let a=ad[i*4+3]/255;a=a<.3?0:a>.7?1:((a-.3)/.4)**2*(3-2*(a-.3)/.4);dd[i*4+3]=Math.round(dd[i*4+3]*a)}
  ox.putImageData(od,0,0);
  const t=trimAlpha(out,12);if(!t){toast("Rien n'est gardé : ajustez les traits.");return}
  if(CUT.slot===0){v.cut=t;v.sampleMain=false}else if(v.extra[CUT.slot-1])v.extra[CUT.slot-1].cut=t;
  cutClose();renderSlots();toast('Détourage appliqué.');schedule();
}
function cutClose(){$('cutov').hidden=true;document.body.style.overflow=''}
function wireCut(){
  const cv=$('cutcv');let down=false;
  cv.addEventListener('pointerdown',e=>{down=true;cutPush();try{cv.setPointerCapture(e.pointerId)}catch(_){}cutPaint(e.clientX,e.clientY);e.preventDefault()});
  cv.addEventListener('pointermove',e=>{if(down)cutPaint(e.clientX,e.clientY)});
  const up=()=>{down=false};cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
  $('cut-tools').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;CUT.tool=b.dataset.t;syncCutUI()});
  $('cut-auto').addEventListener('click',cutAuto);$('cut-flood').addEventListener('click',cutFlood);
  $('cut-undo').addEventListener('click',()=>{const u=CUT.undo.pop();if(!u)return;CUT.mask=u.m;CUT.fgS=u.f;CUT.bgS=u.b;cutRender()});
  $('cut-reset').addEventListener('click',()=>{cutPush();CUT.mask.fill(255);CUT.fgS.fill(0);CUT.bgS.fill(0);cutRender()});
  $('cut-ok').addEventListener('click',cutFinish);$('cut-cancel').addEventListener('click',cutClose);
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('cutov').hidden)cutClose()});
}
/* ---------- gestion des photos du visuel ---------- */
async function loadSlotFile(i,file){
  try{
    const url=await readDataURL(file),img=await loadImg(url),c=canvasFromImg(img,2400),alpha=hasAlphaOf(c);
    if(i===0){setPhoto(c);v.sampleMain=false;$('photo-tag').textContent=file.name.length>28?file.name.slice(0,25)+'…':file.name;if(alpha){const t=trimAlpha(c,12);if(t)v.cut=t}}
    else{
      const ph={src:c,w:c.width,h:c.height},a={photo:ph,photoSm:mkSm(ph),cut:null,zoom:1,fx:.5,fy:.5,name:file.name};
      if(alpha){const t=trimAlpha(c,12);if(t)a.cut=t}
      v.extra[i-1]=a;
    }
    renderSlots();syncControls();schedule();
    if(alpha)toast('Photo déjà détourée : utilisée comme découpe.');
  }catch(e){toast("Ce fichier n'a pas pu être lu comme image.")}
}
function renderSlots(){
  const box=$('slots');if(!box)return;
  const n=1+v.extra.length,rows=[];
  for(let i=0;i<n;i++){
    const ph=slotPhoto(i,true),cut=i===0?v.cut:(v.extra[i-1]&&v.extra[i-1].cut);
    rows.push(`<div class="slot" data-i="${i}"><canvas class="slot-th" width="64" height="64"></canvas><div class="slot-main"><b>${i===0?'Photo principale':'Photo '+(i+1)}</b><small>${cut?'Détourée':'Photo entière'}</small>
      <div class="slot-btns"><button type="button" class="btn small" data-a="file">Changer</button><button type="button" class="btn small" data-a="cut">Détourer</button>${cut?'<button type="button" class="btn small" data-a="uncut">Garder entière</button>':''}${i>0?'<button type="button" class="btn small" data-a="del">Retirer</button>':''}</div>
      ${i>0&&ph?`<div class="grid2 slot-adj"><label>Zoom<input type="range" data-a="zoom" min="1" max="3" step="0.01" value="${v.extra[i-1].zoom}"></label><label>Horizontal<input type="range" data-a="fx" min="0" max="1" step="0.01" value="${v.extra[i-1].fx}"></label><label>Vertical<input type="range" data-a="fy" min="0" max="1" step="0.01" value="${v.extra[i-1].fy}"></label></div>`:''}
    </div></div>`);
  }
  if(v.extra.length<MAXX)rows.push('<div class="slot-add"><button type="button" class="btn" data-a="add">+ Ajouter une photo</button><small>Jusqu\'à 4 photos par visuel, pour les modèles à plusieurs images.</small></div>');
  box.innerHTML=rows.join('');
  box.querySelectorAll('.slot').forEach(s=>{
    const i=+s.dataset.i,c=s.querySelector('canvas'),x=c.getContext('2d'),ph=slotPhoto(i,true);x.fillStyle='#202c34';x.fillRect(0,0,64,64);
    const cut=i===0?v.cut:(v.extra[i-1]&&v.extra[i-1].cut);
    if(cut){const sc=Math.min(60/cut.width,60/cut.height);x.drawImage(cut,32-cut.width*sc/2,62-cut.height*sc,cut.width*sc,cut.height*sc)}
    else if(ph){const sc=Math.max(64/ph.w,64/ph.h);x.drawImage(ph.src,32-ph.w*sc/2,32-ph.h*sc/2,ph.w*sc,ph.h*sc)}
  });
}
function wireSlots(){
  const box=$('slots'),fi=$('slot-file');let target=0,multi=false;
  box.addEventListener('click',e=>{
    const b=e.target.closest('button');if(!b)return;const s=b.closest('.slot'),i=s?+s.dataset.i:0,a=b.dataset.a;
    if(a==='file'){target=i;multi=false;fi.multiple=false;fi.click()}
    else if(a==='add'){target=1+v.extra.length;multi=true;fi.multiple=true;fi.click()}
    else if(a==='cut')cutOpen(i);
    else if(a==='uncut'){if(i===0){v.cut=null;v.sampleMain=false}else v.extra[i-1].cut=null;renderSlots();schedule()}
    else if(a==='del'){v.extra.splice(i-1,1);renderSlots();schedule()}
  });
  box.addEventListener('input',e=>{const r=e.target;if(r.type!=='range')return;const s=r.closest('.slot'),a=v.extra[+s.dataset.i-1];if(a){a[r.dataset.a]=+r.value;schedule()}});
  fi.addEventListener('change',async e=>{const fs=[...e.target.files];e.target.value='';
    if(!fs.length)return;
    if(multi){let t=1+v.extra.length;for(const f of fs){if(t-1>=MAXX)break;await loadSlotFile(t,f);t++}}
    else await loadSlotFile(target,fs[0]);
  });
}
