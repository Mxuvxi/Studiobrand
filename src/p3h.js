function glyph(ctx,k,h,col){
  ctx.strokeStyle=col;ctx.fillStyle=col;ctx.lineWidth=Math.max(1.5,h*.2);
  switch(k){
    case'instagram':ctx.beginPath();rrPath(ctx,-h,-h,2*h,2*h,h*.55);ctx.stroke();ctx.beginPath();ctx.arc(0,0,h*.42,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(h*.6,-h*.6,h*.11,0,Math.PI*2);ctx.fill();break;
    case'facebook':ctx.font=`700 ${h*2.3}px Arial, sans-serif`;ctx.textAlign='center';ctx.textBaseline='alphabetic';ctx.fillText('f',h*.1,h*.85);break;
    case'linkedin':ctx.font=`700 ${h*1.75}px Arial, sans-serif`;ctx.textAlign='center';ctx.textBaseline='alphabetic';ctx.fillText('in',0,h*.62);break;
    case'x':ctx.lineWidth=Math.max(1.5,h*.26);ctx.beginPath();ctx.moveTo(-h*.85,-h*.9);ctx.lineTo(h*.85,h*.9);ctx.stroke();ctx.lineWidth=Math.max(1,h*.13);ctx.beginPath();ctx.moveTo(h*.85,-h*.9);ctx.lineTo(-h*.85,h*.9);ctx.stroke();break;
    case'youtube':{const w=h*1.15,hh=h*.82;ctx.beginPath();rrPath(ctx,-w,-hh,2*w,2*hh,hh*.5);ctx.moveTo(-h*.28,-h*.4);ctx.lineTo(h*.5,0);ctx.lineTo(-h*.28,h*.4);ctx.closePath();ctx.fill('evenodd');break}
    case'whatsapp':ctx.beginPath();ctx.arc(0,0,h*.95,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.moveTo(-h*1.02,h*1.05);ctx.lineTo(-h*.9,h*.3);ctx.lineTo(-h*.36,h*.9);ctx.closePath();ctx.fill();
      ctx.lineWidth=Math.max(1.5,h*.28);ctx.beginPath();ctx.moveTo(-h*.38,-h*.38);ctx.quadraticCurveTo(-h*.38,h*.38,h*.38,h*.38);ctx.stroke();break;
    case'tiktok':ctx.beginPath();ctx.arc(-h*.32,h*.52,h*.36,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.moveTo(h*.04,h*.52);ctx.lineTo(h*.04,-h*.85);ctx.quadraticCurveTo(h*.14,-h*.3,h*.8,-h*.3);ctx.stroke();break;
    case'phone':ctx.beginPath();rrPath(ctx,-h*.5,-h*.95,h,h*1.9,h*.22);ctx.stroke();ctx.beginPath();ctx.arc(0,h*.62,h*.08,0,Math.PI*2);ctx.fill();break;
    case'email':ctx.beginPath();rrPath(ctx,-h*.95,-h*.68,h*1.9,h*1.36,h*.16);ctx.stroke();ctx.beginPath();ctx.moveTo(-h*.88,-h*.55);ctx.lineTo(0,h*.12);ctx.lineTo(h*.88,-h*.55);ctx.stroke();break;
    case'web':ctx.beginPath();ctx.arc(0,0,h*.92,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.ellipse(0,0,h*.4,h*.92,0,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.moveTo(-h*.92,0);ctx.lineTo(h*.92,0);ctx.stroke();break;
    case'hours':ctx.beginPath();ctx.arc(0,0,h*.92,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.moveTo(0,-h*.5);ctx.lineTo(0,0);ctx.lineTo(h*.42,h*.28);ctx.stroke();break;
    case'legal':ctx.font=`700 ${h*2.1}px Arial, sans-serif`;ctx.textAlign='center';ctx.textBaseline='alphabetic';ctx.fillText('\u00A9',0,h*.7);break;
    case'snapchat':ctx.beginPath();ctx.arc(0,-h*.2,h*.68,Math.PI,0);ctx.lineTo(h*.68,h*.82);ctx.lineTo(h*.34,h*.56);ctx.lineTo(0,h*.82);ctx.lineTo(-h*.34,h*.56);ctx.lineTo(-h*.68,h*.82);ctx.closePath();ctx.stroke();break;
    case'pinterest':ctx.beginPath();ctx.arc(0,0,h*.92,0,Math.PI*2);ctx.stroke();ctx.font=`700 ${h*1.3}px Arial, sans-serif`;ctx.textAlign='center';ctx.textBaseline='alphabetic';ctx.fillText('P',0,h*.46);break;
    case'city':case'address':ctx.beginPath();ctx.arc(0,-h*.22,h*.62,Math.PI*.78,Math.PI*2.22);ctx.lineTo(0,h*.98);ctx.closePath();ctx.stroke();ctx.beginPath();ctx.arc(0,-h*.22,h*.2,0,Math.PI*2);ctx.fill();break;
  }
}
function drawIcon(ctx,key,cx,cy,size,style,fg,accent){
  const r=size/2;ctx.save();ctx.translate(cx,cy);ctx.lineJoin='round';ctx.lineCap='round';
  let col=fg,h;
  if(style==='plein'){h=r*.95}
  else if(style==='contour'){ctx.strokeStyle=fg;ctx.lineWidth=Math.max(2,size*.045);ctx.beginPath();ctx.arc(0,0,r-ctx.lineWidth/2,0,Math.PI*2);ctx.stroke();h=r*.5}
  else{ctx.fillStyle=accent;ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.fill();col=readableOn(accent);h=r*.5}
  glyph(ctx,key,h,col);ctx.restore();
}
const cleanText=(k,t)=>{t=String(t||'').trim();if(k==='web'||['facebook','instagram','linkedin','x','tiktok','youtube','snapchat','pinterest'].includes(k))t=t.replace(/^https?:\/\/(www\.)?/i,'').replace(/\/$/,'');return t};
function footerItems(){
  if(!v.icons||!current||hid('foot'))return[];
  return ORDER.filter(k=>current.show[k]&&(current.info[k]||'').trim()).map(k=>({k,text:cleanText(k,current.info[k])}));
}
function ellipsize(ctx,t,maxPx){if(ctx.measureText(t).width<=maxPx)return t;while(t.length>1&&ctx.measureText(t+'…').width>maxPx)t=t.slice(0,-1);return t+'…'}
function wrapRows(w,gap,maxW){const rows=[];let cur=[],cw=0;
  w.forEach((x,i)=>{const nw=cur.length?cw+gap+x:x;if(cur.length&&nw>maxW){rows.push({idx:cur,w:cw});cur=[i];cw=x}else{cur.push(i);cw=nw}});
  if(cur.length)rows.push({idx:cur,w:cw});return rows}
function layoutFooter(ctx,items,o){
  if(!items.length)return{height:0,paint(){}};
  const F=v.foot||{};o={...o};if(F.size&&F.size!==1)o.size*=F.size;if(F.align&&F.align!=='auto')o.align=F.align;if(F.col)o.fg=F.col;if(F.mode==='icons')items=items.map(it=>({...it,text:''}));if(F.mode==='col')o.maxRows=items.length;if(F.mode==='row')o.maxRows=1;
  let plan=null;
  for(let f=1;f>=.6;f-=.05){
    const s=o.size*f,gap=s*.7;ctx.font=fontB(o.pair,s*.5);
    const w=items.map(it=>s+s*.3+ctx.measureText(it.text).width),rows=F.mode==='col'?w.map((x,i)=>({idx:[i],w:x})):wrapRows(w,gap,o.maxW);
    if((F.mode==='col'||rows.length<=(f>=.78?Math.min(o.maxRows,2):o.maxRows))&&Math.max(...w)<=o.maxW){plan={s,gap,its:items.map((it,i)=>({...it,w:w[i]})),rows};break}
  }
  if(!plan){
    const s=o.size*.6,gap=s*.7;ctx.font=fontB(o.pair,s*.5);
    const its=items.map(it=>{if(SOCIAL.includes(it.k))return{...it,text:'',w:s};const t=ellipsize(ctx,it.text,o.maxW-s*1.3);return{...it,text:t,w:s+s*.3+ctx.measureText(t).width}});
    plan={s,gap,its,rows:F.mode==='col'?its.map((it,i)=>({idx:[i],w:it.w})):wrapRows(its.map(i=>i.w),gap,o.maxW)};
  }
  const s=plan.s,rh=s*1.2,rg=s*.35,height=plan.rows.length*rh+(plan.rows.length-1)*rg;
  return{height,paint(y){
    ctx.save();
    plan.rows.forEach((row,ri)=>{
      let x=o.align==='center'?o.x+(o.maxW-row.w)/2:o.align==='right'?o.x+o.maxW-row.w:o.x;const cy=y+ri*(rh+rg)+rh/2;
      row.idx.forEach(i=>{const it=plan.its[i];
        drawIcon(ctx,it.k,x+s/2,cy,s,o.style,o.fg,o.accent);
        if(it.text){ctx.font=fontB(o.pair,s*.5);ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillStyle=o.fg;ctx.fillText(it.text,x+s*1.3,cy+s*.02)}
        x+=it.w+plan.gap});
    });ctx.restore();
  }};
}