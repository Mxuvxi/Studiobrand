
/* ---------- dessin : texte ---------- */
const fontD=(p,s)=>`${Math.round(s)}px "${p.d}", system-ui, sans-serif`;
const fontB=(p,s)=>`${Math.round(s)}px "${p.b}", system-ui, sans-serif`;
const fontBB=(p,s)=>`700 ${Math.round(s)}px "${p.b}", system-ui, sans-serif`;
const LSOK=(()=>{try{return'letterSpacing'in CanvasRenderingContext2D.prototype}catch(e){return false}})();
function rrPath(ctx,x,y,w,h,r){r=Math.max(0,Math.min(r,w/2,h/2));ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()}
function parseHL(str,use){
  const out=[];let h=false,sp=true;
  const src=use?String(str):String(str).replace(/\*/g,'');
  src.split('*').forEach((part,i)=>{
    if(i>0)h=!h;
    (part.match(/\s+|\S+/g)||[]).forEach(tk=>{if(/^\s/.test(tk)){sp=true;return}out.push({t:tk,h,sp:sp&&out.length>0});sp=false});
  });
  return out;
}
const lineStr=ws=>ws.map((w,i)=>(i&&w.sp?' ':'')+w.t).join('');
function wrapWords(ctx,words,maxW){
  const lines=[];let cur=[];
  for(const w of words){
    const t=cur.concat([w]);
    if(!cur.length||!w.sp||ctx.measureText(lineStr(t)).width<=maxW)cur=t;else{lines.push(cur);cur=[w]}
  }
  if(cur.length)lines.push(cur);return lines;
}
function fitWords(ctx,words,prep,maxW,maxLines,size,min){
  let s=size,lines;
  for(;;){prep(s);lines=wrapWords(ctx,words,maxW);
    if((lines.length<=maxLines&&lines.every(l=>ctx.measureText(lineStr(l)).width<=maxW))||s<=min)break;s-=2}
  if(lines.length>maxLines){lines=lines.slice(0,maxLines);const last=lines[maxLines-1].slice();const w=last[last.length-1];last[last.length-1]={...w,t:w.t.replace(/[.,;:!?]+$/,'')+'…'};lines[maxLines-1]=last}
  return{lines,size:s};
}
function ink(ctx,t,x,y,size,col,eff,aux){
  ctx.save();
  if(eff==='shadow'){ctx.shadowColor='rgba(0,0,0,.55)';ctx.shadowBlur=size*.18;ctx.shadowOffsetY=size*.03}
  else if(eff==='glow'){ctx.shadowColor=aux.glow;ctx.shadowBlur=size*.45;ctx.fillStyle=col;ctx.fillText(t,x,y)}
  else if(eff==='outline'){ctx.lineJoin='round';ctx.lineWidth=size*.09;ctx.strokeStyle=aux.stroke;ctx.strokeText(t,x,y)}
  else if(eff==='hard'){ctx.fillStyle=aux.hard;ctx.fillText(t,x+size*.045,y+size*.045)}
  ctx.fillStyle=col;ctx.fillText(t,x,y);ctx.restore();
}
function paintLine(ctx,ws,ax,y,size,align,col,hl,eff,aux){
  const full=lineStr(ws),W=ctx.measureText(full).width;
  const x0=align==='center'?ax-W/2:align==='right'?ax-W:ax;
  ctx.textAlign='left';
  ws.forEach((w,i)=>{
    const pre=lineStr(ws.slice(0,i))+(i&&w.sp?' ':'');
    ink(ctx,w.t,x0+(pre?ctx.measureText(pre).width:0),y,size,w.h?hl:col,eff,aux);
  });
}
function pillPath(ctx,x,y,w,h){ctx.beginPath();rrPath(ctx,x,y,w,h,h/2)}
function textBlock(ctx,o){
  const base=o.base,g2=base*.022,ls=o.ls||0,ax=Math.max(.6,Math.min(1,o.aux||1));
  const setLS=s=>{if(LSOK)ctx.letterSpacing=(ls*s).toFixed(2)+'px'},clr=()=>{if(LSOK)ctx.letterSpacing='0px'};
  const words=parseHL(o.title||' ',o.hl).map(w=>({...w,t:o.upper?w.t.toUpperCase():w.t}));
  const T=fitWords(ctx,words,s=>{ctx.font=fontD(o.pair,s);setLS(s)},o.maxW,o.maxLines,o.size,base*.04),lh=T.size*1.1*o.lhK;
  let S=null;
  if(o.sub&&o.sub.trim()){const s0=Math.max(base*.03,T.size*.38)*o.sK;S=fitWords(ctx,parseHL(o.sub,o.hl),s=>{ctx.font=fontB(o.pair,s);clr()},o.maxW,2,s0,base*.022)}
  clr();
  const wide=o.wide;
  /* pastille de rubrique */
  let K=null;
  if(o.kicker){const ks=ax*base*(wide?.034:.026);ctx.font=fontBB(o.pair,ks);const txt=o.kicker.toUpperCase();K={txt,ks,w:ctx.measureText(txt).width+ks*1.8,h:ks*1.95}}
  /* étiquettes */
  let TG=null;
  if(o.tags&&o.tags.length){
    const ts=ax*base*(wide?.036:(o.tagsStack?.034:.027)),gap=ts*.55;ctx.font=fontBB(o.pair,ts);
    const items=o.tags.map((t,i)=>{const txt=(o.tagsNum?(i+1)+'  ':'')+t;return{txt,w:ctx.measureText(txt).width+ts*1.7}});
    const rows=[];let cur=[],cw=0;
    items.forEach(it=>{const nw=cur.length?cw+gap+it.w:it.w;if(o.tagsStack||(cur.length&&nw>o.maxW)){if(cur.length)rows.push({its:cur,w:cw});cur=[it];cw=it.w}else{cur.push(it);cw=nw}});
    if(cur.length)rows.push({its:cur,w:cw});
    const maxR=o.tagsStack?5:3,rs=rows.slice(0,maxR),ph=ts*1.95;
    TG={ts,gap,rows:rs,ph,height:rs.length*ph+(rs.length-1)*gap*.8};
  }
  /* bouton */
  let B=null;
  if(o.cta){const cs=ax*base*(wide?.038:.03);ctx.font=fontBB(o.pair,cs);const w=Math.min(o.maxW,ctx.measureText(o.cta).width+cs*2.6);B={cs,w,h:cs*2.3}}
  const ab=o.bar?Math.max(4,base*.012):0,g1=o.bar?base*.03:0,gk=base*.02;
  const sh=S?S.lines.length*S.size*1.3:0;
  const height=(K?K.h+gk:0)+ab+g1+T.lines.length*lh+(S?g2+sh:0)+(TG?g2*1.3+TG.height:0)+(B?g2*1.5+B.h:0);
  const rowX=w=>o.align==='center'?o.x+(o.maxW-w)/2:o.align==='right'?o.x+o.maxW-w:o.x;
  const aux={glow:o.C.accent,stroke:lum(o.C.text)>.5?'rgba(0,0,0,.8)':'rgba(255,255,255,.9)',hard:o.hlColor||o.C.accent};
  return{height,paint(y){
    const ax=o.align==='center'?o.x+o.maxW/2:o.align==='right'?o.x+o.maxW:o.x;
    ctx.save();ctx.textBaseline='top';
    let yy=y;
    if(K){const x=rowX(K.w);ctx.fillStyle=o.pillFill;pillPath(ctx,x,yy,K.w,K.h);ctx.fill();ctx.font=fontBB(o.pair,K.ks);ctx.fillStyle=o.pillText;ctx.textAlign='center';ctx.textBaseline='middle';
      if(LSOK)ctx.letterSpacing=(K.ks*.08)+'px';ctx.fillText(K.txt,x+K.w/2,yy+K.h/2+K.ks*.04);clr();ctx.textBaseline='top';yy+=K.h+gk}
    if(ab){const bw=base*.14;ctx.fillStyle=o.hlColor||o.C.accent;ctx.fillRect(o.align==='center'?ax-bw/2:o.align==='right'?ax-bw:ax,yy,bw,ab)}
    yy+=ab+g1;
    ctx.font=fontD(o.pair,T.size);setLS(T.size);
    T.lines.forEach((l,i)=>paintLine(ctx,l,ax,yy+i*lh,T.size,o.align,o.C.text,o.hlColor||o.C.accent,o.effect,aux));
    clr();yy+=T.lines.length*lh+g2;
    if(S){ctx.font=fontB(o.pair,S.size);ctx.globalAlpha=.92;S.lines.forEach((l,i)=>paintLine(ctx,l,ax,yy+i*S.size*1.3,S.size,o.align,o.C.text,o.hlColor||o.C.accent,o.effect==='shadow'?'shadow':'none',aux));ctx.globalAlpha=1;yy+=sh}
    if(TG){yy+=g2*1.3;
      TG.rows.forEach(r=>{let x=rowX(r.w);
        r.its.forEach(it=>{
          if(o.tagFill){ctx.fillStyle=o.tagFill;pillPath(ctx,x,yy,it.w,TG.ph);ctx.fill();ctx.fillStyle=o.tagText}
          else{ctx.fillStyle=rgba(o.C.text,.14);pillPath(ctx,x,yy,it.w,TG.ph);ctx.fill();ctx.strokeStyle=rgba(o.C.text,.55);ctx.lineWidth=Math.max(1.5,TG.ts*.08);ctx.stroke();ctx.fillStyle=o.C.text}
          ctx.font=fontBB(o.pair,TG.ts);ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(it.txt,x+it.w/2,yy+TG.ph/2+TG.ts*.04);ctx.textBaseline='top';
          x+=it.w+TG.gap});
        yy+=TG.ph+TG.gap*.8});
      yy-=TG.gap*.8;
    }
    if(B){yy+=g2*1.5;const x=rowX(B.w);ctx.fillStyle=o.ctaFill;pillPath(ctx,x,yy,B.w,B.h);ctx.fill();
      ctx.fillStyle=o.ctaText;ctx.font=fontBB(o.pair,B.cs);ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(o.cta,x+B.w/2,yy+B.h/2+B.cs*.04)}
    ctx.restore();
  }};
}
function fitBlock(ctx,o,avail){let s=o.size,tb;for(;;){tb=textBlock(ctx,{...o,size:s,aux:s/o.size});if(tb.height<=avail||s<=o.base*.04)break;s-=3}return tb}
