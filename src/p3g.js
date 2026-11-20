
/* ================= modèles avec personne détourée et photos multiples ================= */
const PEOPLE0=['Awa Diallo|Directrice marketing','Moussa Keita|Responsable projets','Fanta Traoré|Ingénieure','Ibrahim Sow|Chargé de clientèle'];
function peopleOf(n){const l=String(v.listA||'').split(/\n+/).map(s=>s.trim()).filter(Boolean);return Array.from({length:n},(_,i)=>{const s=(l[i]||PEOPLE0[i%4]).split('|');return{n:(s[0]||'').trim(),r:(s[1]||'').trim()}})}
function iconRow(ctx,e,ic,text,x,w,z,o){const R=z*.95,l=bLine(ctx,e,text,x+R*2.5,w-R*2.5,{z,c:o.c||'#FFFFFF',a:'left',r:'bb'}),h=Math.max(R*2,l.h);
  return{h,paint(y){icoDisc(ctx,ic,x+R,y+h/2,R,o.bg,o.fg);l.paint(y+(h-l.h)/2)}}}
function blobPath(ctx,cx,cy,r,seed){ctx.beginPath();const n=9;for(let i=0;i<=n;i++){const a=i/n*Math.PI*2,k=1+.14*Math.sin(a*3+seed)+.08*Math.cos(a*2+seed*2),px=cx+Math.cos(a)*r*k,py=cy+Math.sin(a)*r*k*.95;i?ctx.lineTo(px,py):ctx.moveTo(px,py)}ctx.closePath()}
const nameBand=(ctx,e,x,y,w,pr,fill,fg,z)=>{const a=bLine(ctx,e,pr.n,x+z*.8,w-z*1.6,{z:z*1.2,c:fg,a:'left',r:'bb',up:true}),b=pr.r?bLine(ctx,e,pr.r,x+z*.8,w-z*1.6,{z:z*.8,c:fg,a:'left',r:'b'}):{h:0,paint(){}},h=a.h+b.h+z*1.2;
  ctx.fillStyle=fill;ctx.fillRect(x,y,w,h);a.paint(y+z*.6);b.paint(y+z*.6+a.h);return h};

/* ---- Webinaire ---- */
DEMO.webinaire=DM({kicker:'Webinaire',person:'Awa Diallo|Directrice marketing',date:'samedi 12 octobre',time:'15h00 – 17h00',place:'En ligne'});
CUSTOM.webinaire=(ctx,e,d)=>{
  const{W,H,u,m,P:p}=e,pk=(satOf(p.ter)>.35&&lum(p.ter)>.15)?p.ter:'#FF5FA2',tl='#35E0C8',tall=H/W>1.25,x=m,cw=W*(tall?.6:.56);
  gradRect(ctx,0,0,W,H,'v',[[0,p.pri],[1,shade(p.pri,.6)]]);
  ctx.save();ctx.globalAlpha=.9;ctx.fillStyle=pk;blobPath(ctx,W*.7,H*(tall?.62:.58),W*.4,1.3);ctx.fill();ctx.restore();
  ctx.save();ctx.globalAlpha=.55;poly(ctx,[[-W*.05,H*.9],[W*.45,H*.74],[W*.5,H*.8],[0,H*.98]],tl);poly(ctx,[[-W*.05,H*.8],[W*.38,H*.66],[W*.41,H*.7],[-W*.05,H*.88]],pk);ctx.restore();
  disc(ctx,W*.93,H*.08,W*.04,null,tl,Math.max(3,W*.004));disc(ctx,W*.55,H*.04,W*.012,tl);
  e.who(0,{x:W*.34,y:H*(tall?.3:.2),w:W*.66,h:H*(tall?.7:.8)},{shadow:true});
  const pr=d.person.n?d.person:{n:'Nom de l\'intervenant',r:''};
  const bw=W*.46,bz=u*.021,bh=(()=>{const c=document.createElement('canvas').getContext('2d');return 0})();
  flowFit(ctx,e,s=>{const z=u*s;
    const lg=bLogo(ctx,e,x,cw,z*.08,'l'),k=bLine(ctx,e,d.kicker||'Webinaire',x,cw,{z:z*.095,c:'#FFFFFF',a:'left',r:'bb',up:true});
    const t=bTitle(ctx,e,x,cw,{size:z*.07,lines:4,a:'left',c:'#FFFFFF',hl:tl,nosub:true,up:false});
    const o={bg:'#FFFFFF',fg:p.pri,c:'#FFFFFF'},z2=z*.03;
    const rows=[d.date&&iconRow(ctx,e,'calendar',d.date,x,cw,z2,o),d.time&&iconRow(ctx,e,'clock',d.time,x,cw,z2,o),(d.place.t)&&iconRow(ctx,e,'globe',d.place.t,x,cw,z2,o)].filter(Boolean);
    const L=[lg,k,t,...rows];L.forEach(b=>b.g=.8);L[1].g=1.2;L[2].g=1.2;return L},m*.9,H*(tall?.86:.9),.6,1.3);
  const nz=u*.026,nw=W*.46,ny=H-m*.9-nz*4.2;
  nameBand(ctx,e,W-nw,ny,nw,pr,pk,'#FFFFFF',nz);
};

/* ---- Affiche urbaine ---- */
DEMO.urbain=DM({badge:'Ce week-end',date:'dimanche 14 septembre',time:'10h00',place:'Place de la République'});
CUSTOM.urbain=(ctx,e,d)=>{
  const{W,H,u,m,P:p}=e,x=m,w=W-2*m,yel='#FFD23F',red=(satOf(p.pri)>.3)?p.pri:'#E63B2E';
  gradRect(ctx,0,0,W,H,'v',[[0,shade(p.pri,.55)],[.55,p.pri],[1,tint(p.pri,.45)]]);
  let s=11;const rnd=()=>{s=(s*16807)%2147483647;return s/2147483647};
  for(let L=0;L<2;L++){let bx=-W*.02;while(bx<W){const bw=W*(.07+rnd()*.09),bh=H*(.14+rnd()*.2)*(L?.7:1);ctx.fillStyle=L?shade(p.pri,.5):shade(p.pri,.7);ctx.fillRect(bx,H*.78-bh,bw,bh+H*.3);
    if(!L){ctx.fillStyle='rgba(255,226,140,.5)';for(let wy=H*.78-bh+bw*.18;wy<H*.76;wy+=bw*.34)for(let wx=bx+bw*.14;wx<bx+bw*.85;wx+=bw*.28)if(rnd()>.55)ctx.fillRect(wx,wy,bw*.12,bw*.16)}bx+=bw+W*.004}}
  const t=bTitle(ctx,e,x,w,{size:u*.2,lines:3,a:'center',c:'#FFFFFF',hl:yel,nosub:true,up:true});
  const ty=H*.05;ctx.save();ctx.translate(0,0);t.paint(ty);ctx.restore();
  const py=H*.38,ph=H*.86-py;
  e.who(0,{x:-W*.04,y:py,w:W*.58,h:ph},{shadow:true,outline:'#FFFFFF',ow:u*.006});
  e.who(1,{x:W*.46,y:py+ph*.06,w:W*.58,h:ph*.94},{shadow:true,outline:'#FFFFFF',ow:u*.006,flip:true});
  /* ruban */
  const rz=u*.034,rl=bLine(ctx,e,d.badge||'Cette semaine',0,W,{z:rz,c:'#10151A',a:'center',r:'bb',up:true,ls:.12}),ry=H*.35;
  ctx.save();ctx.translate(W/2,ry);ctx.rotate(-.06);ctx.fillStyle=yel;ctx.fillRect(-W*.7,-rl.h*.8,W*1.4,rl.h*1.6);ctx.restore();
  ctx.save();ctx.translate(W/2,ry);ctx.rotate(-.06);ctx.translate(-W/2,-rl.h/2);rl.paint(0);ctx.restore();
  /* date et heure */
  const dz=u*.036,by=H*.86,dl=bLine(ctx,e,[d.wd,d.day,d.mon].filter(Boolean).join(' '),x,w*.56,{z:dz,c:'#FFFFFF',a:'center',r:'bb',up:true}),dh=dl.h+dz*.9;
  ctx.fillStyle=red;ctx.fillRect(x,by,w*.58,dh);dl.paint(by+dz*.45);
  if(d.time){const tl=bLine(ctx,e,d.time.toUpperCase(),x+w*.6,w*.4,{z:dz*.95,c:'#10151A',a:'center',r:'bb'});ctx.fillStyle=yel;ctx.fillRect(x+w*.6,by,w*.4,dh);tl.paint(by+dz*.45)}
  if(d.place.t){const pb=placeBlock(ctx,e,x,w,d,{z:u*.026,c:'#FFFFFF',ic:yel,a:'left'});pb.paint(by+dh+u*.012)}
};

/* ---- Soleil ---- */
DEMO.soleil=DM({tags:'Mode, Détente, Musique',date:'samedi 5 avril',time:'14h – 20h',place:'Parc des expositions'});
CUSTOM.soleil=(ctx,e,d)=>{
  const{W,H,u,m,P:p}=e,x=m,w=W-2*m,yel='#FFD23F';
  gradRect(ctx,0,0,W,H,'v',[[0,p.pri],[1,tint(p.pri,.55)]]);
  glow(ctx,W*.5,H*.42,W*.55,'#FFFFFF',.22);disc(ctx,W*.5,H*.42,W*.3,yel);
  waveBand(ctx,H*.78,H*.06,W,rgba('#FFFFFF',.22),H*.012);
  const lg=bLogo(ctx,e,x,w,u*.07,'c');lg.paint(m*.7);
  const t=bTitle(ctx,e,x,w,{size:u*.22,lines:2,a:'center',c:'#FFFFFF',hl:yel,nosub:true,up:true});t.paint(H*.12);
  const by=H*.8;
  e.who(0,{x:W*.12,y:H*.27,w:W*.76,h:by-H*.27+H*.01},{shadow:true});
  ctx.fillStyle=shade(p.pri,.5);ctx.fillRect(0,by,W,H-by);
  const z=u*.032,dl=bLine(ctx,e,[d.wd,d.day,d.mon].filter(Boolean).join(' ')+(d.time?'  ·  '+d.time:''),x,w*.58,{z,c:'#FFFFFF',a:'left',r:'bb',up:true});
  dl.paint(by+u*.02);
  if(d.place.t){const pl=bLine(ctx,e,d.place.t,x+w*.6,w*.4,{z:z*.85,c:yel,a:'right',r:'bb',up:true});pl.paint(by+u*.02)}
  const tg=d.tags.slice(0,3),ty=by+u*.02+dl.h+u*.025,tw=w/Math.max(1,tg.length);
  tg.forEach((s,i)=>{const l=bLine(ctx,e,s,x+i*tw,tw*.9,{z:u*.026,c:'#FFFFFF',a:'center',r:'bb',up:true});l.paint(ty);
    ctx.save();ctx.strokeStyle=yel;ctx.lineWidth=Math.max(3,u*.004);ctx.beginPath();const y0=ty+l.h+u*.01,x0=x+i*tw+tw*.15,ww=tw*.6;ctx.moveTo(x0,y0);for(let k=1;k<=12;k++)ctx.lineTo(x0+ww*k/12,y0+(k%2?-1:1)*u*.005);ctx.stroke();ctx.restore()});
  const ft=foot(ctx,e,x,w,'#FFFFFF',{a:'center'});if(ft.h)ft.paint(H-m*.5-ft.h);
};

/* ---- Modèles multi-photos ---- */
DEMO.trio=DM({tags:'Conception, Réalisation, Livraison'});
CUSTOM.trio=(ctx,e,d)=>{
  const{W,H,u,m,P:p}=e,x=m,w=W-2*m,g=u*.025;
  gradRect(ctx,0,0,W,H,'v',[[0,p.pri],[1,shade(p.pri,.55)]]);
  const lg=bLogo(ctx,e,x,w,u*.07,'l');lg.paint(m*.7);
  const t=bTitle(ctx,e,x,w,{size:u*.095,lines:3,a:'left',c:'#FFFFFF',hl:p.ter,nosub:true,up:true}),ty=m*.7+lg.h+u*.025;t.paint(ty);
  const y0=ty+t.h+u*.03,ft=foot(ctx,e,x,w,'#FFFFFF',{a:'center'}),y1=H-m*.7-(ft.h?ft.h+u*.02:0),cw=(w-2*g)/3;
  for(let i=0;i<3;i++){const dy=i===1?0:(y1-y0)*.1,r={x:x+i*(cw+g),y:y0+dy,w:cw,h:y1-y0-dy-(d.tags[i]?u*.07:0)};
    e.pic(i,r,'rect',cw*.14);
    if(d.tags[i]){const l=bLine(ctx,e,d.tags[i],r.x,cw,{z:u*.028,c:'#FFFFFF',a:'center',r:'bb',up:true});l.paint(r.y+r.h+u*.018)}}
  if(ft.h)ft.paint(H-m*.7-ft.h);
};
DEMO.collage2=DM({});
CUSTOM.collage2=(ctx,e,d)=>{
  const{W,H,u,m,P:p}=e,x=m,w=W-2*m;
  ctx.fillStyle=p.soft;ctx.fillRect(0,0,W,H);disc(ctx,W*.85,H*.12,W*.22,rgba(p.pri,.12));disc(ctx,W*.1,H*.7,W*.16,rgba(p.ter,.18));
  const th=H*.58,fr=u*.018;
  const card=(i,cx,cy,cw2,ch,rot)=>{ctx.save();ctx.translate(cx,cy);ctx.rotate(rot);ctx.shadowColor='rgba(0,0,0,.28)';ctx.shadowBlur=u*.035;ctx.shadowOffsetY=u*.012;ctx.fillStyle='#FFFFFF';ctx.fillRect(-cw2/2,-ch/2,cw2,ch);ctx.shadowColor='transparent';
    e.pic(i,{x:-cw2/2+fr,y:-ch/2+fr,w:cw2-2*fr,h:ch-2*fr},'rect',0);ctx.restore()};
  card(0,W*.36,H*.05+th*.52,W*.5,th*.9,-.07);card(1,W*.66,H*.05+th*.56,W*.42,th*.7,.08);
  const ty=H*.05+th+u*.02,lg=bLogo(ctx,e,x,w,u*.06,'l'),t=bTitle(ctx,e,x,w,{size:u*.085,lines:3,a:'left',c:p.deep,hl:p.pri,nosub:true,up:false});
  const sb=bPara(ctx,e,v.sub,x,w,{z:u*.03,c:p.ink,r:'b',lh:1.25,max:2}),ft=foot(ctx,e,x,w,p.ink,{a:'left'});
  const rest=H-m*.7-ty-(ft.h?ft.h+u*.01:0);let y=ty;if(t.h+sb.h+u*.02<rest){t.paint(y);y+=t.h+u*.015;sb.paint(y)}else t.paint(y);
  if(ft.h)ft.paint(H-m*.7-ft.h);
};
DEMO.avant_apres=DM({tags:'Avant, Après'});
CUSTOM.avant_apres=(ctx,e,d)=>{
  const{W,H,u,m,P:p}=e,x=m,w=W-2*m;
  ctx.fillStyle=p.deep;ctx.fillRect(0,0,W,H);
  const bh=H*.2,ph=H-bh;
  e.pic(0,{x:0,y:0,w:W/2,h:ph},'rect',0);e.pic(1,{x:W/2,y:0,w:W/2,h:ph},'rect',0);
  gradRect(ctx,0,ph*.6,W,ph*.4,'v',[[0,'rgba(0,0,0,0)'],[1,'rgba(0,0,0,.5)']]);
  const lab=(txt,px,col,fg)=>{const l=bLine(ctx,e,txt,0,W*.3,{z:u*.034,c:fg,a:'center',r:'bb',up:true,ls:.1}),pw=l.tw+u*.06,h=l.h+u*.03;rr(ctx,px-pw/2,ph-h-u*.04,pw,h,h/2,col);l.paint(ph-h-u*.04+u*.015,px-W*.15)};
  lab(d.tags[0]||'Avant',W*.25,'#FFFFFF',p.ink);lab(d.tags[1]||'Après',W*.75,p.pri,'#FFFFFF');
  ctx.fillStyle='#FFFFFF';ctx.fillRect(W/2-u*.003,0,u*.006,ph);disc(ctx,W/2,ph/2,u*.055,p.pri,'#FFFFFF',u*.008);mi(ctx,'arrow',W/2,ph/2,u*.028,'#FFFFFF');
  const t=bTitle(ctx,e,x,w,{size:u*.07,lines:2,a:'center',c:'#FFFFFF',hl:p.ter,nosub:true,up:true});t.paint(ph+(bh-t.h)/2);
};
DEMO.grille4=DM({});
CUSTOM.grille4=(ctx,e,d)=>{
  const{W,H,u,m,P:p}=e,g=u*.012,hh=(H-g)/2,wh=(W-g)/2;
  ctx.fillStyle='#FFFFFF';ctx.fillRect(0,0,W,H);
  [[0,0],[1,0],[0,1],[1,1]].forEach(([cx,cy],i)=>e.pic(i,{x:cx*(wh+g),y:cy*(hh+g),w:wh,h:hh},'rect',0));
  const bw=W*.74,bz=u*.07,t=bTitle(ctx,e,0,bw-u*.08,{size:bz,lines:3,a:'center',c:'#FFFFFF',hl:p.ter,nosub:true,up:true}),bh=t.h+u*.07;
  ctx.save();ctx.shadowColor='rgba(0,0,0,.35)';ctx.shadowBlur=u*.04;rr(ctx,(W-bw)/2,(H-bh)/2,bw,bh,u*.02,p.pri);ctx.restore();
  ctx.save();ctx.translate((W-bw)/2+u*.04,(H-bh)/2+u*.035);t.paint(0);ctx.restore();
};
DEMO.equipe=DM({kicker:'Notre équipe'});
CUSTOM.equipe=(ctx,e,d)=>{
  const{W,H,u,m,P:p}=e,x=m,w=W-2*m,n=3,pe=peopleOf(n);
  ctx.fillStyle=p.soft;ctx.fillRect(0,0,W,H);ctx.fillStyle=p.pri;ctx.fillRect(0,0,W,H*.3);
  const lg=bLogo(ctx,e,x,w,u*.07,'c');lg.paint(m*.6);
  const k=bLine(ctx,e,d.kicker||'Notre équipe',x,w,{z:u*.034,c:'#FFFFFF',a:'center',r:'bb',up:true,ls:.14});k.paint(m*.6+lg.h+u*.015);
  const t=bTitle(ctx,e,x,w,{size:u*.07,lines:2,a:'center',c:'#FFFFFF',hl:p.ter,nosub:true,up:true});t.paint(m*.6+lg.h+k.h+u*.03);
  const cw=w/n,R=Math.min(cw*.44,(H*.5)/2),cy=H*.3+R*.35+u*.04;
  for(let i=0;i<n;i++){const cx=x+cw*(i+.5);ctx.save();ctx.beginPath();ctx.arc(cx,cy+R,R+u*.008,0,7);ctx.fillStyle='#FFFFFF';ctx.fill();ctx.restore();
    e.pic(i,{x:cx-R,y:cy,w:2*R,h:2*R},'circle');
    const a=bLine(ctx,e,pe[i].n,cx-cw*.48,cw*.96,{z:u*.03,c:p.deep,a:'center',r:'bb'}),b=bLine(ctx,e,pe[i].r,cx-cw*.48,cw*.96,{z:u*.022,c:p.ink,a:'center',r:'b'});
    a.paint(cy+2*R+u*.025);b.paint(cy+2*R+u*.025+a.h)}
  const ft=foot(ctx,e,x,w,p.ink,{a:'center'});if(ft.h)ft.paint(H-m*.6-ft.h);
};
function cutRow(ctx,e,d,n,o){
  const{W,H,u,m,P:p}=e,x=m,w=W-2*m,pe=peopleOf(n);
  gradRect(ctx,0,0,W,H,'v',[[0,p.pri],[1,shade(p.pri,.6)]]);
  glow(ctx,W*.5,H*.62,W*.6,p.ter,.35);
  const lg=bLogo(ctx,e,x,w,u*.065,'l');lg.paint(m*.7);
  const t=bTitle(ctx,e,x,w,{size:u*o.ts,lines:3,a:'left',c:'#FFFFFF',hl:p.ter,nosub:true,up:true}),ty=m*.7+lg.h+u*.02;t.paint(ty);
  const y0=ty+t.h+u*.03,y1=H-m*.5,ph=y1-y0,cw=W/n;
  const order=n===3?[0,2,1]:[0,1];
  order.forEach(i=>{const big=n===3&&i===1,bw=cw*(n===2?1.4:big?1.55:1.25),cx=cw*(i+.5),hh=ph*(big?1:.9);
    e.who(i,{x:cx-bw/2,y:y1-hh-u*.07,w:bw,h:hh},{shadow:true},'circle')});
  pe.forEach((q,i)=>{if(!q.n)return;const cx=cw*(i+.5),a=bLine(ctx,e,q.n,cx-cw*.46,cw*.92,{z:u*.03,c:'#FFFFFF',a:'center',r:'bb',up:true}),b=q.r?bLine(ctx,e,q.r,cx-cw*.46,cw*.92,{z:u*.021,c:'#FFFFFF',a:'center',r:'b'}):{h:0,paint(){}};
    const bh=a.h+b.h+u*.02,by=y1-bh;ctx.fillStyle='#FFFFFF';ctx.globalAlpha=.96;ctx.fillRect(cx-cw*.46,by,cw*.92,bh);ctx.globalAlpha=1;
    ctx.fillStyle=rgba('#000000',.0);const l=bLine(ctx,e,q.n,cx-cw*.46,cw*.92,{z:u*.03,c:p.ink,a:'center',r:'bb',up:true});l.paint(by+u*.01);if(q.r)bLine(ctx,e,q.r,cx-cw*.46,cw*.92,{z:u*.021,c:p.ink,a:'center',r:'b'}).paint(by+u*.01+l.h)});
}
DEMO.duo_cut=DM({});CUSTOM.duo_cut=(ctx,e,d)=>cutRow(ctx,e,d,2,{ts:.09});
DEMO.trio_cut=DM({});CUSTOM.trio_cut=(ctx,e,d)=>cutRow(ctx,e,d,3,{ts:.085});

/* ---- Composition libre : point de départ pour tout gérer dans l'onglet Éléments ---- */
DEMO.libre=DM({kicker:'Nouveau',cta:'En savoir plus',person:'',date:'samedi 14 novembre',time:'09h30',place:'Votre ville'});
CUSTOM.libre=(ctx,e,d)=>{
  const{W,H,u,m,P:p}=e,x=m,w=W-2*m,wide=W/H>1.5;
  e.photo({x:0,y:0,w:W,h:H},'rect',0);
  gradRect(ctx,0,H*.3,W,H*.7,'v',[[0,'rgba(0,0,0,0)'],[1,'rgba(0,0,0,.8)']]);
  if(v.cut)e.cut(0,{x:W*.12,y:H*.12,w:W*.76,h:H*.88},{shadow:true});
  const lg=bLogo(ctx,e,x,w,Math.min(u*.1,H*.2),'l');lg.paint(m*.7);
  const bw=wide?w*.6:w;
  flowFit(ctx,e,s=>{const z=Math.min(u,H*1.2)*s;const L=[];
    if(d.kicker)L.push(pillBlock(ctx,e,d.kicker,x,Math.min(bw,d.kicker.length*z*.03*.95+z*.09),{z:z*.03,fg:readableOn(p.ter),fill:p.ter}));
    L.push(bTitle(ctx,e,x,bw,{size:z*.115,lines:3,a:'left',c:'#FFFFFF',hl:'#FFD23F',nosub:false,up:false}));
    const meta=[d.date&&[d.date,d.time].filter(Boolean).join('  ·  '),d.place.t].filter(Boolean).join('   |   ');
    if(meta)L.push(tagBlk(ctx,'date',bLine(ctx,e,meta,x,bw,{z:z*.036,c:'#FFFFFF',a:'left',r:'bb'}),x,bw,'left'));
    if(d.cta)L.push(pillBlock(ctx,e,d.cta,x,Math.min(bw,d.cta.length*z*.03*.95+z*.09),{z:z*.03,fg:readableOn(p.pri),fill:p.pri}));
    const ft=foot(ctx,e,x,bw,'#FFFFFF',{a:'left'});if(ft.h)L.push(ft);
    L.forEach(b=>b.g=.8);return L},H*.4,H-m*.8,.55,1.9);
};
