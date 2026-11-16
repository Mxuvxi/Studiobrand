
/* ---------- dessin : photo, logo, formes ---------- */
function photoFilter(base,k){
  if(!CAN_FILTER)return'none';
  const f=[v.duo!=='none'?'grayscale(1) contrast(1.12)':FILTERS[v.filter][1]];
  if(v.bright)f.push(`brightness(${(1+v.bright).toFixed(2)})`);
  if(v.contr)f.push(`contrast(${(1+v.contr).toFixed(2)})`);
  if(v.sat)f.push(`saturate(${(1+v.sat).toFixed(2)})`);
  if(v.blur)f.push(`blur(${(v.blur*base/1080*(k||1)).toFixed(2)}px)`);
  const s=f.filter(Boolean).join(' ');return s||'none';
}
function duoCols(C){
  if(v.duo==='none')return null;
  if(v.duo==='brand'){const[h,s]=hsl(C.accent);return[hslToHex(h,.55,.09),hslToHex(h,Math.min(1,s+.1),.82)]}
  const d=DUOS[v.duo];return[d[1],d[2]];
}
function shapePath(ctx,r,shape,rad){
  ctx.beginPath();const{x,y,w,h}=r;
  if(shape==='circle'){ctx.arc(x+w/2,y+h/2,Math.min(w,h)/2,0,Math.PI*2)}
  else if(shape==='arch'){const R=w/2,s=Math.min(w,h)*.04;ctx.moveTo(x,y+R);ctx.arc(x+R,y+R,R,Math.PI,0);ctx.lineTo(x+w,y+h-s);ctx.arcTo(x+w,y+h,x+w-s,y+h,s);ctx.lineTo(x+s,y+h);ctx.arcTo(x,y+h,x,y+h-s,s);ctx.closePath()}
  else if(shape==='round')rrPath(ctx,x,y,w,h,rad);
  else if(shape==='wave'){const a=h*.09;ctx.moveTo(x,y+a*1.3);ctx.bezierCurveTo(x+w*.28,y,x+w*.55,y+a*2.6,x+w,y+a*.5);ctx.lineTo(x+w,y+h);ctx.lineTo(x,y+h);ctx.closePath()}
  else if(shape==='waveb'){const a=h*.07;ctx.moveTo(x,y);ctx.lineTo(x+w,y);ctx.lineTo(x+w,y+h-a*.3);ctx.bezierCurveTo(x+w*.72,y+h-a*2.6,x+w*.3,y+h,x,y+h-a*1.3);ctx.closePath()}
  else if(shape==='cloud'){const n=5,rr=w/(2*n),yb=y+h-rr;ctx.moveTo(x,y);ctx.lineTo(x+w,y);ctx.lineTo(x+w,yb);for(let i=n-1;i>=0;i--)ctx.arc(x+rr+i*2*rr,yb,rr,0,Math.PI,false);ctx.closePath()}
  else if(shape==='diag'){ctx.moveTo(x,y);ctx.lineTo(x+w,y);ctx.lineTo(x+w,y+h*.72);ctx.lineTo(x,y+h);ctx.closePath()}
  else if(shape==='diagr'){ctx.moveTo(x,y);ctx.lineTo(x+w,y);ctx.lineTo(x+w*.82,y+h);ctx.lineTo(x,y+h);ctx.closePath()}
  else if(shape==='diagv'){ctx.moveTo(x+w*.2,y);ctx.lineTo(x+w,y);ctx.lineTo(x+w,y+h);ctx.lineTo(x,y+h);ctx.closePath()}
  else ctx.rect(x,y,w,h);
}
function drawPhoto(ctx,ph,r,shape,rad,base,main,k,C){
  const s=Math.max(r.w/ph.w,r.h/ph.h)*v.zoom,dw=ph.w*s,dh=ph.h*s,x=r.x+(r.w-dw)*v.fx,y=r.y+(r.h-dh)*v.fy;
  ctx.save();shapePath(ctx,r,shape,rad);ctx.clip();
  ctx.save();ctx.filter=photoFilter(base,k);
  if(v.flip){ctx.translate(r.x*2+r.w,0);ctx.scale(-1,1)}
  ctx.drawImage(ph.src,x,y,dw,dh);ctx.restore();
  const dc=CAN_FILTER?duoCols(C):null;
  if(dc){ctx.globalCompositeOperation='lighten';ctx.fillStyle=dc[0];ctx.fillRect(r.x,r.y,r.w,r.h);ctx.globalCompositeOperation='multiply';ctx.fillStyle=dc[1];ctx.fillRect(r.x,r.y,r.w,r.h);ctx.globalCompositeOperation='source-over'}
  if(v.wash>0){const col=v.washColor==='accent'?C.accent:v.washColor==='bg'?C.bg:C.second,g=ctx.createLinearGradient(r.x,r.y+r.h,r.x+r.w,r.y);g.addColorStop(0,rgba(col,Math.min(1,v.wash*.8)));g.addColorStop(1,rgba(col,0));ctx.fillStyle=g;ctx.fillRect(r.x,r.y,r.w,r.h)}
  if(v.vig>0){const g=ctx.createRadialGradient(r.x+r.w/2,r.y+r.h/2,Math.min(r.w,r.h)*.28,r.x+r.w/2,r.y+r.h/2,Math.hypot(r.w,r.h)*.56);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,`rgba(0,0,0,${Math.min(.9,v.vig*.85)})`);ctx.fillStyle=g;ctx.fillRect(r.x,r.y,r.w,r.h)}
  ctx.restore();
  if(main)v.geom={rw:r.w,rh:r.h,dw,dh};
}
function overlay(ctx,rect,type,side,hex,alpha,reach,clipFn){
  if(type==='none'||alpha<=0)return;
  alpha=Math.min(.98,alpha);
  ctx.save();if(clipFn){clipFn();ctx.clip()}
  ctx.beginPath();ctx.rect(rect.x,rect.y,rect.w,rect.h);ctx.clip();
  if(type==='solid'){ctx.fillStyle=rgba(hex,alpha);ctx.fillRect(rect.x,rect.y,rect.w,rect.h)}
  else{
    const len=rect.h*reach;let y0,y1;
    if(side==='top'){y0=rect.y;y1=rect.y+len}else{y0=rect.y+rect.h;y1=rect.y+rect.h-len}
    const g=ctx.createLinearGradient(0,y0,0,y1);g.addColorStop(0,rgba(hex,alpha));g.addColorStop(.55,rgba(hex,alpha*.62));g.addColorStop(1,rgba(hex,0));
    ctx.fillStyle=g;ctx.fillRect(rect.x,rect.y,rect.w,rect.h);
  }
  ctx.restore();
}
const tintCache=new WeakMap();
function tinted(img,color){
  let m=tintCache.get(img);if(!m){m=new Map();tintCache.set(img,m)}
  let c=m.get(color);
  if(!c){c=document.createElement('canvas');c.width=img.width;c.height=img.height;const x=c.getContext('2d');x.drawImage(img,0,0);x.globalCompositeOperation='source-in';x.fillStyle=color;x.fillRect(0,0,c.width,c.height);m.set(color,c)}
  return c;
}
function logoGeom(o){
  const img=o.img,mul=o.mul||1,maxW=o.base*.3*v.logoScale*mul,maxH=o.base*.15*v.logoScale*mul,k=Math.min(maxW/img.width,maxH/img.height),lw=img.width*k,lh=img.height*k;
  const hasPlate=v.plate!=='none',pad=hasPlate?o.base*.024:0;
  let bw=lw+2*pad,bh=lh+2*pad;
  if(hasPlate&&v.logoShape==='circle'){bw=bh=Math.hypot(lw,lh)+pad*1.2}
  let x,y;
  if(v.logoFree){x=clamp(v.logoFree.x*o.W-bw/2,0,o.W-bw);y=clamp(v.logoFree.y*o.H-bh/2,0,o.H-bh)}
  else if(o.center!=null){x=(o.W-bw)/2;y=o.H*o.center-bh/2}
  else{
    const A=o.area,hx=o.pos[1];
    x=hx==='l'?A.x+o.mm:hx==='c'?A.x+(A.w-bw)/2:A.x+A.w-o.mm-bw;
    y=o.pos[0]==='t'?A.y+o.mm+o.resTop:A.y+A.h-o.mm-bh-o.resBottom;
  }
  return{x,y,bw,bh,lw,lh,hasPlate};
}
function drawLogo(ctx,o){
  const g=logoGeom(o),img=o.img,{x,y,bw,bh,lw,lh,hasPlate}=g;
  const src=v.logoTint==='orig'?img:tinted(img,v.logoTint==='white'?'#FFFFFF':v.logoTint==='black'?'#111111':o.C.accent);
  ctx.save();ctx.globalAlpha=v.logoOpacity;
  if(v.logoRot){ctx.translate(x+bw/2,y+bh/2);ctx.rotate(v.logoRot*Math.PI/180);ctx.translate(-(x+bw/2),-(y+bh/2))}
  const put=(px,py,w,h)=>{if(v.logoGray&&CAN_FILTER)ctx.filter='grayscale(1)';ctx.drawImage(src,px,py,w,h);ctx.filter='none'};
  if(hasPlate){
    const pp=()=>{ctx.beginPath();
      if(v.logoShape==='circle')ctx.arc(x+bw/2,y+bh/2,bw/2,0,Math.PI*2);
      else if(v.logoShape==='square')ctx.rect(x,y,bw,bh);
      else rrPath(ctx,x,y,bw,bh,Math.min(bh/2,Math.min(bh*.22,o.base*.03)*v.logoRad))};
    if(v.plate==='ring'){pp();ctx.lineWidth=Math.max(3,o.base*.005);ctx.strokeStyle=o.C.accent;ctx.stroke()}
    else if(v.plate==='glass'){ctx.save();pp();ctx.fillStyle='rgba(255,255,255,.2)';ctx.fill();ctx.lineWidth=Math.max(2,o.base*.003);ctx.strokeStyle='rgba(255,255,255,.55)';ctx.stroke();ctx.restore()}
    else{ctx.save();ctx.shadowColor='rgba(0,0,0,.22)';ctx.shadowBlur=o.base*.025;ctx.shadowOffsetY=o.base*.006;
      ctx.fillStyle=v.plate==='dark'?'#12171A':v.plate==='accent'?o.C.accent:v.plate==='bg'?o.C.bg:'#FFFFFF';pp();ctx.fill();ctx.restore()}
    put(x+(bw-lw)/2,y+(bh-lh)/2,lw,lh);
  }else{
    if(v.shadow){ctx.shadowColor=o.lum>.6?'rgba(0,0,0,.6)':'rgba(255,255,255,.6)';ctx.shadowBlur=o.base*.022;ctx.shadowOffsetY=o.base*.004}
    put(x,y,lw,lh);
  }
  ctx.restore();
}
function burst(ctx,cx,cy,R,n,inner){ctx.beginPath();for(let i=0;i<n*2;i++){const a=Math.PI*i/n-Math.PI/2,r=i%2?R*inner:R;ctx[i?'lineTo':'moveTo'](cx+Math.cos(a)*r,cy+Math.sin(a)*r)}ctx.closePath()}
function drawBadge(ctx,e,text){
  const{base,W,H,C,pair,wide,m,safeY,pos}=e,R=base*(wide?.2:.135);
  const side=pos[1]==='r'?'l':'r';
  const cx=side==='r'?W-m-R*.9:m+R*.9,cy=(pos[0]==='b'?safeY+m+R*.95:H-safeY-m-R*.95-(pos[0]==='t'?0:0));
  const cyy=pos[0]==='b'?cy:(pos[1]==='c'?safeY+m+R*.95:cy);
  const y=pos[0]==='t'&&pos[1]!=='c'?safeY+m+R*.95+base*.06:cyy;
  ctx.save();ctx.translate(cx,y);ctx.rotate(-.17);
  ctx.shadowColor='rgba(0,0,0,.3)';ctx.shadowBlur=base*.03;ctx.shadowOffsetY=base*.008;
  ctx.fillStyle=C.accent;burst(ctx,0,0,R,14,.86);ctx.fill();ctx.shadowColor='transparent';
  const words=text.trim().split(/\s+/),big=words[0],rest=words.slice(1).join(' ');
  ctx.fillStyle=readableOn(C.accent);ctx.textAlign='center';ctx.textBaseline='middle';
  let s=R*.8;ctx.font=fontD(pair,s);while(ctx.measureText(big).width>R*1.3&&s>10){s-=2;ctx.font=fontD(pair,s)}
  ctx.fillText(big,0,rest?-s*.12:0);
  if(rest){let t=s*.34;ctx.font=fontBB(pair,t);while(ctx.measureText(rest).width>R*1.3&&t>8){t-=1;ctx.font=fontBB(pair,t)}ctx.fillText(rest,0,s*.4)}
  ctx.restore();
}
function panelPath(c,P){
  c.beginPath();
  if(P.kind==='notch'){
    const{x0,x1,top,nd,R,nx0,nx1,bot}=P,rf=Math.min(R*.9,nd*.45);
    c.moveTo(x0+R,top);c.lineTo(nx0-rf,top);c.arcTo(nx0,top,nx0,top+rf,rf);c.lineTo(nx0,top+nd-rf);c.arcTo(nx0,top+nd,nx0+rf,top+nd,rf);
    c.lineTo(nx1-rf,top+nd);c.arcTo(nx1,top+nd,nx1,top+nd-rf,rf);c.lineTo(nx1,top+rf);c.arcTo(nx1,top,nx1+rf,top,rf);
    c.lineTo(x1-R,top);c.arcTo(x1,top,x1,top+R,R);c.lineTo(x1,bot-R);c.arcTo(x1,bot,x1-R,bot,R);c.lineTo(x0+R,bot);c.arcTo(x0,bot,x0,bot-R,R);c.lineTo(x0,top+R);c.arcTo(x0,top,x0+R,top,R);c.closePath();
  }else rrPath(c,P.x0,P.top,P.x1-P.x0,P.bot-P.top,P.R);
}
/* onglet creusé (coins concaves) à gauche de la photo */
function tabPath(c,px,py,tw,th,r){
  c.beginPath();c.moveTo(px-1,py-1);c.lineTo(px+tw+r,py-1);c.lineTo(px+tw+r,py);
  c.arc(px+tw+r,py+r,r,-Math.PI/2,Math.PI,true);
  c.lineTo(px+tw,py+th-r);c.arc(px+tw-r,py+th-r,r,0,Math.PI/2);
  c.lineTo(px+r,py+th);c.arc(px+r,py+th+r,r,-Math.PI/2,Math.PI,true);
  c.lineTo(px-1,py+th+r);c.closePath();
}
