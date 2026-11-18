
/* ================= bibliothèque pour les modèles « construits » ================= */
const rgbHex=(r,g,b)=>'#'+[r,g,b].map(x=>Math.round(clamp(x,0,255)).toString(16).padStart(2,'0')).join('');
const shade=(h,k)=>{const[r,g,b]=hexToRgb(h),f=1-k;return rgbHex(r*f,g*f,b*f)};
const tint=(h,k)=>{const[r,g,b]=hexToRgb(h);return rgbHex(r+(255-r)*k,g+(255-g)*k,b+(255-b)*k)};
const mixc=(a,b,t)=>{const x=hexToRgb(a),y=hexToRgb(b);return rgbHex(x[0]+(y[0]-x[0])*t,x[1]+(y[1]-x[1])*t,x[2]+(y[2]-x[2])*t)};
const satOf=h=>{const[r,g,b]=hexToRgb(h),mx=Math.max(r,g,b),mn=Math.min(r,g,b);return mx?(mx-mn)/mx:0};
const hdist=(a,b)=>{const x=hexToRgb(a),y=hexToRgb(b);return Math.hypot(x[0]-y[0],x[1]-y[1],x[2]-y[2])};
function lift(c,bg,min){let k=0,o=c;while(contrast(o,bg)<min&&k<1){k+=.1;o=tint(c,k)}return o}
function pal(C){
  const W='#FFFFFF',cand=[C.accent,C.second,C.bg,C.text].filter(Boolean);
  let pri=cand.filter(c=>contrast(c,W)>=4.5&&satOf(c)>.22).sort((a,b)=>satOf(b)-satOf(a))[0];
  if(!pri)pri=contrast(C.accent,W)>=4.5?C.accent:shade(C.accent,lum(C.accent)>.5?.62:.4);
  let sec=cand.filter(c=>hdist(c,pri)>80&&satOf(c)>.3&&contrast(c,W)>=1.8).sort((a,b)=>satOf(b)-satOf(a))[0];
  if(!sec)sec=tint(pri,.4);
  const ter=cand.find(c=>hdist(c,pri)>70&&hdist(c,sec)>70&&satOf(c)>.25)||mixc(sec,'#FFD23F',.55);
  const deep=shade(pri,lum(pri)>.1?.62:.25);
  return{pri,sec,ter,deep,soft:tint(pri,.94),mid:tint(pri,.82),ink:'#10151A',white:W};
}
/* ---------- texte ---------- */
const SCRIPT='AM_nothing';
const FT=(e,r,s)=>r==='d'?`${Math.round(s)}px "${e.pair.d}", system-ui, sans-serif`:r==='s'?`${Math.round(s)}px "${SCRIPT}", cursive`:r==='bb'?`700 ${Math.round(s)}px "${e.pair.b}", system-ui, sans-serif`:`${Math.round(s)}px "${e.pair.b}", system-ui, sans-serif`;
const setLS=(ctx,k,z)=>{if(LSOK)ctx.letterSpacing=((k||0)*z).toFixed(2)+'px'};
const noLS=ctx=>{if(LSOK)ctx.letterSpacing='0px'};
function bPara(ctx,e,str,x,w,o){
  const z=o.z,lh=o.lh||1.28,r=o.r||'b';
  ctx.save();ctx.font=FT(e,r,z);setLS(ctx,o.ls,z);
  const ws=parseHL(String(str||''),!!o.hl).map(t=>({...t,t:o.up?t.t.toUpperCase():t.t}));
  let lines=ws.length?wrapWords(ctx,ws,w):[];if(o.max&&lines.length>o.max)lines=lines.slice(0,o.max);
  ctx.restore();
  const h=lines.length*z*lh,ax=o.a==='center'?x+w/2:o.a==='right'?x+w:x;
  return{h,lines:lines.length,paint(y){ctx.save();ctx.font=FT(e,r,z);setLS(ctx,o.ls,z);ctx.textBaseline='top';ctx.fillStyle=o.c;
    lines.forEach((l,i)=>paintLine(ctx,l,ax,y+i*z*lh+(z*lh-z)*.45,z,o.a||'left',o.c,o.hl||o.c,'none',{}));ctx.restore()}};
}
function bLine(ctx,e,str,x,w,o){
  let z=o.z;str=String(str||'');if(o.up)str=str.toUpperCase();const r=o.r||'b';
  ctx.save();const set=s=>{ctx.font=FT(e,r,s);setLS(ctx,o.ls,s)};set(z);
  while(ctx.measureText(str).width>w&&z>8){z-=2;set(z)}
  const tw=ctx.measureText(str).width;ctx.restore();
  const ax=o.a==='center'?x+w/2:o.a==='right'?x+w:x,h=z*(o.lh||1.2);
  return{h,tw,z,paint(y,dx){ctx.save();set(z);ctx.fillStyle=o.c;ctx.textAlign=o.a==='center'?'center':o.a==='right'?'right':'left';ctx.textBaseline='middle';ctx.fillText(str,ax+(dx||0),y+h/2+z*.04);ctx.restore()}};
}
function bTitle(ctx,e,x,w,o){
  const upper=v.upper==='upper'||(v.upper==='auto'&&!!o.up);
  const tb=fitBlock(ctx,{x,maxW:w,size:o.size*v.tSize,maxLines:o.lines||3,align:o.a||'left',base:e.base,wide:false,pair:e.pair,C:{...e.C,text:o.c},title:o.title!=null?o.title:v.title,sub:o.nosub?'':v.sub,lhK:v.lh,sK:(o.sK||1)*v.sSize,upper,bar:false,effect:v.tEffect,ls:v.ls,hl:v.hl,hlColor:o.hl,kicker:'',pillFill:o.hl,pillText:'#000',tags:[],cta:''},o.avail||1e9);
  return{h:tb.height,paint:y=>tb.paint(y)};
}
/* ---------- formes ---------- */
function rr(ctx,x,y,w,h,r,fill,stroke,lw){ctx.beginPath();rrPath(ctx,x,y,w,h,r);if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||2;ctx.stroke()}}
function disc(ctx,x,y,r,fill,stroke,lw){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||2;ctx.stroke()}}
function glow(ctx,x,y,r,col,a){const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,rgba(col,a));g.addColorStop(1,rgba(col,0));ctx.fillStyle=g;ctx.fillRect(x-r,y-r,2*r,2*r)}
function poly(ctx,pts,fill){ctx.beginPath();pts.forEach((p,i)=>ctx[i?'lineTo':'moveTo'](p[0],p[1]));ctx.closePath();ctx.fillStyle=fill;ctx.fill()}
function gradRect(ctx,x,y,w,h,dir,stops){const g=dir==='h'?ctx.createLinearGradient(x,y,x+w,y):ctx.createLinearGradient(x,y,x,y+h);stops.forEach(s=>g.addColorStop(s[0],s[1]));ctx.fillStyle=g;ctx.fillRect(x,y,w,h)}
/* ---------- icônes ---------- */
const ICON_KEYS=[[/épargn|argent|crédit|credit|prix|tarif|paie|banque|finan/i,'coin'],[/équipe|equipe|accompagn|membre|commun|partag|client|famille|leader/i,'users'],[/formation|appren|cours|école|ecole|dipl|oratoire/i,'cap'],[/site|web|digital|internet|appli|logiciel|code|respons/i,'globe'],[/sécur|secur|garant|confiance|intégr|assur|protec|fiable/i,'shield'],[/rapide|vitesse|express|livraison|urgen|fast/i,'bolt'],[/objectif|mission|cible|vision|engage/i,'target'],[/idée|idee|conseil|innov|créa|crea/i,'bulb'],[/croiss|dévelop|devel|perform|résult|stat|seo|efficac/i,'chart'],[/qualit|expert|techn|maintenance|support|ingénier/i,'gear'],[/emploi|poste|carri|recrut|travail|embauche|stage/i,'brief'],[/contact|appel|téléph/i,'phone'],[/lieu|adresse|siège|siege/i,'pin'],[/date|calend/i,'calendar'],[/heure|horaire|disponib/i,'clock'],[/amour|cœur|coeur|santé|bien-être|soin/i,'heart'],[/document|dossier|rédaction|étude|etude|projet|budget/i,'doc'],[/partenar|institut|ministère|gouvern|administr/i,'build']];
const ICON_CYC=['star','users','chart','shield','target','gear','bulb','brief'];
function iconFor(it,i){if(it.ic)return it.ic;for(const[r,n]of ICON_KEYS)if(r.test(it.t))return n;return ICON_CYC[i%ICON_CYC.length]}
function mi(ctx,n,cx,cy,h,col,lw){
  ctx.save();ctx.translate(cx,cy);ctx.strokeStyle=col;ctx.fillStyle=col;ctx.lineWidth=lw||Math.max(1.6,h*.17);ctx.lineCap='round';ctx.lineJoin='round';
  const P=(pts,close)=>{ctx.beginPath();pts.forEach((p,i)=>ctx[i?'lineTo':'moveTo'](p[0]*h,p[1]*h));if(close)ctx.closePath()};
  switch(n){
    case'check':P([[-.55,.02],[-.15,.42],[.58,-.4]]);ctx.stroke();break;
    case'users':ctx.beginPath();ctx.arc(0,-.38*h,.3*h,0,7);ctx.fill();ctx.beginPath();ctx.arc(0,.95*h,.72*h,Math.PI*1.18,Math.PI*1.82);ctx.lineWidth*=1.6;ctx.stroke();ctx.lineWidth/=1.6;[-.7,.7].forEach(s=>{ctx.beginPath();ctx.arc(s*h,-.12*h,.2*h,0,7);ctx.fill()});break;
    case'chart':[[-.75,.1],[-.2,-.3],[.35,-.7]].forEach(b=>{ctx.fillRect(b[0]*h,b[1]*h,.4*h,(.85-b[1])*h)});break;
    case'shield':ctx.beginPath();ctx.moveTo(0,-.95*h);ctx.lineTo(.7*h,-.6*h);ctx.lineTo(.7*h,.1*h);ctx.quadraticCurveTo(.7*h,.7*h,0,.98*h);ctx.quadraticCurveTo(-.7*h,.7*h,-.7*h,.1*h);ctx.lineTo(-.7*h,-.6*h);ctx.closePath();ctx.stroke();P([[-.28,.05],[-.05,.3],[.32,-.2]]);ctx.stroke();break;
    case'target':[.92,.58].forEach(r=>{ctx.beginPath();ctx.arc(0,0,r*h,0,7);ctx.stroke()});ctx.beginPath();ctx.arc(0,0,.2*h,0,7);ctx.fill();P([[0,0],[.75,-.75]]);ctx.stroke();break;
    case'gear':ctx.beginPath();ctx.arc(0,0,.34*h,0,7);ctx.stroke();for(let i=0;i<8;i++){const a=i*Math.PI/4;ctx.beginPath();ctx.moveTo(Math.cos(a)*.6*h,Math.sin(a)*.6*h);ctx.lineTo(Math.cos(a)*.92*h,Math.sin(a)*.92*h);ctx.lineWidth*=1.5;ctx.stroke();ctx.lineWidth/=1.5}ctx.beginPath();ctx.arc(0,0,.62*h,0,7);ctx.stroke();break;
    case'bulb':ctx.beginPath();ctx.arc(0,-.2*h,.55*h,Math.PI*.75,Math.PI*2.25);ctx.lineTo(.28*h,.56*h);ctx.lineTo(-.28*h,.56*h);ctx.closePath();ctx.stroke();P([[-.22,.82],[.22,.82]]);ctx.stroke();break;
    case'star':ctx.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?.42:.95;ctx[i?'lineTo':'moveTo'](Math.cos(a)*r*h,Math.sin(a)*r*h)}ctx.closePath();ctx.fill();break;
    case'heart':ctx.beginPath();ctx.moveTo(0,.8*h);ctx.bezierCurveTo(-1.2*h,-.1*h,-.55*h,-.95*h,0,-.35*h);ctx.bezierCurveTo(.55*h,-.95*h,1.2*h,-.1*h,0,.8*h);ctx.fill();break;
    case'pin':ctx.beginPath();ctx.arc(0,-.2*h,.62*h,Math.PI*.78,Math.PI*2.22);ctx.lineTo(0,.98*h);ctx.closePath();ctx.moveTo(.22*h,-.2*h);ctx.arc(0,-.2*h,.22*h,0,7);ctx.fill('evenodd');break;
    case'calendar':ctx.beginPath();rrPath(ctx,-.85*h,-.7*h,1.7*h,1.6*h,.18*h);ctx.stroke();P([[-.85,-.25],[.85,-.25]]);ctx.stroke();P([[-.4,-.95],[-.4,-.5]]);ctx.stroke();P([[.4,-.95],[.4,-.5]]);ctx.stroke();for(let r=0;r<2;r++)for(let c=0;c<3;c++)ctx.fillRect((-.55+c*.45)*h,(.0+r*.4)*h,.22*h,.2*h);break;
    case'clock':ctx.beginPath();ctx.arc(0,0,.9*h,0,7);ctx.stroke();P([[0,-.5],[0,0],[.4,.28]]);ctx.stroke();break;
    case'cap':poly(ctx,[[0,-.7*h],[1*h,-.2*h],[0,.3*h],[-1*h,-.2*h]],col);ctx.beginPath();ctx.moveTo(-.55*h,.1*h);ctx.lineTo(-.55*h,.55*h);ctx.quadraticCurveTo(0,.9*h,.55*h,.55*h);ctx.lineTo(.55*h,.1*h);ctx.stroke();break;
    case'brief':ctx.beginPath();rrPath(ctx,-.9*h,-.45*h,1.8*h,1.25*h,.16*h);ctx.stroke();ctx.beginPath();ctx.moveTo(-.35*h,-.45*h);ctx.lineTo(-.35*h,-.8*h);ctx.lineTo(.35*h,-.8*h);ctx.lineTo(.35*h,-.45*h);ctx.stroke();P([[-.9,.1],[.9,.1]]);ctx.stroke();break;
    case'bolt':poly(ctx,[[.2*h,-1*h],[-.7*h,.15*h],[-.05*h,.15*h],[-.2*h,1*h],[.7*h,-.2*h],[.05*h,-.2*h]],col);break;
    case'globe':ctx.beginPath();ctx.arc(0,0,.9*h,0,7);ctx.stroke();ctx.beginPath();ctx.ellipse(0,0,.38*h,.9*h,0,0,7);ctx.stroke();P([[-.9,0],[.9,0]]);ctx.stroke();break;
    case'doc':ctx.beginPath();rrPath(ctx,-.62*h,-.9*h,1.24*h,1.8*h,.14*h);ctx.stroke();P([[-.3,-.35],[.3,-.35]]);ctx.stroke();P([[-.3,0],[.3,0]]);ctx.stroke();P([[-.3,.35],[.08,.35]]);ctx.stroke();break;
    case'build':poly(ctx,[[0,-.95*h],[.95*h,-.45*h],[-.95*h,-.45*h]],col);[-.6,-.2,.2,.6].forEach(x=>ctx.fillRect((x-.08)*h,-.3*h,.16*h,.85*h));ctx.fillRect(-.95*h,.65*h,1.9*h,.2*h);break;
    case'coin':ctx.beginPath();ctx.arc(0,0,.9*h,0,7);ctx.stroke();ctx.font=`700 ${h*1.25}px Arial, sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('$',0,h*.06);break;
    case'phone':ctx.beginPath();rrPath(ctx,-.5*h,-.95*h,h,1.9*h,.22*h);ctx.stroke();ctx.beginPath();ctx.arc(0,.62*h,.08*h,0,7);ctx.fill();break;
    case'laptop':ctx.beginPath();rrPath(ctx,-.75*h,-.6*h,1.5*h,1.0*h,.1*h);ctx.stroke();P([[-.95,.62],[.95,.62]]);ctx.stroke();break;
    case'eye':ctx.beginPath();ctx.moveTo(-.95*h,0);ctx.quadraticCurveTo(0,-.95*h,.95*h,0);ctx.quadraticCurveTo(0,.95*h,-.95*h,0);ctx.stroke();ctx.beginPath();ctx.arc(0,0,.3*h,0,7);ctx.fill();break;
    case'rocket':ctx.beginPath();ctx.moveTo(0,-.95*h);ctx.quadraticCurveTo(.6*h,-.4*h,.4*h,.5*h);ctx.lineTo(-.4*h,.5*h);ctx.quadraticCurveTo(-.6*h,-.4*h,0,-.95*h);ctx.closePath();ctx.fill();ctx.fillRect(-.12*h,.6*h,.24*h,.3*h);break;
    case'arrow':P([[-.8,0],[.7,0]]);ctx.stroke();P([[.2,-.55],[.75,0],[.2,.55]]);ctx.stroke();break;
    default:ctx.beginPath();ctx.arc(0,0,.5*h,0,7);ctx.fill();
  }
  ctx.restore();
}
/* pastille d'icône */
function icoDisc(ctx,n,cx,cy,R,bg,fg,ring){if(bg)disc(ctx,cx,cy,R,bg);if(ring)disc(ctx,cx,cy,R*.92,null,ring,Math.max(2,R*.09));mi(ctx,n,cx,cy,R*.5,fg)}
/* ---------- contenus ---------- */
function parseList(str,max){
  return String(str||'').split(/\n+/).map(s=>s.trim()).filter(Boolean).slice(0,max||8).map(s=>{let ic=null;const m=s.match(/^\[(\w+)\]\s*/);if(m){ic=m[1];s=s.slice(m[0].length)}const i=s.indexOf('|');return{t:(i<0?s:s.slice(0,i)).trim(),d:i<0?'':s.slice(i+1).trim(),ic}});
}
const prSplit=s=>{s=String(s||'');const i=s.indexOf('|');return i<0?{t:s.trim(),d:''}:{t:s.slice(0,i).trim(),d:s.slice(i+1).trim()}};
function cdata(e,demo){
  demo=demo||{};
  const g=(k,df)=>{const s=String(v[k]||'').trim();if(s==='-')return'';return s||df||''};
  const dt=g('date',demo.date),mt=dt.match(/^(lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)\s+(.+)$/i),rest=mt?mt[2]:dt,dm=rest.match(/^(\d{1,2}(?:er)?)\s+(.+)$/);
  return{kicker:g('kicker',demo.kicker),cta:g('cta',demo.cta),badge:g('badge',demo.badge),slogan:g('slogan',demo.slogan),org:g('org',current?current.name:'')||demo.org||'',
    tags:g('tags',demo.tags).split(/[,;\n]+/).map(s=>s.trim()).filter(Boolean).slice(0,8),
    date:dt,wd:mt?mt[1]:'',day:dm?dm[1]:rest,mon:dm?dm[2]:'',time:g('time',demo.time),place:prSplit(g('place',demo.place)),
    foot:g('foot',demo.foot),secA:g('secA',demo.secA),secB:g('secB',demo.secB),listA:parseList(g('listA',demo.listA),8),listB:parseList(g('listB',demo.listB),8),body:prSplit(g('body',demo.body))};
}
/* ---------- blocs ---------- */
const bGap=h=>({h,paint(){}});
function bStack(list,gap){const h=list.reduce((n,b)=>n+b.h,0)+gap*Math.max(0,list.length-1);return{h,paint(y){let yy=y;list.forEach(b=>{b.paint(yy);yy+=b.h+gap})}}}
function bCard(ctx,x,w,pad,rad,fill,stroke,build,lw){const inn=build(x+pad,w-2*pad);return{h:inn.h+2*pad,paint(y){rr(ctx,x,y,w,inn.h+2*pad,rad,fill,stroke,lw);inn.paint(y+pad)},inner:inn}}
function bCols(list,xs){return{h:Math.max(0,...list.map(b=>b.h)),paint(y){list.forEach(b=>b.paint(y))}}}
function bPill(ctx,e,x,w,o){ /* pastille de titre de section */
  const z=o.z,h=z*2.3,ic=o.ico?h*1.12:0;
  ctx.save();ctx.font=FT(e,'bb',z);setLS(ctx,o.ls==null?.04:o.ls,z);let tw=ctx.measureText(o.up===false?o.text:o.text.toUpperCase()).width;ctx.restore();
  const pw=o.full?w:Math.min(w,tw+z*2.4+ic),px=o.a==='center'?x+(w-pw)/2:o.a==='right'?x+w-pw:x;
  return{h:Math.max(h,ic),pw,px,paint(y){
    ctx.save();const hh=Math.max(h,ic);
    if(o.lines){const ly=y+hh/2;ctx.strokeStyle=o.lines;ctx.lineWidth=Math.max(2,z*.12);ctx.beginPath();ctx.moveTo(x,ly);ctx.lineTo(px-z*.9,ly);ctx.moveTo(px+pw+z*.9,ly);ctx.lineTo(x+w,ly);ctx.stroke()}
    rr(ctx,px,y+(hh-h)/2,pw,h,h/2,o.fill);
    if(o.ico){disc(ctx,px+ic/2,y+hh/2,ic/2,o.icoBg||'#FFFFFF');mi(ctx,o.ico,px+ic/2,y+hh/2,ic*.27,o.icoFg||o.fill)}
    ctx.font=FT(e,'bb',z);setLS(ctx,o.ls==null?.04:o.ls,z);ctx.fillStyle=o.fg;ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText(o.up===false?o.text:o.text.toUpperCase(),px+ic/2+(pw-ic)/2+(o.ico?ic*.1:0),y+hh/2+z*.05);ctx.restore()}};
}
/* liste : modes check | icon | num | col */
function bItems(ctx,e,items,x,w,o){
  if(!items.length)return bGap(0);
  const z=o.z,dz=o.dz||z*.88,gap=o.gap==null?z*.9:o.gap;
  if(o.mode==='col'){
    const n=Math.min(items.length,o.cols||items.length),cw=w/n,R=Math.min(o.R||z*1.6,cw*.42);
    const cells=items.slice(0,n).map((it,i)=>{
      const t=bPara(ctx,e,it.t,x+i*cw+cw*.06,cw*.88,{z,r:'bb',c:o.tc,a:'center',max:3,lh:1.12});
      const d=it.d?bPara(ctx,e,it.d,x+i*cw+cw*.06,cw*.88,{z:dz,c:o.dc,a:'center',max:5,lh:1.22}):bGap(0);
      return{t,d,ic:iconFor(it,i),i}});
    const hh=Math.max(...cells.map(c=>R*2+z*.7+c.t.h+(c.d.h?z*.3+c.d.h:0)));
    return{h:hh,paint(y){cells.forEach(c=>{const cx=x+c.i*cw+cw/2;
      if(o.sep&&c.i>0){ctx.strokeStyle=o.sep;ctx.lineWidth=Math.max(1.5,z*.07);ctx.beginPath();ctx.moveTo(x+c.i*cw,y+z*.2);ctx.lineTo(x+c.i*cw,y+hh-z*.2);ctx.stroke()}
      const bg=o.icoBgs?o.icoBgs[c.i%o.icoBgs.length]:o.icoBg;
      if(o.sq){rr(ctx,cx-R,y,2*R,2*R,R*.4,bg,o.ring,Math.max(2,R*.08));mi(ctx,c.ic,cx,y+R,R*.5,o.icoFg)}else icoDisc(ctx,c.ic,cx,y+R,R,bg,o.icoFg,o.ring);
      c.t.paint(y+R*2+z*.7);if(c.d.h)c.d.paint(y+R*2+z*.7+c.t.h+z*.3)})}};
  }
  const M=o.mode==='check'?z*1.5:z*2.5,off=M+z*.75;
  const rows=items.map((it,i)=>{
    const t=bPara(ctx,e,it.t,x+off,w-off,{z,r:it.d||o.boldAll?'bb':(o.plainT?'b':'bb'),c:o.tc,max:o.tmax||3,lh:1.2});
    const d=it.d?bPara(ctx,e,it.d,x+off,w-off,{z:dz,c:o.dc,max:o.dmax||4,lh:1.25}):bGap(0);
    const hh=Math.max(M,t.h+(d.h?z*.12+d.h:0));return{t,d,hh,ic:iconFor(it,i),i}});
  const total=rows.reduce((n,r)=>n+r.hh,0)+gap*(rows.length-1);
  return{h:total,paint(y){let yy=y;rows.forEach(r=>{
    const cy=yy+Math.min(M/2,r.hh/2);
    if(o.mode==='check'){disc(ctx,x+M/2,cy,M/2,o.icoBg);mi(ctx,'check',x+M/2,cy,M*.28,o.icoFg,Math.max(2,M*.11))}
    else if(o.mode==='num'){disc(ctx,x+M/2,cy,M/2,o.icoBgs?o.icoBgs[r.i%o.icoBgs.length]:o.icoBg);ctx.fillStyle=o.icoFg;ctx.font=FT(e,'bb',M*.5);ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(String(r.i+1),x+M/2,cy+M*.03)}
    else icoDisc(ctx,r.ic,x+M/2,cy,M/2,o.icoBgs?o.icoBgs[r.i%o.icoBgs.length]:o.icoBg,o.icoFg,o.ring);
    const ty=yy+(r.hh-(r.t.h+(r.d.h?z*.12+r.d.h:0)))/2;r.t.paint(ty);if(r.d.h)r.d.paint(ty+r.t.h+z*.12);yy+=r.hh+gap})}};
}
/* pied : coordonnées de la marque */
function bFoot(ctx,e,x,w,o){
  const items=e.items;if(!items.length)return bGap(0);
  const maxRows=o.rows||2,fl=layoutFooter(ctx,items,{x,maxW:w,align:o.a||'left',size:o.z,maxRows,pair:e.pair,style:o.style||current.iconStyle,fg:o.fg,accent:o.accent||o.fg});
  return{h:fl.height,paint:y=>fl.paint(y)};
}
/* logo placé à une position précise */
function bLogo(ctx,e,x,w,h,al){
  const b=current,pad=v.plate!=='none'?e.base*.024*2:0,mul=Math.max(.2,(h-pad))/(e.base*.15);
  const o=y=>({img:b.logoImg,pos:'t'+(al==='c'?'c':al==='r'?'r':'l'),area:{x,y,w,h},base:e.base,mm:0,resTop:0,resBottom:0,lum:b.logoLum,C:e.C,W:e.W,H:e.H,mul,center:null});
  const g=logoGeom(o(0));
  return{h,bw:g.bw,bh:g.bh,paint(y){drawLogo(ctx,o(y))}};
}
/* flux vertical : choisit l'échelle la plus grande qui tient, répartit l'espace restant */
function flowFit(ctx,e,build,y0,y1,lo,hi){
  const avail=y1-y0,minGap=e.u*.012;
  const need=s=>{const l=build(s);let t=0,gw=0;l.forEach((b,i)=>{t+=b.h;if(i)gw+=b.g==null?1:b.g});return t+gw*minGap};
  let a=lo,b2=hi,best=lo;
  if(need(hi)<=avail)best=hi;else for(let i=0;i<8;i++){const s=(a+b2)/2;if(need(s)<=avail){best=s;a=s}else b2=s}
  const l=build(best);let tot=0,gw=0;l.forEach((b,i)=>{tot+=b.h;if(i)gw+=b.g==null?1:b.g});
  const gap=gw?Math.max(minGap,(avail-tot)/gw):0;let y=y0;const pos=[];
  l.forEach((b,i)=>{if(i)y+=gap*(b.g==null?1:b.g);pos.push(y);y+=b.h});
  l.forEach((b,i)=>b.bg&&b.bg(pos[i]));l.forEach((b,i)=>b.paint(pos[i]));
  return{s:best,pos,list:l};
}
/* écran d'ordinateur portable avec la photo dedans */
function laptop(ctx,e,x,y,w,o){
  o=o||{};const h=w*.62,bz=w*.022,r=w*.03,dark=o.dark||'#0C1018';
  ctx.save();
  ctx.shadowColor='rgba(0,0,0,.45)';ctx.shadowBlur=w*.06;ctx.shadowOffsetY=w*.03;rr(ctx,x,y,w,h,r,dark);ctx.shadowColor='transparent';
  const sc={x:x+bz,y:y+bz,w:w-2*bz,h:h-2*bz};
  ctx.save();ctx.beginPath();rrPath(ctx,sc.x,sc.y,sc.w,sc.h,r*.5);ctx.clip();e.photo(sc,'rect',0);
  gradRect(ctx,sc.x,sc.y,sc.w,sc.h,'v',[[0,'rgba(255,255,255,.14)'],[.35,'rgba(255,255,255,0)'],[1,'rgba(0,0,0,.25)']]);ctx.restore();
  const bx=x-w*.07,bw=w*1.14,by=y+h;
  const g=ctx.createLinearGradient(0,by,0,by+w*.05);g.addColorStop(0,'#D9DDE3');g.addColorStop(1,'#8E96A2');
  ctx.beginPath();ctx.moveTo(bx+w*.02,by);ctx.lineTo(bx+bw-w*.02,by);ctx.quadraticCurveTo(bx+bw,by+w*.05,bx+bw-w*.03,by+w*.05);ctx.lineTo(bx+w*.03,by+w*.05);ctx.quadraticCurveTo(bx,by+w*.05,bx+w*.02,by);ctx.fillStyle=g;ctx.fill();
  rr(ctx,x+w*.4,by,w*.2,w*.012,w*.006,'rgba(0,0,0,.2)');
  ctx.restore();return{h:h+w*.05};
}
/* confettis déterministes */
function confetti(ctx,W,H,cols,n,seed){let s=seed||7;const rnd=()=>{s=(s*16807)%2147483647;return s/2147483647};
  for(let i=0;i<n;i++){const x=rnd()*W,y=rnd()*H,z=W*(.006+rnd()*.01);ctx.save();ctx.translate(x,y);ctx.rotate(rnd()*6);ctx.fillStyle=cols[i%cols.length];ctx.globalAlpha=.55+rnd()*.4;ctx.fillRect(-z,-z*.55,z*2,z*1.1);ctx.restore()}}
