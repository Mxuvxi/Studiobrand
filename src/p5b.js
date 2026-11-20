
/* ================= gestion des éléments du visuel ================= */
v.elo={};v.sel=null;v.hits=[];v.foot={mode:'auto',size:1,align:'auto',col:null};
let DRAW={W:1,H:1,rec:false};
const ELS=[['logo','Logo','m'],['title','Titre et textes','t'],['sub','Sous-titre','t'],['kicker','Accroche','t'],['badge','Pastille','t'],['cta','Bouton','t'],['tags','Mots-clés','t'],['date','Date et heure','i'],['place','Lieu','i'],['person','Intervenant','i'],['body','Texte libre','i'],['lists','Listes et sections','i'],['foot','Coordonnées et réseaux','i'],['cut0','Personne détourée 1','p'],['cut1','Personne détourée 2','p'],['cut2','Personne détourée 3','p'],['cut3','Personne détourée 4','p'],['decor','Décor','d']];
const ELN=Object.fromEntries(ELS.map(a=>[a[0],a[1]]));
function EO(id,f){const o=(v.elo[f||v.fmt]||{})[id];return o||null}
function EOw(id){const f=v.fmt;(v.elo[f]=v.elo[f]||{});return v.elo[f][id]=v.elo[f][id]||{}}
function hid(id){const o=EO(id);return!!(o&&o.hide)}
function elPaint(ctx,id,b,fn){
  const eo=EO(id),W=DRAW.W,H=DRAW.H,dx=(eo&&eo.dx||0)*W+(b.ex||0),dy=(eo&&eo.dy||0)*H+(b.ey||0),s=(eo&&eo.s)||1;
  const px=b.x+b.w*(b.al==='center'?.5:b.al==='right'?1:0),py=b.y;
  ctx.save();if(dx||dy)ctx.translate(dx,dy);if(s!==1){ctx.translate(px,py);ctx.scale(s,s);ctx.translate(-px,-py)}
  try{fn()}finally{ctx.restore()}
  if(DRAW.rec&&b.h>0&&b.w>0)v.hits.push({id,x:px+(b.x-px)*s+dx,y:py+dy,w:b.w*s,h:b.h*s});
}
function tagBlk(ctx,id,b,x,w,al,ex){
  if(hid(id))return{h:0,tw:0,bw:0,bh:0,lines:0,paint(){}};
  return{...b,paint(y,...r){elPaint(ctx,id,{x,y,w:id==='logo'?(b.bw||w):w,h:id==='logo'?(b.bh||b.h):b.h,al,ex:ex&&ex.ex,ey:ex&&ex.ey},()=>b.paint(y,...r))}};
}
function elLogo(ctx,o){
  if(hid('logo'))return;const g=logoGeom(o);
  elPaint(ctx,'logo',{x:g.x,y:g.y,w:g.bw,h:g.bh,al:'left'},()=>drawLogo(ctx,o));
}
/* enveloppes des blocs communs aux modèles construits */
{
  const _bTitle=bTitle,_bLogo=bLogo,_bFoot=bFoot,_bPara=bPara,_dateBox=dateBox,_placeBlock=placeBlock,_pillBlock=pillBlock,_bPill=bPill,_bItems=bItems,_iconRow=iconRow;
  const boxFill=(e)=>v.tBox==='dark'?'#10151A':v.tBox==='light'?'#FFFFFF':v.tBox==='accent'?e.C.accent:'rgba(14,20,26,.58)';
  bTitle=function(ctx,e,x,w,o){
    if(hid('title'))return bGap(0);
    o={...o};const box=v.tBox&&v.tBox!=='none',fill=box?boxFill(e):null;
    if(v.tColor)o.c=v.tColor;else if(box)o.c=v.tBox==='light'?'#11171A':'#FFFFFF';
    const al=v.align&&v.align!=='auto'?v.align:(o.a||'left');o.a=al;
    let x2=x,w2=w;if(v.tWidth<1){w2=w*Math.max(.4,v.tWidth);x2=al==='center'?x+(w-w2)/2:al==='right'?x+w-w2:x}
    if(hid('sub'))o.nosub=true;
    const pad=box?e.base*.03:0,b=_bTitle(ctx,e,x2+pad,w2-2*pad,o);
    const out={h:b.h+2*pad,paint(y){
      if(box){ctx.save();if(v.tBox!=='glass'){ctx.shadowColor='rgba(0,0,0,.25)';ctx.shadowBlur=e.base*.03}ctx.fillStyle=fill;ctx.beginPath();rrPath(ctx,x2,y,w2,b.h+2*pad,e.base*.03);ctx.fill();ctx.restore()}
      b.paint(y+pad)}};
    return tagBlk(ctx,'title',out,x2,w2,al,{ex:(v.dx||0)*DRAW.W,ey:(v.dy||0)*DRAW.H});
  };
  bLogo=function(ctx,e,x,w,h,al){
    if(hid('logo')){e._logo=1;return{h:0,bw:0,bh:0,paint(){}}}
    const b=_bLogo(ctx,e,x,w,h,al),bx=al==='c'?x+(w-b.bw)/2:al==='r'?x+w-b.bw:x,t=tagBlk(ctx,'logo',b,bx,b.bw,'left'),p=t.paint;
    t.paint=(...a)=>{e._logo=1;return p(...a)};return t;
  };
  bFoot=function(ctx,e,x,w,o){if(hid('foot')){e._foot=1;return bGap(0)}const t=tagBlk(ctx,'foot',_bFoot(ctx,e,x,w,o),x,w,o.a||'left'),p=t.paint;t.paint=(...a)=>{e._foot=1;return p(...a)};return t};
  bPara=function(ctx,e,str,x,w,o){
    const isSub=str&&v.sub&&str===v.sub;
    if(isSub&&hid('sub'))return{h:0,lines:0,paint(){}};
    const b=_bPara(ctx,e,str,x,w,o);return isSub?tagBlk(ctx,'sub',b,x,w,o.a||'left'):b;
  };
  dateBox=function(ctx,e,x,w,d,o){if(hid('date'))return bGap(0);return tagBlk(ctx,'date',_dateBox(ctx,e,x,w,d,o),x,w,'left')};
  placeBlock=function(ctx,e,x,w,d,o){if(hid('place'))return bGap(0);return tagBlk(ctx,'place',_placeBlock(ctx,e,x,w,d,o),x,w,'left')};
  pillBlock=function(ctx,e,text,x,w,o){if(hid('cta'))return bGap(0);return tagBlk(ctx,'cta',_pillBlock(ctx,e,text,x,w,o),x,w,'center')};
  bPill=function(ctx,e,x,w,o){if(hid('lists'))return bGap(0);return tagBlk(ctx,'lists',_bPill(ctx,e,x,w,o),x,w,'left')};
  bItems=function(ctx,e,items,x,w,o){if(hid('lists'))return bGap(0);return tagBlk(ctx,'lists',_bItems(ctx,e,items,x,w,o),x,w,'left')};
  iconRow=function(ctx,e,ic,text,x,w,z,o){const id=(ic==='calendar'||ic==='clock')?'date':'place';if(hid(id))return bGap(0);return tagBlk(ctx,id,_iconRow(ctx,e,ic,text,x,w,z,o),x,w,'left')};
  /* décor : formes décoratives */
}
{
  const _glow=glow,_conf=confetti,_rib=ribbon,_wave=waveBand;
  glow=function(...a){if(hid('decor'))return;return _glow.apply(this,a)};
  confetti=function(...a){if(hid('decor'))return;return _conf.apply(this,a)};
  ribbon=function(...a){if(hid('decor'))return;return _rib.apply(this,a)};
  waveBand=function(...a){if(hid('decor'))return;return _wave.apply(this,a)};
}
/* point d'entrée : contexte de dessin, repères, contour de sélection */
{
  const _draw=draw;
  draw=function(ctx,W,H,opt){
    DRAW={W,H,rec:ctx.canvas===$('cv')&&!(opt&&opt.thumb)};
    if(DRAW.rec)v.hits=[];
    const r=_draw.apply(this,arguments);
    if(DRAW.rec){v.seen=new Set(v.hits.map(h=>h.id));
      if(v.drag==='el'&&v.sel){const h=v.hits.find(q=>q.id===v.sel);if(h){ctx.save();ctx.setLineDash([W*.012,W*.008]);ctx.lineWidth=Math.max(3,W*.004);ctx.strokeStyle='#FF8A3D';ctx.strokeRect(h.x-W*.008,h.y-W*.008,h.w+W*.016,h.h+W*.016);ctx.restore()}}}
    return r;
  };
}
/* ---------- interface ---------- */
function elState(id){const o=EO(id);return{hide:!!(o&&o.hide),dx:o&&o.dx||0,dy:o&&o.dy||0,s:o&&o.s||1}}
function elSelect(id){v.sel=id;v.drag='el';try{syncControls()}catch(_){}elUI();schedule()}
function elUI(){
  const box=$('el-list');if(!box)return;
  const seen=v.seen||new Set();
  box.innerHTML=ELS.map(([id,n,g])=>{const s=elState(id),present=seen.has(id)||s.hide,mv=s.dx||s.dy||s.s!==1;
    if(id.startsWith('cut')&&!present&&!hid(id))return'';
    return`<div class="el${v.sel===id?' on':''}${present?'':' off'}" data-id="${id}"><button type="button" class="el-n" data-a="sel">${n}<small>${s.hide?'Masqué':present?(mv?'Déplacé':'Visible'):'Absent de ce modèle'}</small></button><button type="button" class="el-eye" data-a="eye" aria-label="${s.hide?'Afficher':'Masquer'} ${n}">${s.hide?'Afficher':'Masquer'}</button></div>`}).join('');
  const ed=$('el-edit');
  if(!v.sel){ed.hidden=true;return}
  ed.hidden=false;const s=elState(v.sel);
  $('el-t').textContent=ELN[v.sel]||'';
  $('el-x').value=s.dx;$('el-y').value=s.dy;$('el-s').value=s.s;
  const noMove=v.sel==='decor';$('el-mv').hidden=noMove;
  $('el-eye2').textContent=s.hide?'Afficher':'Masquer';
}
function elWire(){
  $('el-list').addEventListener('click',e=>{const row=e.target.closest('.el');if(!row)return;const id=row.dataset.id,a=e.target.closest('button')?.dataset.a;
    if(a==='eye'){const o=EOw(id);o.hide=!o.hide;if(id==='foot'&&!o.hide)o.add=true;elUI();schedule()}else elSelect(id)});
  const set=(k,val)=>{if(!v.sel)return;EOw(v.sel)[k]=val;schedule();elUI()};
  $('el-x').addEventListener('input',e=>set('dx',+e.target.value));$('el-y').addEventListener('input',e=>set('dy',+e.target.value));$('el-s').addEventListener('input',e=>set('s',+e.target.value));
  $('el-eye2').addEventListener('click',()=>{if(!v.sel)return;const o=EOw(v.sel);o.hide=!o.hide;if(v.sel==='foot'&&!o.hide)o.add=true;elUI();schedule()});
  $('el-reset1').addEventListener('click',()=>{if(!v.sel)return;const f=v.fmt;if(v.elo[f])delete v.elo[f][v.sel];if(v.sel==='title'){v.dx=0;v.dy=0}elUI();schedule()});
  $('el-reset').addEventListener('click',()=>{v.elo[v.fmt]={};v.sel=null;v.dx=0;v.dy=0;elUI();schedule();toast('Éléments remis comme dans le modèle.')});
  const F=()=>{if(!(v.seen&&v.seen.has('foot'))){const o=EOw('foot');if(!o.hide)o.add=true}return v.foot};
  $('f-mode').addEventListener('change',e=>{F().mode=e.target.value;schedule()});
  $('f-size').addEventListener('input',e=>{F().size=+e.target.value;schedule()});
  $('f-align').addEventListener('change',e=>{F().align=e.target.value;schedule()});
  $('f-col').addEventListener('input',e=>{F().col=e.target.value;schedule()});
  $('f-col-reset').addEventListener('click',()=>{F().col=null;schedule()});
  $('f-reset').addEventListener('click',()=>{v.foot={mode:'auto',size:1,align:'auto',col:null};syncFootUI();schedule()});
  /* choix d'un élément directement sur l'aperçu */
  const cv=$('cv');
  cv.addEventListener('pointerdown',e=>{if(v.drag!=='el')return;
    const rc=cv.getBoundingClientRect(),k=cv.width/rc.width,px=(e.clientX-rc.left)*k,py=(e.clientY-rc.top)*k;
    const hs=(v.hits||[]).filter(h=>px>=h.x&&px<=h.x+h.w&&py>=h.y&&py<=h.y+h.h).sort((a,b)=>a.w*a.h-b.w*b.h);
    if(hs.length&&hs[0].id!==v.sel){v.sel=hs[0].id;elUI();schedule()}else if(!hs.length){v.sel=null;elUI();schedule()}
  });
  let last=null;
  cv.addEventListener('pointerdown',e=>{last={x:e.clientX,y:e.clientY}});
  cv.addEventListener('pointerup',()=>{last=null});cv.addEventListener('pointercancel',()=>{last=null});
  cv.addEventListener('pointermove',e=>{if(v.drag!=='el'||!v.sel||!last)return;
    const rc=cv.getBoundingClientRect(),k=cv.width/rc.width,o=EOw(v.sel),mx=e.clientX-last.x,my=e.clientY-last.y;last={x:e.clientX,y:e.clientY};
    o.dx=clamp((o.dx||0)+mx*k/cv.width,-1,1);o.dy=clamp((o.dy||0)+my*k/cv.height,-1,1);schedule();elUIsoft()});
}
let _softT=0;function elUIsoft(){if(_softT)return;_softT=setTimeout(()=>{_softT=0;elUI()},120)}
function syncFootUI(){const F=v.foot;$('f-mode').value=F.mode;$('f-size').value=F.size;$('f-align').value=F.align;if(F.col)$('f-col').value=F.col}
/* mise à jour de la liste après chaque rendu */
{const _render=render;render=async function(){await _render();try{elUI()}catch(_){}}}
