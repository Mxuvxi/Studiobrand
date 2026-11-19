
/* ================= modèles construits ================= */
const D0={kicker:'',date:'Samedi 14 novembre 2026',time:'09h30',place:'Votre quartier, votre ville|Adresse précise, à côté d\'un repère connu',slogan:'',tags:'',secA:'',secB:'',listA:'',listB:'',body:'',org:''};
const DEMO={};
const DM=o=>({...D0,...o});
function drawCustom(ctx,W,H,opt,tpl){
  const main=!opt.thumb,kS=opt.k||1,ph=opt.thumb&&v.photoSm?v.photoSm:v.photo;
  const b=current,C={...b.colors};if(v.accent)C.accent=v.accent;
  const base=Math.min(W,H),m=Math.round(base*.06*v.margin);
  const e={W,H,base,u:W,m,C:{...C,W,H},P:pal(C),pair:curPair(),items:footerItems(),main,thumb:!!opt.thumb,
    photo:(r,shape,rad)=>drawPhoto(ctx,ph,r,shape||'rect',rad||0,base,main,kS,C)};
  e.pic=(i,r,shape,rad)=>{
    const sp=slotPhoto(i,!!opt.thumb);
    if(i===0||!sp){const keep=[v.zoom,v.fx,v.fy];if(i>0){v.zoom=1.25;v.fx=(.5+i*.37)%1;v.fy=.4}
      const g=v.geom;drawPhoto(ctx,i===0?ph:ph,r,shape||'rect',rad||0,base,main&&i===0,kS,C);if(i>0)v.geom=g;[v.zoom,v.fx,v.fy]=keep;return}
    const a=v.extra[i-1],keep=[v.zoom,v.fx,v.fy,v.flip],g=v.geom;v.zoom=a.zoom;v.fx=a.fx;v.fy=a.fy;v.flip=false;
    drawPhoto(ctx,sp,r,shape||'rect',rad||0,base,false,kS,C);v.zoom=keep[0];v.fx=keep[1];v.fy=keep[2];v.flip=keep[3];v.geom=g};
  e.hasCut=i=>!!slotCut(i);
  e.cut=(i,b,o)=>{o=o||{};const c=slotCut(i);if(!c)return false;
    const sc=Math.min(b.w/c.width,b.h/c.height)*(o.scale||1),w=c.width*sc,h=c.height*sc,x=b.x+(b.w-w)*(o.ax==null?.5:o.ax),y=o.top?b.y:b.y+b.h-h;
    ctx.save();
    if(o.flip){ctx.translate(x*2+w,0);ctx.scale(-1,1)}
    if(o.outline){const t=tinted(c,o.outline),n=14,r=o.ow||base*.008;for(let k=0;k<n;k++){const an=k/n*Math.PI*2;ctx.drawImage(t,x+Math.cos(an)*r,y+Math.sin(an)*r,w,h)}}
    if(o.shadow){ctx.shadowColor='rgba(0,0,0,.38)';ctx.shadowBlur=base*.03;ctx.shadowOffsetY=base*.012}
    ctx.drawImage(c,x,y,w,h);ctx.restore();return{x,y,w,h}};
  e.who=(i,b,o,shape)=>{o=o||{};if(e.hasCut(i)&&!o.noCut)return e.cut(i,b,o);
    const s=Math.min(b.w,b.h*.9),r={x:b.x+(b.w-s)/2,y:b.y+b.h-s,w:s,h:s};e.pic(i,r,shape||'circle');return r};
  e.C.W=W;e.C.H=H;e.W=W;e.H=H;
  ctx.save();ctx.clearRect(0,0,W,H);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
  try{CUSTOM[tpl](ctx,e,cdata(e,DEMO[tpl]||D0))}catch(err){console.error(tpl,err);ctx.fillStyle='#222';ctx.fillRect(0,0,W,H)}
  ctx.restore();
}
/* blocs communs */
function sideLine(ctx,e,text,x,w,o){
  const l=bLine(ctx,e,text,x+w*.19,w*.62,o);
  return{h:l.h,paint(y){l.paint(y);const cy=y+l.h/2,g=o.z*.9,a=x+w*.04,b1=x+w/2-l.tw/2-g,c=x+w/2+l.tw/2+g,d1=x+w*.96;
    ctx.save();ctx.strokeStyle=o.line;ctx.lineWidth=Math.max(2,o.z*.07);ctx.beginPath();if(b1>a){ctx.moveTo(a,cy);ctx.lineTo(b1,cy)}if(d1>c){ctx.moveTo(c,cy);ctx.lineTo(d1,cy)}ctx.stroke();ctx.restore()}};
}
function dateBox(ctx,e,x,w,d,o){
  const z=o.z,h=z*3.4,two=!!d.time,wl=two?w*(o.split||.62):w;
  const l1=d.wd?bLine(ctx,e,d.wd,x,wl,{z:z*.6,c:o.lc,a:'center',ls:.3,up:true}):null;
  const big=bLine(ctx,e,[d.day,d.mon].filter(Boolean).join(' '),x+wl*.05,wl*.9,{z:z*1.15,c:o.fg,a:'center',r:'bb',up:true,ls:.02});
  const l2=two?bLine(ctx,e,'À partir de',x+wl,w-wl,{z:z*.6,c:o.lc,a:'center',ls:.3,up:true}):null;
  const tm=two?bLine(ctx,e,d.time.toUpperCase(),x+wl+(w-wl)*.05,(w-wl)*.9,{z:z*1.15,c:o.fg,a:'center',r:'bb'}):null;
  return{h,paint(y){
    rr(ctx,x,y,w,h,z*.2,o.fill,o.line,2);
    if(two){ctx.save();ctx.strokeStyle=o.line;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+wl,y);ctx.lineTo(x+wl,y+h);ctx.stroke();ctx.restore()}
    const t0=y+(h-(l1?l1.h:0)-big.h)/2;if(l1)l1.paint(t0);big.paint(t0+(l1?l1.h:0));
    if(two){const t1=y+(h-l2.h-tm.h)/2;l2.paint(t1);tm.paint(t1+l2.h)}}};
}
function placeBlock(ctx,e,x,w,d,o){
  const ico=o.z*1.7,t=bLine(ctx,e,d.place.t,x,w-ico*1.4,{z:o.z,c:o.c,r:'bb',a:'left'});
  const ds=d.place.d?bPara(ctx,e,d.place.d,x,w,{z:o.z*.8,c:o.dc||o.c,a:o.a||'center',max:2,lh:1.25}):bGap(0);
  const al=o.a||'center',x0=al==='center'?x+(w-(ico*1.25+t.tw))/2:x;
  return{h:Math.max(ico,t.h)+(ds.h?o.z*.25+ds.h:0),paint(y){const hh=Math.max(ico,t.h);
    mi(ctx,'pin',x0+ico*.45,y+hh/2,ico*.5,o.ic||o.c);t.paint(y+(hh-t.h)/2,x0+ico*1.25-x);if(ds.h)ds.paint(y+hh+o.z*.25)}};
}
function pillBlock(ctx,e,text,x,w,o){
  const z=o.z,l=bLine(ctx,e,text,x,w,{z,c:o.fg,a:'center',r:'bb',ls:o.ls||.12,up:true}),pw=Math.min(w,l.tw+z*3),h=z*2.5,px=x+(w-pw)/2;
  return{h,paint(y){const g=ctx.createLinearGradient(px,0,px+pw,0);g.addColorStop(0,o.fill);g.addColorStop(1,o.fill2||o.fill);rr(ctx,px,y,pw,h,h/2,g);l.paint(y+(h-l.h)/2)}};
}
function dashBox(ctx,x,w,h,col,lw){return(y)=>{ctx.save();ctx.setLineDash([lw*3,lw*2.2]);rr(ctx,x,y,w,h,h*.12,null,col,lw);ctx.restore()}}
function ribbon(ctx,W,H,left,col){
  ctx.save();if(!left){ctx.translate(W,0);ctx.scale(-1,1)}ctx.scale(.6,1);
  const g=ctx.createLinearGradient(0,0,W*.2,0);g.addColorStop(0,tint(col,.45));g.addColorStop(.6,col);g.addColorStop(1,shade(col,.35));
  ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(0,H*.37);ctx.bezierCurveTo(W*.17,H*.39,W*.22,H*.47,W*.1,H*.52);ctx.bezierCurveTo(W*.02,H*.56,W*.14,H*.62,W*.12,H*.67);ctx.bezierCurveTo(W*.1,H*.72,W*.04,H*.74,0,H*.75);ctx.closePath();ctx.fill();
  ctx.fillStyle=rgba(shade(col,.5),.55);ctx.beginPath();ctx.moveTo(0,H*.5);ctx.bezierCurveTo(W*.1,H*.5,W*.15,H*.55,W*.09,H*.59);ctx.bezierCurveTo(W*.05,H*.62,W*.03,H*.64,0,H*.66);ctx.closePath();ctx.fill();ctx.restore();
}
const foot=(ctx,e,x,w,fg,o)=>bFoot(ctx,e,x,w,{z:e.u*.048,a:'center',fg,rows:2,...(o||{})});
const goldOf=(e,bg)=>lift(satOf(e.C.second)>.3?e.C.second:e.C.accent,bg,4.5);

/* ---- Invitation nuit ---- */
DEMO.invit_nuit=DM({kicker:'Vous êtes cordialement invités à la',slogan:'Tous sont les bienvenus'});
CUSTOM.invit_nuit=(ctx,e,d)=>{
  const{W,H,u,m,P:p}=e,bg=p.deep,x=m*1.15,w=W-2*x,gold=goldOf(e,bg);
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);glow(ctx,W*.5,H*.04,H*.7,p.pri,.8);
  ctx.save();ctx.globalAlpha=.22;e.photo({x:0,y:0,w:W,h:H},'rect',0);ctx.restore();
  gradRect(ctx,0,0,W,H,'v',[[0,rgba(bg,.5)],[1,rgba(bg,.88)]]);glow(ctx,W*.04,H*.99,W*.75,p.sec,.55);
  ctx.fillStyle=p.sec;ctx.fillRect(0,0,W*.5,u*.014);ctx.fillStyle=gold;ctx.fillRect(W*.5,0,W*.5,u*.014);
  ctx.save();ctx.strokeStyle=rgba(gold,.32);ctx.lineWidth=2;[.38,.31].forEach(k=>{ctx.beginPath();ctx.arc(W*.97,H*.52,W*k,0,7);ctx.stroke()});ctx.restore();
  flowFit(ctx,e,s=>{const z=u*s;
    const lg=bLogo(ctx,e,x,w,z*.2,'c'),k=bLine(ctx,e,d.kicker,x,w,{z:z*.022,c:gold,a:'center',ls:.26,up:true});
    const t=bTitle(ctx,e,x,w,{size:z*.15,lines:3,a:'center',c:'#FFFFFF',hl:gold,nosub:true,up:false});
    const og=sideLine(ctx,e,d.org,x,w,{z:z*.04,c:'#FFFFFF',a:'center',r:'bb',ls:.5,up:true,line:rgba(gold,.8)});
    const sb=bPara(ctx,e,v.sub,x+w*.08,w*.84,{z:z*.024,c:rgba('#FFFFFF',.85),a:'center',ls:.14,up:true,lh:1.55,max:3});
    const db=dateBox(ctx,e,x,w,d,{z:z*.042,fg:'#FFFFFF',lc:gold,line:gold,fill:rgba('#FFFFFF',.08)});
    const pl=placeBlock(ctx,e,x,w,d,{z:z*.033,c:'#FFFFFF',dc:rgba('#FFFFFF',.8),ic:p.sec==='#FFFFFF'?gold:lift(p.sec,bg,3)});
    const sl=d.slogan?bLine(ctx,e,d.slogan,x,w,{z:z*.022,c:gold,a:'center',ls:.3,up:true}):bGap(0);
    const ft=foot(ctx,e,x,w,rgba('#FFFFFF',.8));
    const L=[lg,k,t,og,sb,db,pl,sl,ft];L[0].g=0;L[1].g=.6;L[2].g=.9;L[3].g=1;L[4].g=.5;L[5].g=1.2;L[6].g=.9;L[7].g=.9;L[8].g=.5;return L.filter(b=>b.h>0)},m*1.2,H-m,.6,1.3);
};

/* ---- Invitation gala (rouge et or) ---- */
DEMO.invit_gala=DM({kicker:'Vous invite à son',slogan:'Vous êtes tous les bienvenus'});
CUSTOM.invit_gala=(ctx,e,d)=>{
  const{W,H,u,m,P:p,C}=e,bg=shade(p.deep,.35),x=m*1.4,w=W-2*x,gold=lift(satOf(C.second)>.3&&lum(C.second)>.25?C.second:'#F2B632',bg,5);
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
  ctx.save();ctx.globalAlpha=.55;e.photo({x:0,y:0,w:W,h:H},'rect',0);ctx.restore();
  gradRect(ctx,0,0,W,H,'v',[[0,rgba(p.deep,.82)],[.5,rgba(p.pri,.6)],[1,rgba(shade(p.deep,.5),.92)]]);
  ctx.save();[0,1].forEach(sd=>{ctx.save();if(sd){ctx.translate(W,0);ctx.scale(-1,1)}ctx.fillStyle=rgba('#000',.22);ctx.fillRect(0,H*.08,W*.17,H*.92);
    ctx.strokeStyle=rgba(gold,.18);ctx.lineWidth=3;for(let i=1;i<7;i++){ctx.beginPath();ctx.moveTo(W*.024*i,H*.12);ctx.lineTo(W*.024*i,H);ctx.stroke()}
    ctx.beginPath();ctx.arc(W*.085,H*.14,W*.085,Math.PI,0);ctx.strokeStyle=rgba(gold,.3);ctx.stroke();ctx.restore()});ctx.restore();
  ribbon(ctx,W,H,true,gold);ribbon(ctx,W,H,false,gold);
  glow(ctx,W*.5,H*.5,W*.6,p.sec,.25);
  flowFit(ctx,e,s=>{const z=u*s;
    const lg=bLogo(ctx,e,x,w,z*.15,'c'),og=bLine(ctx,e,d.org,x,w,{z:z*.034,c:'#FFFFFF',a:'center',r:'bb',ls:.2,up:true});
    const pk=pillBlock(ctx,e,d.kicker,x+w*.2,w*.6,{z:z*.026,fg:'#FFFFFF',fill:p.sec,fill2:shade(p.sec,.25)});
    const t=bTitle(ctx,e,x+w*.1,w*.8,{size:z*.17,lines:3,a:'center',c:'#FFFFFF',hl:gold,nosub:true,up:true});
    const sb=bPara(ctx,e,v.sub,x+w*.06,w*.88,{z:z*.026,c:gold,a:'center',ls:.14,up:true,r:'bb',lh:1.3,max:3});
    const dbw=w*.88,dx=x+(w-dbw)/2,bh=z*.1;
    const db={h:bh,paint(y){rr(ctx,dx,y,dbw*.64,bh,bh*.1,'#FFFFFF');rr(ctx,dx+dbw*.64,y,dbw*.36,bh,bh*.1,gold);
      mi(ctx,'calendar',dx+bh*.5,y+bh/2,bh*.27,'#10151A');
      const l=bLine(ctx,e,[d.wd,d.day+' '+d.mon].filter(Boolean).join(', '),dx+bh*.95,dbw*.64-bh*1.05,{z:z*.03,c:'#10151A',r:'bb',a:'left',up:true});l.paint(y+(bh-l.h)/2);
      if(d.time){mi(ctx,'clock',dx+dbw*.64+bh*.45,y+bh/2,bh*.26,'#10151A');const t2=bLine(ctx,e,d.time.toUpperCase(),dx+dbw*.64+bh*.85,dbw*.36-bh*.95,{z:z*.034,c:'#10151A',r:'bb',a:'left'});t2.paint(y+(bh-t2.h)/2)}}};
    const pl=placeBlock(ctx,e,x,w,d,{z:z*.03,c:'#FFFFFF',dc:rgba('#FFFFFF',.9),ic:'#FFFFFF'});
    const sl=d.slogan?bLine(ctx,e,'.... '+d.slogan.toLowerCase()+' ....',x,w,{z:z*.022,c:rgba('#FFFFFF',.9),a:'center',ls:.2}):bGap(0);
    const ft=foot(ctx,e,x,w,rgba('#FFFFFF',.85));
    const L=[lg,og,pk,t,sb,db,pl,sl,ft];L[0].g=0;L[1].g=.4;L[2].g=1.3;L[3].g=.8;L[4].g=.5;L[5].g=1;L[6].g=.9;L[7].g=.8;L[8].g=.4;return L.filter(b=>b.h>0)},m*1.1,H-m*.9,.6,1.3);
};

/* ---- Invitation claire (soie bleue, confettis) ---- */
DEMO.invit_voile=DM({kicker:'',slogan:'',body:'Venez nous rencontrer toute la journée, à partir de 11h',tags:'Cadeaux, Surprises & plus',org:''});
CUSTOM.invit_voile=(ctx,e,d)=>{
  const{W,H,u,m,P:p,C}=e,bg=tint(p.pri,.95),x=m*1.5,w=W-2*x;
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);glow(ctx,W*.5,H*.38,W*.7,'#FFFFFF',.9);
  const blob=(cx,cy,rx,ry,rot)=>{ctx.save();ctx.translate(cx,cy);ctx.rotate(rot);ctx.beginPath();ctx.ellipse(0,0,rx,ry,0,0,7);ctx.restore()};
  [[-.07,.05,.22,.13,.5],[-.03,.3,.12,.08,-.4],[.2,1.09,.5,.1,.1],[1.07,1.07,.28,.1,-.5]].forEach((b,i)=>{
    ctx.save();blob(W*b[0],H*b[1],W*b[2],W*b[3],b[4]);ctx.clip();
    gradRect(ctx,0,0,W,H,'h',[[0,tint(i%2?p.sec:p.pri,.1)],[1,tint(p.pri,.2)]]);
    ctx.globalCompositeOperation='multiply';ctx.globalAlpha=.18;e.photo({x:0,y:0,w:W,h:H},'rect',0);ctx.restore()});
  confetti(ctx,W,H,[p.pri,p.sec,p.ter,'#7B61FF','#FFB02E'],46,11);
  const ink=shade(p.pri,.1);
  flowFit(ctx,e,s=>{const z=u*s;
    const lg=bLogo(ctx,e,x,w,z*.14,'c');
    const t=bTitle(ctx,e,x,w,{size:z*.17,lines:3,a:'center',c:ink,hl:p.sec,nosub:true,up:true});
    const og=sideLine(ctx,e,d.org,x,w,{z:z*.034,c:ink,a:'center',r:'bb',up:true,ls:.04,line:p.pri});
    const sb=bPara(ctx,e,v.sub,x,w,{z:z*.03,c:ink,a:'center',r:'bb',lh:1.3,max:2});
    const bw=w*.86,bx=x+(w-bw)/2,bp=bPara(ctx,e,d.body.t+(d.body.d?' '+d.body.d:''),bx+z*.03,bw-z*.06,{z:z*.03,c:ink,a:'center',r:'bb',lh:1.3,max:3});
    const bb={h:bp.h+z*.06,paint(y){dashBox(ctx,bx,bw,bp.h+z*.06,p.pri,3)(y);bp.paint(y+z*.03)}};
    const tg=d.tags.length?(()=>{const n=Math.min(d.tags.length,3),gw=w*.9/n-z*.015,hh=z*.07,ls=d.tags.slice(0,n).map(t=>bLine(ctx,e,t,0,gw-z*.04,{z:z*.026,c:ink,a:'center',r:'bb'}));
      return{h:hh,paint(y){ls.forEach((l,i)=>{const gx=x+w*.05+i*(gw+z*.015);dashBox(ctx,gx,gw,hh,i%2?p.pri:ink,3)(y);const q=bLine(ctx,e,d.tags[i],gx+z*.02,gw-z*.04,{z:l.z,c:ink,a:'center',r:'bb'});q.paint(y+(hh-q.h)/2)})}}})():bGap(0);
    const row=(ic,txt,sub,y0)=>{const t1=bLine(ctx,e,txt,0,w*.8,{z:z*.034,c:ink,a:'left'});return{h:z*.075,paint(y){mi(ctx,ic,x+w*.22,y+z*.0375,z*.022,p.pri);t1.paint(y+z*.0375-t1.h/2,x+w*.22+z*.05)}}};
    const dr={h:z*.07,paint(y){ctx.save();ctx.strokeStyle=rgba(p.pri,.5);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+w*.2,y);ctx.lineTo(x+w*.8,y);ctx.moveTo(x+w*.2,y+z*.07);ctx.lineTo(x+w*.8,y+z*.07);ctx.stroke();ctx.restore();
      mi(ctx,'calendar',x+w*.24,y+z*.035,z*.022,p.pri);const t1=bLine(ctx,e,[d.wd,d.day+' '+d.mon].filter(Boolean).join(' ')+(d.time?' · '+d.time:''),x+w*.3,w*.52,{z:z*.03,c:ink,a:'left',r:'bb'});t1.paint(y+z*.035-t1.h/2)}};
    const pl=placeBlock(ctx,e,x+w*.1,w*.8,d,{z:z*.03,c:ink,dc:ink,ic:p.pri,a:'left'});
    const ft=foot(ctx,e,x,w,ink,{});
    const L=[lg,t,og,sb,bb,tg,dr,pl,ft];L[0].g=0;L[1].g=.8;L[2].g=.7;L[3].g=.4;L[4].g=1.1;L[5].g=.6;L[6].g=1.2;L[7].g=.8;L[8].g=.5;return L.filter(b=>b.h>0)},m*1.1,H-m,.6,1.3);
};

/* ---- Événement (photo sous voile de couleur, thème surligné) ---- */
DEMO.evenement=DM({body:'Thème|Ensemble, construisons un avenir meilleur pour tous',slogan:'Vous êtes tous invités'});
CUSTOM.evenement=(ctx,e,d)=>{
  const{W,H,u,m,P:p}=e,x=m*1.1,w=W-2*x,yel=lum(p.ter)>.45?p.ter:'#FFE14D',dk='#10151A';
  e.photo({x:0,y:0,w:W,h:H},'rect',0);
  gradRect(ctx,0,0,W,H,'v',[[0,rgba(p.pri,.35)],[.4,rgba(p.pri,.62)],[1,rgba(shade(p.pri,.45),.94)]]);
  flowFit(ctx,e,s=>{const z=u*s;
    const lg=bLogo(ctx,e,x,w,z*.1,'c');
    const t=bTitle(ctx,e,x,w,{size:z*.13,lines:3,a:'left',c:'#FFFFFF',hl:yel,nosub:true,up:true});
    const sb=bPara(ctx,e,v.sub,x,w,{z:z*.032,c:'#FFFFFF',r:'bb',up:true,lh:1.25,max:2});
    const th=d.body.t?(()=>{const sw=z*.06,tp=bPara(ctx,e,d.body.d||d.body.t,x+sw+z*.025,w-sw-z*.05,{z:z*.033,c:dk,r:'bb',lh:1.25,max:3}),h=tp.h+z*.05;
      return{h,paint(y){ctx.fillStyle=yel;ctx.fillRect(x+sw,y,w-sw,h);ctx.fillStyle='#FFFFFF';ctx.fillRect(x,y,sw,h);tp.paint(y+z*.025);
        ctx.save();ctx.translate(x+sw/2,y+h/2);ctx.rotate(-Math.PI/2);ctx.font=FT(e,'bb',z*.026);ctx.fillStyle=dk;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(d.body.d?d.body.t:'Thème',0,0);ctx.restore()}}})():bGap(0);
    const lw=w*.46,rx=x+w*.52,rw=w*.48;
    const dl1=bLine(ctx,e,d.wd,x+z*.02,lw-z*.04,{z:z*.026,c:dk,a:'left',r:'d'}),dl2=bLine(ctx,e,[d.day,d.mon].join(' '),x+z*.02,lw-z*.04,{z:z*.06,c:dk,a:'left',r:'bb',up:true});
    const dh=dl1.h+dl2.h+z*.04,tm=d.time?bLine(ctx,e,d.time.toUpperCase(),x,lw,{z:z*.045,c:p.pri,a:'center',r:'bb'}):null;
    const pb=placeBlock(ctx,e,rx,rw,d,{z:z*.03,c:'#FFFFFF',dc:'#FFFFFF',ic:yel,a:'left'});
    const sl=d.slogan?bLine(ctx,e,d.slogan,rx,rw,{z:z*.026,c:dk,a:'center',r:'bb'}):null;
    const rowH=Math.max(dh+(tm?tm.h+z*.05:0),pb.h+(sl?sl.h+z*.08:0));
    const row={h:rowH,paint(y){ctx.fillStyle=yel;ctx.fillRect(x,y,lw,dh);dl1.paint(y+z*.02);dl2.paint(y+z*.02+dl1.h);
      if(tm){ctx.fillStyle='#FFFFFF';ctx.fillRect(x,y+dh+z*.03,lw*.62,tm.h+z*.04);tm.paint(y+dh+z*.05,0);}
      pb.paint(y);if(sl){const sy=y+pb.h+z*.04,sw2=Math.min(rw,sl.tw+z*.06);ctx.fillStyle='#FFFFFF';ctx.fillRect(rx,sy,sw2,sl.h+z*.03);sl.paint(sy+z*.015,-(rw-sw2)/2+0)}}};
    if(tm)tm.paint=(f=>(y)=>f(y,-(lw-lw*.62)/2))(tm.paint);
    const ft=foot(ctx,e,x,w,'#FFFFFF',{a:'left'});
    const L=[lg,t,sb,th,row,ft];L[0].g=0;L[1].g=1.3;L[2].g=.5;L[3].g=1;L[4].g=1.2;L[5].g=.6;return L.filter(b=>b.h>0)},m*.9,H-m,.6,1.35);
};

/* ---- Invitation rideau ---- */
DEMO.invit_rideau=DM({slogan:'',kicker:''});
CUSTOM.invit_rideau=(ctx,e,d)=>{
  const{W,H,u,m,P:p}=e,x=m*1.1,w=W-2*x,ink=p.ink,zh=H*.6;
  ctx.fillStyle='#FFFFFF';ctx.fillRect(0,0,W,H);
  e.photo({x:0,y:0,w:W,h:zh},'rect',0);
  gradRect(ctx,0,0,W,zh,'v',[[0,rgba(p.pri,.3)],[1,rgba(shade(p.pri,.5),.82)]]);
  for(let i=0;i<9;i++){ctx.fillStyle=rgba(i%2?'#000':'#FFF',.1);ctx.fillRect(i*W*.03,0,W*.03,zh)}
  gradRect(ctx,0,0,W*.3,zh,'h',[[0,rgba('#000',.3)],[1,rgba('#000',0)]]);
  flowFit(ctx,e,s=>{const z=u*s;
    const lg=bLogo(ctx,e,x,w,z*.1,'l');
    const t=bTitle(ctx,e,x+w*.28,w*.72,{size:z*.12,lines:3,a:'left',c:'#FFFFFF',hl:lift(p.ter,p.pri,3),nosub:true,up:true});
    const sb=bPara(ctx,e,v.sub,x+w*.28,w*.72,{z:z*.034,c:'#FFFFFF',lh:1.25,max:2});
    const og=bLine(ctx,e,d.org,x+w*.28,w*.72,{z:z*.07,c:lift(p.ter,p.pri,3),r:'s',a:'left'});
    const L=[lg,t,sb,og];L[0].g=0;L[1].g=.6;L[2].g=.3;L[3].g=.3;return L},m*.8,zh-u*.1,.6,1.3);
  const bh=u*.13,by=zh-bh/2,bx=x*.6,bw=W-bx*2;
  ctx.save();ctx.shadowColor='rgba(0,0,0,.25)';ctx.shadowBlur=20;rr(ctx,bx,by,bw,bh,bh*.08,'#FFFFFF');ctx.restore();
  const cw=bw*.66;mi(ctx,'calendar',bx+bh*.55,by+bh/2,bh*.26,p.pri);
  const l1=bLine(ctx,e,d.wd,bx+bh*1.0,cw-bh*1.1,{z:bh*.2,c:ink,a:'left',r:'d',up:true,ls:.1}),l2=bLine(ctx,e,[d.day,d.mon].join(' '),bx+bh*1.0,cw-bh*1.1,{z:bh*.4,c:ink,a:'left',r:'bb',up:true});
  const t0=by+(bh-(d.wd?l1.h:0)-l2.h)/2;if(d.wd)l1.paint(t0);l2.paint(t0+(d.wd?l1.h:0));
  if(d.time){const g=ctx.createLinearGradient(bx+cw,0,bx+bw-bh*.1,0);g.addColorStop(0,p.sec);g.addColorStop(1,p.pri);rr(ctx,bx+cw,by+bh*.18,bw-cw-bh*.18,bh*.64,bh*.06,g);
    const tt=bLine(ctx,e,d.time.toUpperCase(),bx+cw,bw-cw-bh*.18,{z:bh*.38,c:readableOn(p.pri,'#FFFFFF','#10151A'),a:'center',r:'bb'});tt.paint(by+bh*.5-tt.h/2)}
  flowFit(ctx,e,s=>{const z=u*s;
    const pl=placeBlock(ctx,e,x,w,d,{z:z*.034,c:ink,dc:ink,ic:p.sec,a:'center'});const ft=foot(ctx,e,x,w,ink);
    const sl=d.slogan?bLine(ctx,e,d.slogan,x,w,{z:z*.03,c:p.pri,a:'center',r:'bb'}):bGap(0);
    const L=[pl,sl,ft];L[0].g=0;return L.filter(b=>b.h>0)},by+bh+m*.5,H-m*.8,.6,1.3);
};

/* ---- en-tête de flyer ---- */
function flyHead(ctx,e,d,x,y,w,h,ink,rule,z){
  const lg=bLogo(ctx,e,x,h,h,'l'),lw=Math.max(lg.bw||h,h*.7),tx=x+lw+z*.04;
  const og=bPara(ctx,e,d.org,tx+z*.03,w-lw-z*.1,{z:z*.045,c:ink,r:'bb',lh:1.12,max:3});
  const kk=d.kicker?bPara(ctx,e,d.kicker,tx+z*.03,w-lw-z*.1,{z:z*.034,c:rule,r:'b',lh:1.2,max:2,hl:rule}):bGap(0);
  const th=og.h+(kk.h?z*.02+kk.h:0);
  lg.paint(y);ctx.fillStyle=rule;ctx.fillRect(tx-z*.01,y+h*.08,Math.max(3,z*.004),h*.84);og.paint(y+(h-th)/2);if(kk.h)kk.paint(y+(h-th)/2+og.h+z*.02);
}
/* ---- Flyer lancement ---- */
DEMO.flyer_lancement=DM({kicker:'Ensemble pour une finance au service de tous !',secA:'Date du lancement',secB:'Ensemble, construisons votre avenir !',slogan:'Votre avenir commence ici !',
  body:'|Une organisation créée pour favoriser l\'inclusion et accompagner le développement de ses membres et de leurs communautés.',
  listA:'Solidarité\nConfiance\nDéveloppement'});
CUSTOM.flyer_lancement=(ctx,e,d)=>{
  const{W,H,u,m,P:p,C}=e,z=Math.min(u,H/1.5),ink=shade(p.pri,.15),x=m*.9,w=W-2*x,yel=lum(p.ter)>.4?p.ter:'#FFD23F';
  ctx.fillStyle='#FFFFFF';ctx.fillRect(0,0,W,H);
  /* coins */
  ctx.fillStyle=yel;ctx.beginPath();ctx.moveTo(W*.7,0);ctx.quadraticCurveTo(W*.9,H*.02,W,H*.07);ctx.lineTo(W,0);ctx.fill();
  ctx.fillStyle=p.sec;ctx.beginPath();ctx.moveTo(W*.62,0);ctx.quadraticCurveTo(W*.88,H*.015,W,H*.05);ctx.lineTo(W,H*.025);ctx.quadraticCurveTo(W*.88,0,W*.8,0);ctx.fill();
  ctx.fillStyle=p.pri;ctx.beginPath();ctx.moveTo(W*.8,0);ctx.quadraticCurveTo(W*.92,H*.012,W,H*.03);ctx.lineTo(W,0);ctx.fill();
  /* en-tête */
  flyHead(ctx,e,d,x,m*.5,w*.86,z*.2,ink,p.sec,z);
  /* photo */
  const py=H*.2,ph=H*.29,px=W*.5;e.photo({x:px,y:py,w:W-px-m*.4,h:ph},'round',z*.05);
  /* titre en rubans */
  ctx.save();ctx.translate(0,0);
  const ty=H*.215,tw=W*.5;
  const tt=bTitle(ctx,e,x+z*.05,tw-z*.12,{size:z*.11,lines:3,a:'left',c:'#FFFFFF',hl:'#FFFFFF',nosub:true,up:true});
  const rh=tt.h+z*.06;ctx.save();ctx.rotate(-.045);ctx.translate(0,z*.04);
  poly(ctx,[[x*.4,ty],[x+tw,ty+z*.02],[x+tw-z*.03,ty+rh+z*.02],[x*.4,ty+rh]],p.sec);ctx.restore();ctx.restore();
  ctx.save();ctx.rotate(-.045);ctx.translate(0,z*.04);tt.paint(ty+z*.03);ctx.restore();
  const sb=bPara(ctx,e,v.sub,x,W*.43,{z:z*.03,c:ink,r:'bb',up:true,lh:1.2,max:3});sb.paint(ty+rh+z*.06);
  /* bande bleue */
  const by=H*.5,bh=H*.15;
  poly(ctx,[[0,by],[W*.7,by],[W*.64,by+bh],[0,by+bh]],ink);
  const bp=bPara(ctx,e,d.body.d||d.body.t,x,W*.56-x,{z:z*.029,c:'#FFFFFF',lh:1.22,max:6});bp.paint(by+(bh-bp.h)/2);
  /* date */
  const dy=H*.665;
  ctx.save();ctx.fillStyle=p.sec;ctx.beginPath();ctx.moveTo(x*.4,dy);ctx.lineTo(W*.56,dy);ctx.lineTo(W*.53,dy+z*.07);ctx.lineTo(x*.4,dy+z*.07);ctx.fill();ctx.restore();
  mi(ctx,'calendar',x+z*.03,dy+z*.035,z*.024,'#FFFFFF');const sl=bLine(ctx,e,d.secA,x+z*.08,W*.42,{z:z*.034,c:'#FFFFFF',r:'bb',up:true,a:'left'});sl.paint(dy+z*.035-sl.h/2);
  const gy=dy+z*.1;
  mi(ctx,'calendar',x+z*.05,gy+z*.075,z*.05,p.sec);
  const wd=bLine(ctx,e,d.wd,x+z*.13,W*.3,{z:z*.036,c:ink,r:'bb',up:true,a:'left'}),dd=bLine(ctx,e,d.day,x+z*.13,W*.2,{z:z*.11,c:p.sec,r:'bb',a:'left'}),mm=bLine(ctx,e,d.mon,x+z*.13,W*.3,{z:z*.03,c:ink,r:'bb',up:true,a:'left'});
  wd.paint(gy);dd.paint(gy+wd.h*.8);mm.paint(gy+wd.h*.8+dd.h*.9);
  ctx.fillStyle=rgba(ink,.4);ctx.fillRect(W*.4,gy,3,z*.2);
  const rx=W*.44,rw=W*.31;
  let ry=gy;
  if(d.time){mi(ctx,'clock',rx+z*.025,ry+z*.03,z*.026,p.sec);const tm=bLine(ctx,e,d.time,rx+z*.06,rw,{z:z*.055,c:p.sec,r:'bb',a:'left'});tm.paint(ry);ry+=tm.h+z*.012}
  mi(ctx,'pin',rx+z*.025,ry+z*.03,z*.026,p.sec);
  const pp=bPara(ctx,e,d.place.t,rx+z*.06,rw-z*.05,{z:z*.032,c:ink,r:'bb',lh:1.15,max:2});pp.paint(ry);ry+=pp.h;
  if(d.place.d){const pd=bPara(ctx,e,d.place.d,rx+z*.06,rw-z*.05,{z:z*.024,c:ink,lh:1.2,max:3});pd.paint(ry)}
  /* pinceau */
  const bx=W*.77,bwid=W-bx-m*.2,byy=H*.665;
  ctx.fillStyle=yel;ctx.beginPath();ctx.moveTo(bx,byy+z*.08);ctx.quadraticCurveTo(bx+bwid*.1,byy,bx+bwid*.4,byy+z*.03);ctx.lineTo(W-m*.3,byy+z*.01);ctx.lineTo(W-m*.5,byy+z*.28);ctx.quadraticCurveTo(bx+bwid*.5,byy+z*.3,bx+z*.02,byy+z*.26);ctx.closePath();ctx.fill();
  if(d.slogan){ctx.save();ctx.translate(bx+bwid*.5,byy+z*.15);ctx.rotate(-.1);const sp=bPara(ctx,e,d.slogan,-bwid*.4,bwid*.8,{z:z*.04,c:ink,r:'s',a:'center',lh:1.1,max:3});sp.paint(-sp.h/2);ctx.restore()}
  /* pied */
  const fy=H*.86;
  ctx.fillStyle=p.sec;ctx.beginPath();ctx.moveTo(0,fy+z*.03);ctx.quadraticCurveTo(W*.5,fy-z*.06,W,fy+z*.04);ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.fill();
  ctx.fillStyle=ink;ctx.beginPath();ctx.moveTo(0,fy+z*.05);ctx.quadraticCurveTo(W*.5,fy-z*.03,W,fy+z*.065);ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.fill();
  const fb=d.secB?bPara(ctx,e,d.secB,x,W*.36,{z:z*.04,c:'#FFFFFF',r:'s',lh:1.1,max:3}):null;if(fb)fb.paint(fy+(H-fy-fb.h)/2+z*.02);
  const it=d.listA.slice(0,3);if(it.length){const iw=(W*.56)/it.length,R=z*.045;it.forEach((q,i)=>{const cx=W*.42+iw*i+iw/2,cy=fy+z*.1;icoDisc(ctx,iconFor(q,i),cx,cy,R,[p.sec,yel,'#FFFFFF'][i%3],i%3===2?ink:readableOn([p.sec,yel][i%3]||yel,'#FFFFFF','#10151A'));
    const l=bLine(ctx,e,q.t,cx-iw/2,iw,{z:z*.024,c:'#FFFFFF',r:'bb',a:'center'});l.paint(cy+R+z*.01)})}
  else{const ft=foot(ctx,e,W*.4,W*.55,'#FFFFFF');ft.paint(fy+z*.08)}
};

/* ---- utilitaires de mise en page ---- */
function swooshClip(ctx,x0,y,W,hh){ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(W,y);ctx.lineTo(W,y+hh*.92);ctx.quadraticCurveTo(W*.74,y+hh*1.02,x0+(W-x0)*.18,y+hh*.38);ctx.quadraticCurveTo(x0,y+hh*.1,x0,y)}
function swooshPhoto(ctx,e,x0,y,hh,col,col2){
  const W=e.W;ctx.save();swooshClip(ctx,x0,y,W,hh);ctx.clip();e.photo({x:x0,y,w:W-x0,h:hh},'rect',0);ctx.restore();
  ctx.save();swooshClip(ctx,x0,y,W,hh);ctx.lineWidth=e.u*.014;ctx.strokeStyle=col;ctx.stroke();ctx.restore();
  if(col2){ctx.save();ctx.translate(-e.u*.012,e.u*.004);swooshClip(ctx,x0,y,W,hh);ctx.lineWidth=e.u*.006;ctx.strokeStyle=col2;ctx.stroke();ctx.restore()}
}
function waveBand(ctx,y,h,W,col,amp){ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(0,y+amp);ctx.bezierCurveTo(W*.25,y-amp,W*.5,y+amp*2,W,y);ctx.lineTo(W,y+h-amp);ctx.bezierCurveTo(W*.7,y+h+amp,W*.4,y+h-amp*2,0,y+h);ctx.closePath();ctx.fill()}
function bullets(ctx,e,text,x,w,o){
  const parts=String(text||'').split(/\s*;\s*/).filter(Boolean),ps=parts.map(t=>bPara(ctx,e,t,x+o.z*.9,w-o.z*.9,{z:o.z,c:o.c,lh:1.2,max:2}));
  const h=ps.reduce((n,q)=>n+q.h,0)+o.z*.12*Math.max(0,ps.length-1);
  return{h,paint(y){let yy=y;ps.forEach(q=>{ctx.fillStyle=o.dot;ctx.beginPath();ctx.arc(x+o.z*.3,yy+o.z*.62,o.z*.13,0,7);ctx.fill();q.paint(yy);yy+=q.h+o.z*.12})}};
}

/* ---- Roll-up mission ---- */
DEMO.rollup_mission=DM({kicker:'Agir aujourd\'hui, bâtir demain !',slogan:'Ensemble pour une *économie locale forte* et inclusive',foot:'Votre confiance, notre engagement !',
  body:'Notre mission|Mobiliser les ressources, faciliter l\'accès aux services et accompagner les initiatives locales pour un développement durable et inclusif.',
  secA:'Nos objectifs',listA:'Promouvoir l\'épargne|auprès de tous les membres\nFaciliter l\'accès au crédit|pour soutenir les activités\nRenforcer l\'inclusion|financière et sociale\nContribuer au développement|économique local et durable',
  secB:'Nos services',listB:'Épargne|Des solutions sûres et accessibles à tous.\nCrédit|Des financements adaptés à vos projets.\nAccompagnement|Conseils et appui pour réussir.\nServices digitaux|Une gestion simple, rapide et sécurisée.'});
CUSTOM.rollup_mission=(ctx,e,d)=>{
  const{W,H,u,m,P:p}=e,x=m*.75,w=W-2*x,ink=shade(p.pri,.12);
  ctx.fillStyle='#FFFFFF';ctx.fillRect(0,0,W,H);
  flowFit(ctx,e,s=>{const z=u*s;
    const hh=z*.5,lw=W*.46;
    const head={h:hh,paint(y){swooshPhoto(ctx,e,W*.5,y,hh,p.sec);const lg=bLogo(ctx,e,x,lw-x,hh*.86,'l');lg.paint(y+hh*.06)}};
    const lc=w*.6,t=bTitle(ctx,e,x,lc,{size:z*.19,lines:2,a:'left',c:p.sec,hl:p.pri,nosub:true,up:true});
    const sb=bPara(ctx,e,v.sub,x,lc,{z:z*.032,c:ink,r:'bb',up:true,lh:1.2,max:3});
    const kk=d.kicker?bPara(ctx,e,d.kicker,x,lc,{z:z*.045,c:ink,r:'s',lh:1.1,max:2}):bGap(0);
    const rc=bPara(ctx,e,d.slogan,x+w*.66,w*.34,{z:z*.044,c:ink,r:'bb',hl:true,lh:1.18,max:5});
    Object.assign(rc,{});const nh=t.h+z*.015+sb.h+(kk.h?z*.02+kk.h:0);
    const name={h:Math.max(nh,rc.h),paint(y){t.paint(y);sb.paint(y+t.h+z*.015);if(kk.h){kk.paint(y+t.h+z*.035+sb.h);ctx.fillStyle=p.sec;ctx.fillRect(x,y+nh+z*.005,lc*.6,Math.max(3,z*.004))}
      ctx.fillStyle=ink;ctx.fillRect(x+w*.62,y+z*.01,Math.max(3,z*.005),Math.max(nh,rc.h)-z*.02);rc.paint(y+(Math.max(nh,rc.h)-rc.h)/2)}};
    /* mission */
    const mt=bLine(ctx,e,d.body.d?d.body.t:'',x+z*.2,w-z*.2,{z:z*.05,c:'#FFFFFF',r:'bb',up:true,a:'left'}),mp=bPara(ctx,e,d.body.d||d.body.t,x+z*.2,w-z*.2,{z:z*.034,c:'#FFFFFF',lh:1.22,max:5,hl:true});
    const mh=Math.max(z*.17,mt.h+mp.h+z*.02);
    const mis={h:mh+z*.08,paint(y){waveBand(ctx,y,mh+z*.08,W,ink,z*.015);icoDisc(ctx,'target',x+z*.08,y+(mh+z*.08)/2,z*.08,p.sec,'#FFFFFF');mt.paint(y+z*.04);mp.paint(y+z*.04+mt.h+z*.01)}};
    /* colonnes */
    const cw=w*.47,x2=W*.5+z*.02,w2=W-x2-x*.9;
    const pa=bPill(ctx,e,x,cw,{z:z*.034,fill:p.sec,fg:'#FFFFFF',text:d.secA,full:true,ico:'users',icoFg:p.sec});
    const ia=bItems(ctx,e,d.listA,x,cw,{z:z*.03,dz:z*.027,mode:'check',tc:ink,dc:ink,icoBg:p.sec,icoFg:'#FFFFFF',gap:z*.032});
    const pb=bPill(ctx,e,x2,w2,{z:z*.034,fill:p.sec,fg:'#FFFFFF',text:d.secB,full:true,ico:'gear',icoFg:p.sec});
    const ib=bItems(ctx,e,d.listB,x2+z*.02,w2-z*.04,{z:z*.03,dz:z*.026,mode:'icon',tc:'#FFFFFF',dc:'#FFFFFF',icoBg:null,ring:'#FFFFFF',icoFg:'#FFFFFF',gap:z*.032});
    const ch=Math.max(pa.h+z*.04+ia.h,pb.h+z*.04+ib.h)+z*.06;
    const cols={h:ch,paint(y){ctx.fillStyle=ink;ctx.fillRect(W*.5,y-z*.03,W*.5,ch+z*.06+z*.1);pa.paint(y);ia.paint(y+pa.h+z*.04);pb.paint(y);ib.paint(y+pb.h+z*.04)}};
    /* pied */
    const fb=d.foot?bPara(ctx,e,d.foot,x,W*.44-x,{z:z*.042,c:ink,r:'s',lh:1.1,max:3}):bGap(0);
    const ft=bFoot(ctx,e,W*.52,W*.46,{z:z*.042,a:'left',fg:'#FFFFFF',rows:4});
    const fh=Math.max(fb.h,ft.h,z*.14);
    const fo={h:fh+z*.04,paint(y){ctx.fillStyle=p.sec;ctx.beginPath();ctx.moveTo(0,y-z*.01);ctx.quadraticCurveTo(W*.5,y-z*.06,W,y-z*.03);ctx.lineTo(W,y+z*.03);ctx.lineTo(0,y+z*.03);ctx.fill();
      ctx.fillStyle=ink;ctx.fillRect(W*.5,y,W*.5,fh+z*.04);ctx.beginPath();ctx.moveTo(W*.5,y);ctx.lineTo(W*.44,y+fh+z*.04);ctx.lineTo(W*.5,y+fh+z*.04);ctx.fill();
      fb.paint(y+(fh-fb.h)/2+z*.02);ft.paint(y+(fh-ft.h)/2+z*.02)}};
    const L=[head,name,mis,cols,fo];L[0].g=0;L[1].g=.9;L[2].g=.8;L[3].g=1;L[4].g=.8;return L},m*.45,H-m*.4,.55,1.35);
};

/* ---- Flyer services ---- */
DEMO.flyer_services=DM({kicker:'Ensemble pour une finance au service de tous !',slogan:'Ensemble, construisons votre avenir !',
  body:'|Une organisation créée pour favoriser l\'inclusion financière et accompagner le développement de ses membres et des communautés.',
  secA:'Nos services',listA:'Collecte de l\'épargne|Sécurisez vos économies.\nOctroi de crédits|Soutenez vos projets.\nServices aux membres|Appui adapté à chacun.\nPaiements|Simplifiez vos transactions.\nAccompagnement|Conseils et développement.',
  secB:'Pourquoi nous choisir ?',listB:'*Une mutuelle*, pas une banque : vous êtes acteur\n*Des services* adaptés à vos besoins\n*Une gestion* transparente et participative\n*Un engagement* pour l\'inclusion'});
CUSTOM.flyer_services=(ctx,e,d)=>{
  const{W,H,u,m,P:p}=e,x=m*.85,w=W-2*x,ink=shade(p.pri,.12),yel=lum(p.ter)>.4?p.ter:'#FFD23F';
  ctx.fillStyle='#FFFFFF';ctx.fillRect(0,0,W,H);
  ctx.fillStyle=yel;ctx.beginPath();ctx.moveTo(W*.74,0);ctx.quadraticCurveTo(W*.92,H*.015,W,H*.06);ctx.lineTo(W,0);ctx.fill();
  ctx.fillStyle=p.sec;ctx.beginPath();ctx.moveTo(W*.8,0);ctx.quadraticCurveTo(W*.94,H*.01,W,H*.04);ctx.lineTo(W,0);ctx.fill();
  flowFit(ctx,e,s=>{const z=u*s;
    const head={h:z*.19,paint(y){flyHead(ctx,e,d,x,y,w*.84,z*.19,ink,p.sec,z)}};
    const hh=z*.56,bx=0;
    const t=bTitle(ctx,e,x,W*.5-x,{size:z*.095,lines:4,a:'left',c:'#FFFFFF',hl:yel,nosub:true,up:false,avail:hh*.5});
    const bp=bPara(ctx,e,d.body.d||d.body.t,x,W*.5-x,{z:z*.03,c:'#FFFFFF',lh:1.22,max:5});
    const hero={h:hh,paint(y){swooshPhoto(ctx,e,W*.5,y,hh,yel);
      poly(ctx,[[0,y+hh*.02],[W*.56,y+hh*.02],[W*.5,y+hh*.58],[0,y+hh*.58]],p.sec);poly(ctx,[[0,y+hh*.58],[W*.52,y+hh*.58],[W*.64,y+hh*.9],[0,y+hh*.9]],ink);
      t.paint(y+(hh*.56-t.h)/2+hh*.02);bp.paint(y+hh*.58+(hh*.32-bp.h)/2)}};
    const sv=bPill(ctx,e,x,w,{z:z*.045,fill:p.sec,fg:'#FFFFFF',text:d.secA,a:'center',lines:yel,ls:.02,up:false});
    const li=bItems(ctx,e,d.listA.slice(0,5),x,w,{z:z*.026,dz:z*.022,mode:'col',cols:5,R:z*.075,tc:ink,dc:ink,icoBgs:[p.sec,ink],icoFg:'#FFFFFF',sep:rgba(p.pri,.35)});
    const pw=bPill(ctx,e,x,w*.6,{z:z*.034,fill:p.sec,fg:'#FFFFFF',text:d.secB,up:false});
    const lw=w*.62,ck=bItems(ctx,e,d.listB,x+z*.03,lw-z*.06,{z:z*.03,mode:'check',tc:ink,dc:ink,icoBg:yel,icoFg:ink,hl:1,plainT:true,gap:z*.022});
    const sl=d.slogan?bPara(ctx,e,d.slogan,x+w*.66,w*.34,{z:z*.05,c:ink,r:'s',a:'center',lh:1.1,max:4}):bGap(0);
    const wh=ck.h+z*.05,why={h:pw.h+wh,paint(y){pw.paint(y);const yy=y+pw.h;rr(ctx,x,yy,lw,wh,z*.03,tint(p.pri,.93));ck.paint(yy+z*.025);sl.paint(yy+(wh-sl.h)/2)}};
    const bh=z*.17;
    const pl=placeBlock(ctx,e,x+z*.08,w*.55,d,{z:z*.026,c:'#FFFFFF',dc:'#FFFFFF',ic:yel,a:'left'});
    const og=bPara(ctx,e,d.org,W*.64,w*.36,{z:z*.034,c:'#FFFFFF',r:'bb',lh:1.15,max:2});
    const bot={h:bh,paint(y){ctx.fillStyle=ink;ctx.fillRect(0,y,W,bh);ctx.fillStyle=yel;ctx.fillRect(0,y-z*.008,W,z*.008);pl.paint(y+(bh-pl.h)/2);og.paint(y+(bh-og.h)/2)}};
    const L=[head,hero,sv,li,why,bot];L[0].g=0;L[1].g=.7;L[2].g=1;L[3].g=.7;L[4].g=1;L[5].g=.7;return L},m*.4,H,.55,1.3);
};

/* ---- Infographie ---- */
DEMO.infographie=DM({kicker:'L\'amélioration de la performance au service du développement durable.',foot:'',slogan:'Plus qu\'un cabinet, un partenaire de confiance !',
  body:'Qui sommes-nous ?|Un cabinet de conseil en stratégie, organisation et management qui accompagne les porteurs de projets, les associations et les entreprises vers plus de performance et d\'impact durable.',
  secA:'Nos domaines d\'expertise',listA:'Ingénierie de projet|Rédaction de projets ; Budgets et calendriers ; Études de faisabilité\nAccompagnement aux bailleurs|Inscription aux plateformes ; Accréditations ; Appui aux audits\nFacilitation administrative|Agréments ; Gestion externalisée ; Visibilité institutionnelle\nDéveloppement personnel|Art oratoire ; Leadership ; Confiance en soi',
  listB:'Notre vision|Être un partenaire de référence pour le développement durable.\nNotre mission|Conseiller, accompagner et former les organisations pour renforcer leurs capacités.',
  secB:'Nos valeurs',tags:'Professionnalisme, Partage, Engagement, Efficacité, Intégrité'});
CUSTOM.infographie=(ctx,e,d)=>{
  const{W,H,u,m,P:p}=e,x=m*.7,w=W-2*x,ink=shade(p.pri,.12),yel=lum(p.ter)>.4?p.ter:'#FFC93C',soft=tint(p.pri,.93);
  ctx.fillStyle='#FFFFFF';ctx.fillRect(0,0,W,H);
  flowFit(ctx,e,s=>{const z=u*s;
    const hh=z*.27;
    const org=bTitle(ctx,e,x+z*.3,w-z*.3-W*.2,{size:z*.1,lines:2,a:'left',c:ink,hl:p.sec,title:d.org,nosub:true,up:true});
    const head={h:hh,paint(y){swooshPhoto(ctx,e,W*.66,y-m*.5,hh*1.15,yel);const lg=bLogo(ctx,e,x,z*.27,hh,'l');lg.paint(y);org.paint(y+(hh-org.h)/2)}};
    const q=d.kicker?bPara(ctx,e,'« '+d.kicker+' »',x,w*.8,{z:z*.034,c:ink,r:'bb',lh:1.25,max:3}):bGap(0);
    const lw=w*.56,rw=w-lw-z*.03,rx=x+lw+z*.03;
    const bt=bLine(ctx,e,d.body.d?d.body.t:'',x+z*.03,lw-z*.06,{z:z*.05,c:yel,r:'bb',up:true,a:'left'}),bp=bPara(ctx,e,d.body.d||d.body.t,x+z*.03,lw-z*.06,{z:z*.028,c:'#FFFFFF',lh:1.28,max:9});
    const cards=d.listB.slice(0,2).map((it,i)=>{const tt=bLine(ctx,e,it.t,rx+z*.12,rw-z*.14,{z:z*.034,c:ink,r:'bb',up:true,a:'left'}),dd=bPara(ctx,e,it.d,rx+z*.03,rw-z*.06,{z:z*.026,c:ink,lh:1.22,max:4});return{tt,dd,h:Math.max(z*.07,tt.h)+z*.012+dd.h+z*.04,i}});
    const lh=bt.h+bp.h+z*.06,rh=cards.reduce((n,c)=>n+c.h,0)+z*.02*Math.max(0,cards.length-1),wh=Math.max(lh,rh);
    const who={h:wh,paint(y){rr(ctx,x,y,lw,wh,z*.03,ink);bt.paint(y+z*.03);bp.paint(y+z*.03+bt.h);
      let yy=y;cards.forEach(c=>{const ch=c.h*(wh-z*.02*(cards.length-1))/rh;rr(ctx,rx,yy,rw,ch,z*.03,c.i?soft:yel);
        icoDisc(ctx,c.i?'bulb':'target',rx+z*.07,yy+z*.06,z*.04,ink,yel);c.tt.paint(yy+z*.025,0);c.dd.paint(yy+z*.1);yy+=ch+z*.02})}};
    const sec=bPill(ctx,e,x,w*.62,{z:z*.036,fill:ink,fg:'#FFFFFF',text:d.secA,ico:'gear',icoFg:ink,icoBg:yel,up:true});
    const cw=(w-z*.02)/2,cells=d.listA.slice(0,4).map((it,i)=>{const cx0=x+(i%2)*(cw+z*.02),tt=bPara(ctx,e,it.t,cx0+z*.15,cw-z*.18,{z:z*.03,c:i%2?p.sec:ink,r:'bb',up:true,lh:1.12,max:2});const bl=bullets(ctx,e,it.d,cx0+z*.15,cw-z*.18,{z:z*.024,c:ink,dot:i%2?p.sec:ink});return{tt,bl,h:tt.h+z*.015+bl.h+z*.05,i}});
    const rowsH=[0,2].map(k=>Math.max(cells[k]?cells[k].h:0,cells[k+1]?cells[k+1].h:0,z*.15));
    const grid={h:rowsH[0]+(cells.length>2?rowsH[1]+z*.015:0),paint(y){cells.forEach((c,i)=>{const col=i%2,row=i>>1,cx=x+col*(cw+z*.02),cy=y+(row?rowsH[0]+z*.015:0);
      rr(ctx,cx,cy,cw,rowsH[row],z*.03,soft);icoDisc(ctx,iconFor(d.listA[i],i),cx+z*.075,cy+z*.075,z*.05,i%2?yel:ink,i%2?ink:'#FFFFFF');
      c.tt.paint(cy+z*.03);c.bl.paint(cy+z*.03+c.tt.h+z*.015)})}};
    const vl=d.tags.slice(0,5).map(t=>({t,d:''}));
    const vs=d.secB?bPill(ctx,e,x,w*.5,{z:z*.034,fill:ink,fg:'#FFFFFF',text:d.secB,ico:'star',icoFg:ink,icoBg:yel,up:true}):bGap(0);
    const vv=vl.length?bItems(ctx,e,vl,x,w,{z:z*.026,mode:'col',cols:vl.length,R:z*.05,tc:ink,dc:ink,icoBg:ink,icoFg:yel,sep:rgba(p.pri,.3)}):bGap(0);
    const vals={h:vs.h+vv.h+z*.05,paint(y){rr(ctx,x,y,w,vs.h+vv.h+z*.05,z*.03,soft);vs.paint(y+z*.01);vv.paint(y+vs.h+z*.035)}};
    const ph=z*.34,sl=d.slogan?bPara(ctx,e,d.slogan,x+w*.5,w*.5,{z:z*.05,c:'#FFFFFF',r:'s',lh:1.15,max:3}):bGap(0);
    const pic={h:ph,paint(y){ctx.save();ctx.beginPath();ctx.moveTo(x,y+ph*.14);ctx.quadraticCurveTo(x+w*.5,y-ph*.12,x+w,y+ph*.14);ctx.lineTo(x+w,y+ph);ctx.lineTo(x,y+ph);ctx.closePath();ctx.clip();e.photo({x,y,w,h:ph},'rect',0);gradRect(ctx,x,y,w,ph,'h',[[0,rgba(ink,.1)],[1,rgba(ink,.85)]]);ctx.restore();sl.paint(y+ph*.5-sl.h/2+ph*.08)}};
    const ft=foot(ctx,e,x,w,ink);const fb=d.foot?bLine(ctx,e,d.foot,x,w,{z:z*.03,c:ink,a:'center',r:'bb'}):bGap(0);
    const L=[head,q,who,sec,grid,vals,pic,fb,ft];L[0].g=0;L[1].g=.3;L[2].g=.9;L[3].g=.7;L[4].g=.4;L[5].g=.8;L[6].g=.8;L[7].g=.4;L[8].g=.3;return L.filter(b=>b.h>0)},m*.45,H-m*.4,.5,1.35);
};

/* ---- Recrutement ---- */
DEMO.recrutement=DM({kicker:'Nous recrutons pour renforcer notre équipe',slogan:'Envoie ta candidature ou appelle-nous',foot:'00 00 00 00 / 00 00 00 00',secB:'Profil recherché',
  listA:'[cap]Formation assurée|Tu seras formé(e) par nos soins sur les bases du métier.\n[brief]Promesse d\'embauche|À l\'issue de la formation, une embauche pourra être proposée.',
  listB:'Motivé(e) et passionné(e)\nSérieux(se) et discipliné(e)\nEnvie d\'apprendre et d\'évoluer\nDisponibilité et esprit d\'équipe'});
CUSTOM.recrutement=(ctx,e,d)=>{
  const{W,H,u,m,P:p}=e,x=m*.8,w=W-2*x,ink=p.ink,bg=tint(p.pri,.96);
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
  flowFit(ctx,e,s=>{const z=u*s;
    const hh=z*.42,kk=bPara(ctx,e,d.kicker,x,W*.5-x,{z:z*.04,c:ink,r:'bb',lh:1.2,max:3});
    const head={h:hh,paint(y){swooshPhoto(ctx,e,W*.52,y-m*.6,hh*1.12,p.pri,p.sec);const lg=bLogo(ctx,e,x,W*.45-x,hh*.58,'l');lg.paint(y);kk.paint(y+hh*.68)}};
    const t=bTitle(ctx,e,x+z*.04,w*.78-z*.08,{size:z*.095,lines:2,a:'left',c:'#FFFFFF',hl:'#FFFFFF',nosub:true,up:true,avail:z*.3}),tb={h:t.h+z*.07,paint(y){rr(ctx,x,y,w*.78,t.h+z*.07,z*.03,p.pri);t.paint(y+z*.035)}};
    const lw=w*.54,rw=w*.42,rx=x+w-rw;
    const li=bItems(ctx,e,d.listA,x,lw,{z:z*.034,dz:z*.027,mode:'icon',tc:p.pri,dc:ink,icoBg:p.pri,icoFg:'#FFFFFF',gap:z*.04});
    const pt=bLine(ctx,e,d.secB,rx+z*.04,rw-z*.08,{z:z*.034,c:p.pri,r:'bb',up:true,a:'left'}),ck=bItems(ctx,e,d.listB,rx+z*.04,rw-z*.08,{z:z*.026,mode:'check',tc:ink,dc:ink,icoBg:p.pri,icoFg:'#FFFFFF',plainT:true,gap:z*.02,tmax:2});
    const ch=pt.h+z*.04+ck.h+z*.07,row={h:Math.max(li.h,ch),paint(y){li.paint(y);ctx.save();ctx.shadowColor='rgba(0,0,0,.14)';ctx.shadowBlur=z*.03;rr(ctx,rx,y,rw,ch,z*.03,'#FFFFFF');ctx.restore();
      pt.paint(y+z*.035);ctx.fillStyle=p.pri;ctx.fillRect(rx+z*.04,y+z*.035+pt.h+z*.005,z*.1,Math.max(3,z*.005));ck.paint(y+z*.035+pt.h+z*.04)}};
    const bh=z*.2,lab=bLine(ctx,e,d.slogan,x+z*.14,w*.5,{z:z*.022,c:'#FFFFFF',r:'bb',up:true,a:'left',ls:.06}),num=d.foot?bLine(ctx,e,d.foot,x+z*.14,w*.5,{z:z*.05,c:'#FFFFFF',r:'bb',a:'left'}):null;
    const pl=placeBlock(ctx,e,x+w*.66,w*.34,d,{z:z*.026,c:ink,dc:ink,ic:p.pri,a:'left'});
    const bot={h:bh,paint(y){waveBand(ctx,y,bh,W,p.pri,z*.012);const cy=y+bh/2;disc(ctx,x+z*.06,cy,z*.055,'#FFFFFF');mi(ctx,'phone',x+z*.06,cy,z*.034,p.pri);
      const th=lab.h+(num?num.h:0),t0=cy-th/2;lab.paint(t0);if(num)num.paint(t0+lab.h);
      ctx.fillStyle='#FFFFFF';ctx.fillRect(W*.68,y+bh*.12,W*.32,bh*.76);const q=placeBlock(ctx,e,W*.7,W*.29,d,{z:z*.026,c:ink,dc:ink,ic:p.pri,a:'left'});q.paint(cy-q.h/2)}};
    const L=[head,tb,row,bot];L[0].g=0;L[1].g=.8;L[2].g=1;L[3].g=1;return L},m*.5,H,.45,1.3);
};

/* ---- Tech : écran d'ordinateur ---- */
const darkOf=e=>shade(e.P.deep,.5);
const brightOf=(e,bg)=>lift(satOf(e.C.second)>.3?e.C.second:(satOf(e.C.accent)>.3?e.C.accent:e.P.sec),bg,5);
DEMO.tech_sombre=DM({kicker:'Un savoir-faire moderne',cta:'Démarrer',tags:'Voir nos réalisations',slogan:'Construisons quelque chose d\'exceptionnel ensemble',foot:'',
  secA:'Nos services',body:'Des solutions complètes|De la conception au suivi, nous proposons un accompagnement de bout en bout adapté à vos besoins.',
  listA:'Conçu pour tous les écrans|Un rendu parfait partout.\nRapide|Optimisé pour la vitesse.\nSécurisé|Les meilleures pratiques.\nRésultats|Visibilité et croissance.',
  listB:'Conception sur mesure\nBoutique en ligne\nGestion de contenu\nPages de présentation\nMaintenance'});
CUSTOM.tech_sombre=(ctx,e,d)=>{
  const{W,H,u,m,P:p}=e,dk=darkOf(e),ac=brightOf(e,dk),ac2=lift(p.pri,dk,3.2),x=m*.8,w=W-2*x,mu='#A7B0C0';
  ctx.fillStyle=dk;ctx.fillRect(0,0,W,H);glow(ctx,W*.85,H*.12,W*.8,ac2,.35);glow(ctx,W*.1,H*.78,W*.9,ac2,.22);
  const card=(y,h,r)=>{rr(ctx,x,y,w,h,r,'rgba(255,255,255,.05)','rgba(255,255,255,.12)',2)};
  flowFit(ctx,e,s=>{const z=u*s;
    const top={h:z*.07,paint(y){const lg=bLogo(ctx,e,x,z*.3,z*.07,'l');lg.paint(y);const o=bLine(ctx,e,d.org,x+w*.5,w*.5,{z:z*.026,c:'#FFFFFF',a:'right'});o.paint(y+z*.035-o.h/2)}};
    const lw=w*.44,kk=bLine(ctx,e,d.kicker,x,lw,{z:z*.03,c:'#FFFFFF',a:'left'});
    const t=bTitle(ctx,e,x,lw,{size:z*.085,lines:4,a:'left',c:'#FFFFFF',hl:ac,nosub:true,up:true,avail:z*.4});
    const sb=bPara(ctx,e,v.sub,x,lw*.9,{z:z*.026,c:mu,lh:1.4,max:3});
    const bw1=Math.min(lw*.6,z*.3),bh=z*.075,b2=d.tags.length?bLine(ctx,e,d.tags[0],0,lw*.4,{z:z*.022,c:'#FFFFFF',a:'center',r:'bb',up:true}):null;
    const btn={h:bh,paint(y){const g=ctx.createLinearGradient(x,0,x+bw1,0);g.addColorStop(0,ac2);g.addColorStop(1,ac);rr(ctx,x,y,bw1,bh,bh/2,g);const c=bLine(ctx,e,d.cta||'Démarrer',x,bw1-bh*.6,{z:z*.024,c:readableOn(ac2,'#FFFFFF','#10151A'),a:'center',r:'bb',up:true});c.paint(y+(bh-c.h)/2);
      if(b2){const w2=Math.max(z*.15,lw-bw1-z*.03);rr(ctx,x+bw1+z*.025,y,w2,bh,bh/2,null,'rgba(255,255,255,.3)',2);const q=bLine(ctx,e,d.tags[0],x+bw1+z*.045,w2-z*.04,{z:z*.02,c:'#FFFFFF',a:'center',r:'bb',up:true});q.paint(y+(bh-q.h)/2)}}};
    const left=bStack([kk,t,sb,btn],z*.03),lw2=w*.54,lapH=lw2*.62+lw2*.05;
    const hh=Math.max(left.h,lapH*1.02);
    const hero={h:hh,paint(y){left.paint(y+(hh-left.h)/2);const lx=x+w-lw2+z*.02;glow(ctx,lx+lw2/2,y+hh*.6,lw2*.7,ac2,.35);laptop(ctx,e,lx,y+(hh-lapH)/2,lw2*.94,{dark:'#05070C'})}};
    const fts=bItems(ctx,e,d.listA,x+z*.02,w-z*.04,{z:z*.026,dz:z*.021,mode:'col',cols:4,R:z*.04,sq:true,tc:'#FFFFFF',dc:mu,icoBg:'rgba(255,255,255,.07)',icoFg:ac,sep:'rgba(255,255,255,.12)'});
    const fc={h:fts.h+z*.06,paint(y){card(y,fts.h+z*.06,z*.03);fts.paint(y+z*.03)}};
    const lw3=w*.5,sa=bLine(ctx,e,d.secA,x,lw3,{z:z*.022,c:ac,a:'left',up:true,ls:.1}),bt=bTitle(ctx,e,x,lw3,{size:z*.06,lines:3,a:'left',c:'#FFFFFF',hl:ac,title:d.body.d?d.body.t:d.body.t,nosub:true,up:false,avail:z*.3});
    const bp=bPara(ctx,e,d.body.d,x,w*.44,{z:z*.024,c:mu,lh:1.4,max:4}),ck=bItems(ctx,e,d.listB,x,lw3,{z:z*.024,mode:'check',tc:'#FFFFFF',dc:mu,icoBg:'rgba(255,255,255,.08)',icoFg:ac,plainT:true,gap:z*.018});
    const lh3=bStack([sa,bt,bp,ck],z*.018),sh=Math.max(lh3.h,z*.36);
    const sec={h:sh,paint(y){lh3.paint(y);const cx=x+w*.8;
      [[-.1,.2,.27,-.1],[.05,.04,.31,.05]].forEach((q,i)=>{ctx.save();ctx.translate(cx+q[0]*w,y+sh*(.4+q[1]));ctx.rotate(q[3]);ctx.shadowColor='rgba(0,0,0,.5)';ctx.shadowBlur=z*.04;const fw=w*q[2]*1.1,fh=fw*.66;rr(ctx,-fw/2,-fh/2,fw,fh,z*.02,'#0C1018');ctx.save();ctx.beginPath();rrPath(ctx,-fw/2+z*.008,-fh/2+z*.008,fw-z*.016,fh-z*.016,z*.014);ctx.clip();e.photo({x:-fw/2,y:-fh/2,w:fw,h:fh},'rect',0);ctx.restore();ctx.restore()})}};
    const cr=disc,cth=z*.13,cs=bPara(ctx,e,d.slogan,x+z*.18,w*.42,{z:z*.034,c:'#FFFFFF',r:'bb',hl:true,lh:1.15,max:3}),cf=bFoot(ctx,e,x+w*.68,w*.3,{z:z*.026,a:'left',fg:ac,rows:3});
    const cta={h:cth,paint(y){card(y,cth,z*.035);const g=ctx.createLinearGradient(0,y,0,y+cth);g.addColorStop(0,ac);g.addColorStop(1,ac2);disc(ctx,x+z*.085,y+cth/2,z*.05,g);mi(ctx,'rocket',x+z*.085,y+cth/2,z*.028,'#FFFFFF');cs.paint(y+(cth-cs.h)/2);cf.paint(y+(cth-cf.h)/2)}};
    const L=[top,hero,fc,sec,cta];L[0].g=0;L[1].g=.8;L[2].g=.9;L[3].g=1;L[4].g=1;return L},m*.7,H-m*.6,.5,1.3);
};
DEMO.tech_bureau=DM({kicker:'Un cadre professionnel',cta:'Devis gratuit',tags:'500+, 98%, 24/7',slogan:'Moderne · Rapide · Sûr · Évolutif',
  listA:'Conception\nCroissance\nBoutique en ligne\nAssistance 24/7'});
CUSTOM.tech_bureau=(ctx,e,d)=>{
  const{W,H,u,m,P:p}=e,dk=shade(p.deep,.45),ac=brightOf(e,dk),ac2=lift(p.pri,dk,3.2),x=m*.8,w=W-2*x;
  ctx.fillStyle=dk;ctx.fillRect(0,0,W,H);ctx.save();ctx.globalAlpha=.3;e.photo({x:0,y:0,w:W,h:H},'rect',0);ctx.restore();
  gradRect(ctx,0,0,W,H,'v',[[0,rgba(dk,.75)],[.5,rgba(shade(p.pri,.6),.7)],[1,rgba(dk,.92)]]);glow(ctx,W*.5,H*.46,W*.8,ac2,.4);
  flowFit(ctx,e,s=>{const z=u*s;
    const top={h:z*.07,paint(y){const lg=bLogo(ctx,e,x,z*.3,z*.07,'l');lg.paint(y);const bw=z*.24,c=bLine(ctx,e,d.cta,x+w-bw,bw,{z:z*.022,c:'#FFFFFF',a:'center',r:'bb'});const g=ctx.createLinearGradient(x+w-bw,0,x+w,0);g.addColorStop(0,ac2);g.addColorStop(1,ac);rr(ctx,x+w-bw,y+z*.012,bw,z*.046,z*.023,g);c.paint(y+z*.035-c.h/2)}};
    const kk=bLine(ctx,e,d.kicker,x,w,{z:z*.05,c:ac,r:'s',a:'center'}),t=bTitle(ctx,e,x,w,{size:z*.1,lines:3,a:'center',c:'#FFFFFF',hl:ac,nosub:true,up:false}),sb=bPara(ctx,e,v.sub,x+w*.1,w*.8,{z:z*.028,c:'#DCE3EF',a:'center',lh:1.35,max:2});
    const lw=w*.88,lapH=lw*.62+lw*.05,lap={h:lapH,paint(y){glow(ctx,x+w/2,y+lapH*.6,lw*.7,ac2,.4);laptop(ctx,e,x+(w-lw*.94)/2,y,lw*.94,{dark:'#05070C'})}};
    const n=Math.min(4,d.listA.length),gw=(w-z*.02*(n-1))/n,ch=z*.15;
    const cards=d.listA.slice(0,n).map((it,i)=>bLine(ctx,e,it.t,0,gw-z*.02,{z:z*.022,c:'#10151A',a:'center',r:'bb'}));
    const row={h:ch,paint(y){d.listA.slice(0,n).forEach((it,i)=>{const cx=x+i*(gw+z*.02),dark=i===1;ctx.save();ctx.shadowColor='rgba(0,0,0,.35)';ctx.shadowBlur=z*.03;rr(ctx,cx,y,gw,ch,z*.025,dark?shade(p.pri,.35):'rgba(255,255,255,.88)');ctx.restore();
      icoDisc(ctx,iconFor(it,i),cx+gw/2,y+ch*.32,z*.034,dark?'rgba(255,255,255,.1)':'#FFFFFF',dark?'#FFFFFF':p.pri,dark?null:'rgba(0,0,0,.08)');const l=bLine(ctx,e,it.t,cx+z*.01,gw-z*.02,{z:z*.021,c:dark?'#FFFFFF':'#10151A',a:'center',r:'bb'});l.paint(y+ch*.62)})}};
    const st=d.tags.slice(0,3),sh=z*.11,sb2={h:sh,paint(y){rr(ctx,x,y,w,sh,z*.03,'rgba(255,255,255,.08)','rgba(255,255,255,.2)',2);const cw=w*.7/Math.max(1,st.length);
      st.forEach((t,i)=>{const l=bLine(ctx,e,t,x+i*cw,cw,{z:z*.04,c:'#FFFFFF',a:'center',r:'bb'});l.paint(y+sh/2-l.h/2)});
      const bw=w*.25,g=ctx.createLinearGradient(x+w-bw-z*.02,0,x+w-z*.02,0);g.addColorStop(0,ac2);g.addColorStop(1,ac);rr(ctx,x+w-bw-z*.02,y+sh*.18,bw,sh*.64,sh*.32,g);const c=bLine(ctx,e,d.cta,x+w-bw-z*.02,bw,{z:z*.024,c:'#FFFFFF',a:'center',r:'bb'});c.paint(y+sh/2-c.h/2)}};
    const sl=d.slogan?bLine(ctx,e,d.slogan,x,w,{z:z*.026,c:'#FFFFFF',a:'center',ls:.2}):bGap(0);
    const L=[top,kk,t,sb,lap,row,sb2,sl];L[0].g=0;L[1].g=1;L[2].g=.2;L[3].g=.5;L[4].g=.8;L[5].g=.8;L[6].g=.6;L[7].g=.6;return L.filter(b=>b.h>0)},m*.7,H-m*.6,.5,1.3);
};

/* ---- Polaroïd ---- */
DEMO.polaroid=DM({});
CUSTOM.polaroid=(ctx,e,d)=>{
  const{W,H,u,m,P:p,C}=e,bg=p.pri,fg=readableOn(bg,'#FFFFFF','#10151A'),x=m,w=W-2*x;
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);glow(ctx,W*.2,H*.1,W*.8,p.sec,.35);
  const pw=Math.min(W*.66,H*.5),ph=pw*1.12,cx=W*.5,cy=m+ph/2+u*.03;
  ctx.save();ctx.translate(cx,cy);ctx.rotate(-.05);ctx.shadowColor='rgba(0,0,0,.4)';ctx.shadowBlur=u*.04;ctx.shadowOffsetY=u*.015;ctx.fillStyle='#FFFFFF';ctx.fillRect(-pw/2,-ph/2,pw,ph);ctx.shadowColor='transparent';
  const pad=pw*.06;e.photo({x:-pw/2+pad,y:-ph/2+pad,w:pw-2*pad,h:ph-pad*2-pw*.16},'rect',0);
  ctx.fillStyle=rgba(p.sec,.8);ctx.save();ctx.rotate(.07);ctx.fillRect(-pw*.12,-ph/2-pw*.04,pw*.24,pw*.08);ctx.restore();ctx.restore();
  const lg=bLogo(ctx,e,x,w,u*.1,'r');lg.paint(m*.5);
  flowFit(ctx,e,s=>{const z=u*s;
    const t=bTitle(ctx,e,x,w,{size:z*.095,lines:3,a:'center',c:fg,hl:lift(p.ter,bg,2.5),nosub:false,up:false,sK:1}),ft=foot(ctx,e,x,w,fg);
    const L=[t,ft];L[0].g=0;L[1].g=.6;return L.filter(b=>b.h>0)},cy+ph/2+u*.05,H-m*.7,.5,1.1);
};
/* ---- Typographique ---- */
DEMO.typo=DM({});
CUSTOM.typo=(ctx,e,d)=>{
  const{W,H,u,m,P:p}=e,bg=p.pri,fg=readableOn(bg,'#FFFFFF','#10151A'),x=m,w=W-2*x;
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);glow(ctx,W*.9,H*.9,W*.9,p.sec,.4);
  const R=Math.min(W,H)*.2,cx=W-x-R*.9,cy=H-m*2.2-R;
  ctx.save();ctx.shadowColor='rgba(0,0,0,.35)';ctx.shadowBlur=u*.03;disc(ctx,cx,cy,R+u*.012,'#FFFFFF');ctx.restore();
  ctx.save();ctx.beginPath();ctx.arc(cx,cy,R,0,7);ctx.clip();e.photo({x:cx-R,y:cy-R,w:2*R,h:2*R},'rect',0);ctx.restore();
  const lg=bLogo(ctx,e,x,w*.5,u*.1,'l');lg.paint(m*.6);
  flowFit(ctx,e,s=>{const z=u*s;
    const t=bTitle(ctx,e,x,w,{size:z*.2,lines:5,a:'left',c:fg,hl:lift(p.ter,bg,2.5),nosub:false,up:true,sK:.8,avail:H*.4}),ft=foot(ctx,e,x,w*.62,fg,{a:'left'});
    const L=[t,ft];L[0].g=0;L[1].g=1;return L.filter(b=>b.h>0)},m*.6+u*.14,H-m*.7,.5,1.2);
};
/* ---- Coin ---- */
DEMO.coin=DM({});
CUSTOM.coin=(ctx,e,d)=>{
  const{W,H,u,m,P:p}=e,fg=readableOn(p.pri,'#FFFFFF','#10151A'),R=Math.min(W,H)*.78;
  e.photo({x:0,y:0,w:W,h:H},'rect',0);gradRect(ctx,0,H*.7,W,H*.3,'v',[[0,rgba('#000',0)],[1,rgba('#000',.6)]]);
  ctx.fillStyle=p.pri;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(R,0);ctx.arc(0,0,R,0,Math.PI/2);ctx.closePath();ctx.fill();
  ctx.strokeStyle=rgba(p.sec,.9);ctx.lineWidth=u*.012;ctx.beginPath();ctx.arc(0,0,R+u*.02,0,Math.PI/2);ctx.stroke();
  const x=m*.9,lg=bLogo(ctx,e,x,R*.5,u*.1,'l');
  flowFit(ctx,e,s=>{const z=u*s;const t=bTitle(ctx,e,x,R*.62,{size:z*.095,lines:5,a:'left',c:fg,hl:lift(p.ter,p.pri,2.5),nosub:false,up:true,sK:.85,avail:R*.62});return[t]},m*.5+u*.13,R*.62,.5,1.1);
  lg.paint(m*.5);
  const ft=foot(ctx,e,m,W-2*m,'#FFFFFF',{a:'left'});ft.paint(H-m*.8-ft.h);
};
/* ---- Bandes ---- */
DEMO.bandes=DM({});
CUSTOM.bandes=(ctx,e,d)=>{
  const{W,H,u,m,P:p}=e,fg=readableOn(p.pri,'#FFFFFF','#10151A'),x=m,w=W-2*x;
  e.photo({x:0,y:0,w:W,h:H},'rect',0);
  poly(ctx,[[0,H*.56],[W,H*.46],[W,H*.5],[0,H*.6]],p.sec);poly(ctx,[[0,H*.6],[W,H*.5],[W,H],[0,H]],p.pri);
  poly(ctx,[[0,H*.535],[W,H*.435],[W,H*.455],[0,H*.555]],rgba('#FFFFFF',.85));
  const lg=bLogo(ctx,e,x,w*.5,u*.1,'l');lg.paint(m*.6);
  flowFit(ctx,e,s=>{const z=u*s;const t=bTitle(ctx,e,x,w,{size:z*.1,lines:3,a:'left',c:fg,hl:lift(p.ter,p.pri,2.5),nosub:false,up:true,sK:.85}),ft=foot(ctx,e,x,w,fg,{a:'left'});const L=[t,ft];L[0].g=0;L[1].g=1;return L.filter(b=>b.h>0)},H*.63,H-m*.7,.5,1.2);
};
/* ---- Duo ---- */
DEMO.duo=DM({});
CUSTOM.duo=(ctx,e,d)=>{
  const{W,H,u,m,P:p}=e,bg=p.pri,fg=readableOn(bg,'#FFFFFF','#10151A'),x=m,w=W-2*x;
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
  const g=u*.02,pw=(w-g)/2,ph=H*.46,y0=m;
  const fx0=v.fx;
  e.photo({x,y:y0,w:pw,h:ph},'round',u*.02);
  v.fx=Math.min(1,fx0+.45);e.photo({x:x+pw+g,y:y0+u*.05,w:pw,h:ph},'round',u*.02);v.fx=fx0;
  ctx.fillStyle=p.sec;ctx.fillRect(x,y0+ph+u*.02,w*.22,Math.max(4,u*.008));
  flowFit(ctx,e,s=>{const z=u*s;const lg=bLogo(ctx,e,x,w*.4,z*.09,'l'),t=bTitle(ctx,e,x,w,{size:z*.09,lines:3,a:'left',c:fg,hl:lift(p.ter,bg,2.5),nosub:false,up:false}),ft=foot(ctx,e,x,w,fg,{a:'left'});const L=[lg,t,ft];L[0].g=0;L[1].g=.8;L[2].g=1;return L.filter(b=>b.h>0)},y0+ph+u*.07,H-m*.7,.5,1.2);
};
/* ---- Chiffre clé ---- */
DEMO.chiffre=DM({badge:'-30%',kicker:'Offre du moment',cta:'En profiter'});
CUSTOM.chiffre=(ctx,e,d)=>{
  const{W,H,u,m,P:p}=e,bg=p.pri,fg=readableOn(bg,'#FFFFFF','#10151A'),x=m,w=W-2*x,ph=H*.46;
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
  ctx.save();ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(W,0);ctx.lineTo(W,ph*.86);ctx.lineTo(0,ph);ctx.closePath();ctx.clip();e.photo({x:0,y:0,w:W,h:ph},'rect',0);ctx.restore();
  const R=Math.min(W,H)*.2,cx=W*.5,cy=ph*.93;
  ctx.save();ctx.shadowColor='rgba(0,0,0,.4)';ctx.shadowBlur=u*.03;disc(ctx,cx,cy,R,p.sec);ctx.restore();
  const bt=bLine(ctx,e,d.badge,cx-R*.82,R*1.64,{z:R*.8,c:readableOn(p.sec,'#FFFFFF','#10151A'),a:'center',r:'d'});bt.paint(cy-bt.h/2);
  const lg=bLogo(ctx,e,x,w*.4,u*.1,'l');lg.paint(m*.6);
  flowFit(ctx,e,s=>{const z=u*s;
    const t=bTitle(ctx,e,x,w,{size:z*.085,lines:3,a:'center',c:fg,hl:lift(p.ter,bg,2.5),nosub:false,up:false}),cta=d.cta?pillBlock(ctx,e,d.cta,x+w*.25,w*.5,{z:z*.03,fg:readableOn(p.sec,'#FFFFFF','#10151A'),fill:p.sec}):bGap(0),ft=foot(ctx,e,x,w,fg);
    const L=[t,cta,ft];L[0].g=0;L[1].g=.8;L[2].g=.8;return L.filter(b=>b.h>0)},cy+R+u*.04,H-m*.7,.5,1.2);
};
/* ---- Prix ---- */
DEMO.prix=DM({badge:'15 000',kicker:'À partir de',cta:'Commander',listA:'Livraison gratuite\nGarantie 1 an\nPaiement facile'});
CUSTOM.prix=(ctx,e,d)=>{
  const{W,H,u,m,P:p}=e,x=m,w=W-2*x,ph=H*.46,ink=p.ink;
  ctx.fillStyle='#FFFFFF';ctx.fillRect(0,0,W,H);
  e.photo({x:0,y:0,w:W,h:ph},'rect',0);
  const R=Math.min(W,H)*.17,cx=W-x-R*.8,cy=ph;
  ctx.save();ctx.shadowColor='rgba(0,0,0,.3)';ctx.shadowBlur=u*.03;disc(ctx,cx,cy,R,p.sec);ctx.restore();
  const k=bLine(ctx,e,d.kicker,cx-R*.8,R*1.6,{z:R*.2,c:readableOn(p.sec,'#FFFFFF','#10151A'),a:'center',r:'bb',up:true}),pr=bLine(ctx,e,d.badge,cx-R*.85,R*1.7,{z:R*.5,c:readableOn(p.sec,'#FFFFFF','#10151A'),a:'center',r:'d'});
  k.paint(cy-R*.45);pr.paint(cy-pr.h*.4);
  const lg=bLogo(ctx,e,x,w*.4,u*.1,'l');lg.paint(m*.6);
  flowFit(ctx,e,s=>{const z=u*s;
    const t=bTitle(ctx,e,x,w*.64,{size:z*.075,lines:3,a:'left',c:ink,hl:p.sec,nosub:false,up:false}),ck=bItems(ctx,e,d.listA,x,w*.64,{z:z*.03,mode:'check',tc:ink,dc:ink,icoBg:p.pri,icoFg:'#FFFFFF',plainT:true,gap:z*.015}),cta=d.cta?pillBlock(ctx,e,d.cta,x,w*.4,{z:z*.03,fg:readableOn(p.pri,'#FFFFFF','#10151A'),fill:p.pri}):bGap(0),ft=foot(ctx,e,x,w,ink,{a:'left'});
    const L=[t,ck,cta,ft];L[0].g=0;L[1].g=.6;L[2].g=.8;L[3].g=.8;return L.filter(b=>b.h>0)},ph+R+u*.03,H-m*.7,.5,1.2);
};
