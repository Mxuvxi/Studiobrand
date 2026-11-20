
/* ---------- rendu ---------- */
const fontReady=new Set();
async function ensureFonts(p){
  const ids=[p.d,p.b,'AM_bigshoulders','AM_nothing'],key=ids.join('|');if(fontReady.has(key))return;
  try{await Promise.race([Promise.all(ids.map(f=>document.fonts.load(`40px "${f}"`)).concat([document.fonts.load(`700 24px "${p.b}"`)]).concat(['AM_poppins','AM_bricolage'].map(f=>document.fonts.load(`40px "${f}"`)))),new Promise(r=>setTimeout(r,2500))])}catch(e){}
  fontReady.add(key);
}
function curPair(){const pb=PAIRS[current.pair]||PAIRS[0];return{d:v.tFont==='auto'?pb.d:v.tFont,b:v.bFont==='auto'?pb.b:v.bFont}}
function mkSm(ph){const r=Math.min(1,560/Math.max(ph.w,ph.h)),c=document.createElement('canvas');c.width=Math.max(1,Math.round(ph.w*r));c.height=Math.max(1,Math.round(ph.h*r));c.getContext('2d').drawImage(ph.src,0,0,c.width,c.height);return{src:c,w:c.width,h:c.height}}
function setPhoto(c){v.photo={src:c,w:c.width,h:c.height};v.photoSm=mkSm(v.photo);v.pf={};v.zoom=1;v.fx=.5;v.fy=.5;v.cut=null;try{renderSlots()}catch(_){}}
let raf=0;
function schedule(){if(!raf)raf=requestAnimationFrame(()=>{raf=0;render()})}
async function render(){
  if(!current||!current.logoImg||!v.photo)return;
  await ensureFonts(curPair());
  const f=FORMATS[v.fmt],cv=$('cv');
  if(cv.width!==f.w||cv.height!==f.h){cv.width=f.w;cv.height=f.h}
  draw(cv.getContext('2d'),f.w,f.h);
  schedThumbs();
}
let thT=0;
function schedThumbs(){clearTimeout(thT);thT=setTimeout(renderThumbs,320)}
async function renderThumbs(){
  const box=$('tpl-gal');
  if(!box||!current||!current.logoImg||!v.photo||$('view-visuel').hidden||activeTab!=='model')return;
  const f=FORMATS[v.fmt],tw=210,th=Math.round(tw*f.h/f.w),k=tw/f.w;
  await ensureFonts(curPair());
  const saveGeom=v.geom;
  box.querySelectorAll('button').forEach(btn=>{
    const c=btn.querySelector('canvas');if(c.width!==tw||c.height!==th){c.width=tw;c.height=th}
    const x=c.getContext('2d');x.setTransform(1,0,0,1,0,0);x.scale(k,k);
    try{draw(x,f.w,f.h,{tpl:btn.dataset.k,thumb:true,k})}catch(e){console.error(btn.dataset.k,e)}
  });
  v.geom=saveGeom;
}
if(document.fonts&&document.fonts.addEventListener)document.fonts.addEventListener('loadingdone',schedule);
let toastT=0;
function toast(msg){const t=$('toast');t.textContent=msg;t.hidden=false;clearTimeout(toastT);toastT=setTimeout(()=>{t.hidden=true},3600)}

/* ---------- stockage local : IndexedDB, avec repli localStorage ---------- */
const LSP='atelier-de-marque-styles';
function idbOpen(){return new Promise((res,rej)=>{try{const r=indexedDB.open('atelier-de-marque',1);r.onupgradeneeded=()=>r.result.createObjectStore('kv');r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)}catch(e){rej(e)}})}
async function kvGet(k){try{const db=await idbOpen();return await new Promise((res,rej)=>{const q=db.transaction('kv').objectStore('kv').get(k);q.onsuccess=()=>res(q.result);q.onerror=()=>rej(q.error)})}catch(e){return undefined}}
async function kvSet(k,val){try{const db=await idbOpen();await new Promise((res,rej)=>{const t=db.transaction('kv','readwrite');t.objectStore('kv').put(val,k);t.oncomplete=res;t.onerror=()=>rej(t.error)});return true}catch(e){return false}}
const lsGet=k=>{try{return JSON.parse(localStorage.getItem(k)||'null')}catch(e){return null}};
const lsSet=(k,val)=>{try{localStorage.setItem(k,JSON.stringify(val));return true}catch(e){return false}};
const stripBrand=({logoImg,logo,...r})=>r;
async function persist(){const arr=saved.map(stripBrand);let ok=await kvSet('brands',arr);if(!ok)ok=lsSet(LS,arr);return ok}
async function persistPresets(){let ok=await kvSet('presets',presets);if(!ok)ok=lsSet(LSP,presets);return ok}
async function loadSaved(){
  let arr=await kvGet('brands');if(!Array.isArray(arr))arr=lsGet(LS)||[];
  const pr=await kvGet('presets');presets=Array.isArray(pr)?pr:(lsGet(LSP)||[]);
  const out=[];
  for(const b of arr){try{
    b.info=b.info||{};b.show=b.show||{};b.logoOpt=Object.assign(DEFOPT(),b.logoOpt||{});
    await buildLogo(b);out.push(b);
  }catch(e){}}
  saved=out;
}
const clone=b=>({...b,colors:{...b.colors},info:{...b.info},show:{...b.show},logoOpt:{...b.logoOpt},palette:[...(b.palette||[])]});

/* ---------- marque ---------- */
function setPlateDefault(){v.plate=current.hasAlpha?'none':'light';$('v-plate').value=v.plate}
function applyCharte(i){
  const ch=chartes[i];if(!ch)return;
  current.colors={...ch.colors};current.pair=ch.pair;current.logoPos=ch.logoPos;current.iconStyle=ch.iconStyle;current.charteIdx=i;
  v.accent=null;v.tColor=null;syncBrandUI();syncVisualUI();schedule();
}
async function setLogoFromFile(file){
  try{
    const url=await readDataURL(file),img=await loadImg(url),c=canvasFromImg(img,600);
    const wasDemo=current.isDemo;
    if(wasDemo||!current.name||current.name==="Marque d'exemple"){const nb=file.name.replace(/\.[^.]+$/,'').replace(/[-_]+/g,' ').trim();current.name=nb?nb.charAt(0).toUpperCase()+nb.slice(1):'Ma marque'}
    if(wasDemo){current.id=uid();for(const k of Object.keys(DEMO_INFO)){if(current.info[k]===DEMO_INFO[k]){delete current.info[k];delete current.show[k]}}}
    current.logoSrc=c.toDataURL('image/png');current.logoOpt=DEFOPT();current.isDemo=false;
    await buildLogo(current);
    if(current.bgGuess)current.logoOpt.bg=current.bgGuess;
    chartes=genChartes(current.palette);setPlateDefault();
    applyCharte(0);renderChartes();renderSaved();
    toast(current.hasAlpha?'Logo transparent conservé. 5 chartes proposées.':'Logo analysé. 5 chartes proposées.');
  }catch(e){toast("Ce fichier n'a pas pu être lu comme image.")}
}
async function initDemo(){
  const b={id:'demo',name:"Marque d'exemple",logoSrc:makeDemoLogo(),logoOpt:DEFOPT(),isDemo:true,info:{...DEMO_INFO},show:Object.fromEntries(Object.keys(DEMO_INFO).map(k=>[k,true])),colors:{},pair:0,logoPos:'tl',iconStyle:'contour',charteIdx:0};
  await buildLogo(b);chartes=genChartes(b.palette);
  const ch=chartes[0];b.colors={...ch.colors};b.pair=ch.pair;b.logoPos=ch.logoPos;b.iconStyle=ch.iconStyle;
  current=b;
}
function resetOverrides(){v.elo={};v.sel=null;v.foot={mode:'auto',size:1,align:'auto',col:null};try{syncFootUI()}catch(_){}v.accent=null;v.tColor=null;v.logoFree=null;v.dx=0;v.dy=0;v.logoRot=0;Object.values(v.pf).forEach(p=>{delete p.dx;delete p.dy;delete p.logoFree})}
function useBrand(b){
  current=clone(b);current.isDemo=false;chartes=genChartes(current.palette);resetOverrides();
  setPlateDefault();syncBrandUI();syncVisualUI();renderChartes();renderSaved();schedule();
}
function newBrand(){initDemo().then(()=>{resetOverrides();setPlateDefault();syncBrandUI();syncVisualUI();renderChartes();renderSaved();schedule();toast('Nouvelle marque : importez votre logo pour générer la charte.')})}
async function saveBrand(){
  if(current.isDemo){toast("Importez d'abord votre logo pour enregistrer une marque.");return}
  current.name=($('brand-name').value||'').trim()||'Ma marque';
  const i=saved.findIndex(s=>s.id===current.id),copy=clone(current);
  if(i>=0)saved[i]=copy;else saved.push(copy);
  const ok=await persist();renderSaved();syncVisualUI();
  toast(ok?'Marque enregistrée, coordonnées comprises.':"Enregistrement impossible dans ce navigateur. Utilisez « Sauvegarder tout » pour garder un fichier.");
}
let rbT=0,rbTok=0;
function queueRebuild(){
  clearTimeout(rbT);
  rbT=setTimeout(async()=>{
    const tok=++rbTok,b=current,before=b.hasAlpha;
    try{await buildLogo(b)}catch(e){return}
    if(tok!==rbTok||b!==current)return;
    if(b.hasAlpha!==before)setPlateDefault();
    chartes=genChartes(b.palette);syncLogoUI();renderChartes();renderSaved();schedule();
  },120);
}
async function pickColor(){
  if(!window.EyeDropper){toast("Pipette indisponible sur ce navigateur : utilisez le sélecteur de couleur.");return}
  const prev=$('logo-prev');prev.src=current.logoSrc;
  try{const r=await new EyeDropper().open();current.logoOpt.bg=r.sRGBHex;$('rm-color').value=r.sRGBHex;queueRebuild()}catch(e){}
  prev.src=current.logo;
}

/* ---------- interface : marque ---------- */
function renderSaved(){
  const box=$('saved');box.innerHTML='';$('saved-empty').hidden=saved.length>0;
  saved.forEach(b=>{
    const chip=document.createElement('div');chip.className='chip';chip.setAttribute('aria-current',String(current&&current.id===b.id));
    const open=document.createElement('button');open.type='button';open.innerHTML=`<img alt="" src="${b.logo}"><span>${esc(b.name)}</span>`;
    open.addEventListener('click',()=>useBrand(b));
    const x=document.createElement('button');x.type='button';x.className='x';x.textContent='✕';x.setAttribute('aria-label','Supprimer '+b.name);
    let armed=false,tm=0;
    x.addEventListener('click',()=>{
      if(!armed){armed=true;x.textContent='Supprimer ?';x.classList.add('confirm');tm=setTimeout(()=>{armed=false;x.textContent='✕';x.classList.remove('confirm')},3000);return}
      clearTimeout(tm);saved=saved.filter(s=>s.id!==b.id);persist();if(current.id===b.id)current.id=uid();
      renderSaved();syncVisualUI();toast('Marque supprimée.');
    });
    chip.append(open,x);box.append(chip);
  });
}
function renderChartes(){
  const box=$('chartes');box.innerHTML='';
  chartes.forEach((ch,i)=>{
    const P=PAIRS[ch.pair],C=ch.colors,pl=Object.fromEntries(POS)[ch.logoPos].toLowerCase(),is=Object.fromEntries(ICONSTYLES)[ch.iconStyle].toLowerCase();
    const btn=document.createElement('button');btn.type='button';btn.className='charte';btn.setAttribute('aria-pressed',String(current.charteIdx===i));
    btn.innerHTML=`<span class="ch-top" style="background:${C.bg};color:${C.text}">
      <span class="ch-logo"><img alt="" src="${current.logo}"></span>
      <span class="ch-name" style="font-family:'${P.d}',sans-serif">${esc(current.name)}</span>
      <span class="ch-body" style="font-family:'${P.b}',sans-serif">Un texte courant lisible, Aa</span>
      <span class="ch-sw"><i style="background:${C.bg}"></i><i style="background:${C.text}"></i><i style="background:${C.accent}"></i><i style="background:${C.second}"></i></span>
    </span><span class="ch-meta"><b>${ch.name}</b><br>${P.name}<br>Logo ${pl}, icônes ${is}</span>`;
    btn.addEventListener('click',()=>applyCharte(i));box.append(btn);
  });
}
function renderPalette(){
  const c=current.colors,list=[c.bg,c.text,c.accent,c.second];
  $('cap').innerHTML=list.map(x=>`<i style="background:${x}"></i>`).join('');
  $('hexes').innerHTML=list.map(x=>`<span>${x.slice(1).toUpperCase()}</span>`).join('');
  $('gbar').style.background=`linear-gradient(90deg,${c.bg},${c.second},${c.accent},${c.text})`;
}
function syncLogoUI(){
  const b=current;$('logo-prev').src=b.logo;
  const tag=$('logo-tag'),hint=$('logo-hint');tag.className='tag';
  if(b.isDemo){tag.textContent="Logo d'exemple";hint.textContent="Importez votre logo. Un PNG transparent est utilisé tel quel, sans fond."}
  else if(b.hasAlphaSrc){tag.textContent='PNG transparent conservé';tag.classList.add('ok');hint.textContent="Le fond transparent est gardé. Aucune pastille n'est ajoutée derrière le logo."}
  else if(b.bgGuess&&!b.logoOpt.rm){tag.textContent='Fond uni détecté';hint.textContent="Votre logo a un fond uni. Cochez « Rendre le fond du logo transparent » pour un rendu plus propre."}
  else if(b.logoOpt.rm){tag.textContent=b.hasAlpha?'Fond retiré':'Fond opaque';tag.classList.toggle('ok',b.hasAlpha);hint.textContent=b.hasAlpha?"Réglez la tolérance si des bords restent ou si l'intérieur du logo disparaît.":"Rien n'a été retiré. Augmentez la tolérance ou choisissez la couleur du fond."}
  else{tag.textContent='Fond opaque';hint.textContent="Le logo n'est pas transparent. Vous pouvez essayer de retirer son fond."}
  $('rm-on').checked=!!b.logoOpt.rm;$('rm-opts').hidden=!b.logoOpt.rm;
  $('rm-color').value=b.logoOpt.bg;$('rm-tol').value=b.logoOpt.tol;$('rm-mode').value=b.logoOpt.mode;
  $('detected').innerHTML=b.palette.length?b.palette.map(c=>`<i style="background:${c}" title="${c}"></i>`).join(''):'<span class="hint">Logo clair ou monochrome : couleur de repli utilisée.</span>';
}
function syncInfoUI(){
  FIELDS.forEach(([k])=>{const i=$('f-'+k),s=$('s-'+k);if(i)i.value=current.info[k]||'';if(s)s.checked=!!current.show[k]});
  EXTRA.forEach(([k])=>{const i=$('f-'+k);if(i)i.value=current.info[k]||''});
  $('f-slogan').value=current.info.slogan||'';
}
function syncBrandUI(){
  const b=current;if(!b)return;
  $('brand-name').value=b.name;syncLogoUI();syncInfoUI();
  [['bg','c-bg'],['text','c-text'],['accent','c-accent'],['second','c-second']].forEach(([k,id])=>{$(id).value=b.colors[k];$('t-'+k).textContent=b.colors[k].toUpperCase()});
  $('b-pair').value=String(b.pair);$('b-pos').value=b.logoPos;$('b-icons').value=b.iconStyle;
  document.querySelectorAll('#chartes .charte').forEach((el,i)=>el.setAttribute('aria-pressed',String(b.charteIdx===i)));
  renderPalette();
}
function manualEdit(){current.charteIdx=-1;document.querySelectorAll('#chartes .charte').forEach(el=>el.setAttribute('aria-pressed','false'));renderPalette();schedule()}
