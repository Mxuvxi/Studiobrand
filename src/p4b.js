
/* ---------- interface : visuel ---------- */
let activeTab='model';
const TABS=[['model','Modèle'],['photo','Photo'],['text','Texte'],['logo','Logo'],['layout','Disposition'],['export','Exporter']];
function setTab(t){
  activeTab=t;
  document.querySelectorAll('#ctabs button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.k===t)));
  document.querySelectorAll('.controls [data-tab]').forEach(p=>{p.hidden=p.dataset.tab!==t});
  if(t==='model')schedThumbs();
}
function renderShowGroup(){
  const box=$('show-group');box.innerHTML='';
  const have=ORDER.filter(k=>(current.info[k]||'').trim());
  $('show-empty').hidden=have.length>0;
  have.forEach(k=>{
    const l=document.createElement('label');l.className='check';
    l.innerHTML=`<input type="checkbox" value="${k}"${current.show[k]?' checked':''}> ${esc(LABEL[k])}`;
    l.querySelector('input').addEventListener('change',e=>{current.show[k]=e.target.checked;const s=$('s-'+k);if(s)s.checked=e.target.checked;schedule()});
    box.append(l);
  });
}
function renderInsert(){
  const sel=$('ins-info');if(!sel)return;
  const opts=[['','Insérer une info de la marque…']];
  if(current.name)opts.push(['name',current.name]);
  [['slogan','Slogan'],['sector',"Secteur"],['desc','Description'],['founder','Contact'],['year','Année'],['mentions','Mention']].forEach(([k,l])=>{const t=(current.info[k]||'').trim();if(t)opts.push([k,l+' : '+(t.length>34?t.slice(0,32)+'…':t)])});
  sel.innerHTML=opts.map(([k,t])=>`<option value="${k}">${esc(t)}</option>`).join('');
}
function syncVisualUI(){
  const sw=$('brand-switch');sw.innerHTML='';
  const inSaved=saved.some(s=>s.id===current.id);
  if(!inSaved){const o=document.createElement('option');o.value='__current';o.textContent=current.name+(current.isDemo?' (exemple)':' (non enregistrée)');sw.append(o)}
  saved.forEach(s=>{const o=document.createElement('option');o.value=s.id;o.textContent=s.name;sw.append(o)});
  sw.value=inSaved?current.id:'__current';
  $('v-accent').value=v.accent||current.colors.accent;syncControls();
  renderShowGroup();renderInsert();renderPresets();
}
function syncStageInfo(){const f=FORMATS[v.fmt];$('stage-info').textContent=`${f.label} · ${f.w} × ${f.h} px · ${f.note}`;$('style-info').textContent=TPLS[v.tpl].info}
async function setPhotoFromFile(file){
  try{
    const url=await readDataURL(file),img=await loadImg(url),c=canvasFromImg(img,2400);
    setPhoto(c);syncControls();
    $('photo-tag').textContent=file.name.length>28?file.name.slice(0,25)+'…':file.name;schedule();
  }catch(e){toast("Ce fichier n'a pas pu être lu comme image.")}
}
function setFmt(f){
  v.pf[v.fmt]={zoom:v.zoom,fx:v.fx,fy:v.fy};v.fmt=f;
  const p=v.pf[f]||{zoom:1,fx:.5,fy:.5};v.zoom=p.zoom;v.fx=p.fx;v.fy=p.fy;
  syncStageInfo();syncControls();schedule();
}

/* styles prêts et styles enregistrés */
const RESET_KEYS=['filter','duo','vig','wash','tFont','bFont','tSize','sSize','lh','ls','upper','tEffect','tBox','bright','contr','sat','blur'];
function applyStyle(s,full){
  const d=V0();
  if(full){PKEYS.forEach(k=>{v[k]=k in s?s[k]:d[k]})}
  else{RESET_KEYS.forEach(k=>{v[k]=d[k]});Object.assign(v,s)}
  v.dx=0;v.dy=0;v.logoFree=null;syncStageInfo();syncControls();schedule();
}
function renderPresets(){
  const box=$('presets');if(!box)return;
  box.innerHTML=PRESETS.map((p,i)=>`<button type="button" data-i="${i}">${esc(p.name)}</button>`).join('');
  const mine=$('mypresets');
  mine.innerHTML=presets.length?presets.map((p,i)=>`<span class="chip"><button type="button" data-i="${i}" class="ap">${esc(p.name)}</button><button type="button" class="x" data-i="${i}" aria-label="Supprimer ${esc(p.name)}">✕</button></span>`).join(''):'<span class="hint">Aucun style enregistré pour le moment.</span>';
}

/* ---------- export ---------- */
let dl=null,lastUrl=null;
async function renderTo(canvas,fmtKey,scale,tplOverride){
  const f=FORMATS[fmtKey],snap={fmt:v.fmt,zoom:v.zoom,fx:v.fx,fy:v.fy,geom:v.geom,tpl:v.tpl};
  const p=fmtKey===v.fmt?{zoom:v.zoom,fx:v.fx,fy:v.fy}:(v.pf[fmtKey]||{zoom:1,fx:.5,fy:.5});
  v.fmt=fmtKey;v.zoom=p.zoom;v.fx=p.fx;v.fy=p.fy;
  canvas.width=Math.round(f.w*scale);canvas.height=Math.round(f.h*scale);
  try{await ensureFonts(curPair());draw(canvas.getContext('2d'),canvas.width,canvas.height,{tpl:tplOverride})}
  finally{v.fmt=snap.fmt;v.zoom=snap.zoom;v.fx=snap.fx;v.fy=snap.fy;v.geom=snap.geom}
}
const toBlob=(cv,kind,q)=>new Promise(r=>cv.toBlob(r,kind==='png'?'image/png':'image/jpeg',q));
const exScale=()=>+($('ex-scale').value||1),exQ=()=>+($('ex-q').value||.93);
async function makeBlob(kind){
  const cv=document.createElement('canvas');await renderTo(cv,v.fmt,exScale());
  if(kind==='jpg'){const o=document.createElement('canvas');o.width=cv.width;o.height=cv.height;const x=o.getContext('2d');x.fillStyle='#FFFFFF';x.fillRect(0,0,o.width,o.height);x.drawImage(cv,0,0);return toBlob(o,'jpg',exQ())}
  return toBlob(cv,'png');
}
const fileName=(kind,fmt)=>`${slug(current.name)||'visuel'}-${fmt||v.fmt}-${v.tpl}.${kind==='png'?'png':'jpg'}`;
async function saveBlob(blob,name,okMsg){
  if(dl){
    try{await dl.save({filename:name,data:blob});toast(okMsg||'Fichier exporté.');return true}
    catch(e){if(e&&e.code==='declined'){toast('Export annulé.');return false}}
  }
  try{
    const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.rel='noopener';
    document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);
    toast('Téléchargement lancé.');return true;
  }catch(e){return false}
}
async function exportImage(kind){
  const blob=await makeBlob(kind);
  if(!blob){toast("L'image n'a pas pu être générée.");return}
  const ok=await saveBlob(blob,fileName(kind),'Visuel exporté.');
  if(!ok)showImage();
}
async function showImage(){
  const blob=await makeBlob('png');if(!blob)return;
  if(lastUrl)URL.revokeObjectURL(lastUrl);lastUrl=URL.createObjectURL(blob);
  $('ov-img').src=lastUrl;$('ov').hidden=false;$('ov-close').focus();
}
const CRCT=(()=>{const t=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0}return t})();
const crc32=u=>{let c=0xFFFFFFFF;for(let i=0;i<u.length;i++)c=CRCT[(c^u[i])&255]^(c>>>8);return(c^0xFFFFFFFF)>>>0};
function makeZip(files){
  const enc=new TextEncoder(),parts=[],cd=[];let off=0;
  const d=new Date(),dt=(d.getHours()<<11)|(d.getMinutes()<<5)|(d.getSeconds()>>1),dd=((d.getFullYear()-1980)<<9)|((d.getMonth()+1)<<5)|d.getDate();
  for(const f of files){
    const nm=enc.encode(f.name),crc=crc32(f.data),sz=f.data.length;
    const lh=new DataView(new ArrayBuffer(30));lh.setUint32(0,0x04034b50,true);lh.setUint16(4,20,true);lh.setUint16(6,0x0800,true);lh.setUint16(10,dt,true);lh.setUint16(12,dd,true);lh.setUint32(14,crc,true);lh.setUint32(18,sz,true);lh.setUint32(22,sz,true);lh.setUint16(26,nm.length,true);
    parts.push(new Uint8Array(lh.buffer),nm,f.data);
    const ch=new DataView(new ArrayBuffer(46));ch.setUint32(0,0x02014b50,true);ch.setUint16(4,20,true);ch.setUint16(6,20,true);ch.setUint16(8,0x0800,true);ch.setUint16(12,dt,true);ch.setUint16(14,dd,true);ch.setUint32(16,crc,true);ch.setUint32(20,sz,true);ch.setUint32(24,sz,true);ch.setUint16(28,nm.length,true);ch.setUint32(42,off,true);
    cd.push(new Uint8Array(ch.buffer),nm);off+=30+nm.length+sz;
  }
  let cds=0;cd.forEach(p=>cds+=p.length);
  const end=new DataView(new ArrayBuffer(22));end.setUint32(0,0x06054b50,true);end.setUint16(8,files.length,true);end.setUint16(10,files.length,true);end.setUint32(12,cds,true);end.setUint32(16,off,true);
  return new Blob([...parts,...cd,new Uint8Array(end.buffer)],{type:'application/zip'});
}
async function exportZip(){
  const kind=$('ex-zipkind').value,files=[];
  toast('Préparation des 5 formats…');
  for(const k of Object.keys(FORMATS)){
    const cv=document.createElement('canvas');await renderTo(cv,k,exScale());
    let blob;
    if(kind==='jpg'){const o=document.createElement('canvas');o.width=cv.width;o.height=cv.height;const x=o.getContext('2d');x.fillStyle='#FFFFFF';x.fillRect(0,0,o.width,o.height);x.drawImage(cv,0,0);blob=await toBlob(o,'jpg',exQ())}
    else blob=await toBlob(cv,'png');
    if(blob)files.push({name:fileName(kind,k),data:new Uint8Array(await blob.arrayBuffer())});
  }
  schedule();
  if(!files.length){toast("Les images n'ont pas pu être générées.");return}
  await saveBlob(makeZip(files),`${slug(current.name)||'visuels'}-${v.tpl}-tous-formats.zip`,'Archive ZIP exportée.');
}
async function backupAll(){
  const data={app:'atelier-de-marque',version:3,brands:saved.map(stripBrand),styles:presets};
  await saveBlob(new Blob([JSON.stringify(data)],{type:'application/json'}),'atelier-de-marque-sauvegarde.json','Sauvegarde exportée.');
}
async function restoreAll(file){
  try{
    const d=JSON.parse(await file.text());let n=0;
    for(const b of (d.brands||[])){
      b.info=b.info||{};b.show=b.show||{};b.logoOpt=Object.assign(DEFOPT(),b.logoOpt||{});
      if(saved.some(s=>s.id===b.id))b.id=uid();
      await buildLogo(b);saved.push(b);n++;
    }
    for(const p of (d.styles||[]))if(p&&p.name&&!presets.some(q=>q.name===p.name)){presets.push(p)}
    await persist();await persistPresets();renderSaved();syncVisualUI();
    toast(`${n} marque(s) importée(s).`);
  }catch(e){toast("Ce fichier de sauvegarde n'est pas valide.")}
}

/* ---------- câblage ---------- */
function buildStatic(){
  $('b-pair').innerHTML=PAIRS.map((p,i)=>`<option value="${i}">${p.name}</option>`).join('');
  const po=POS.map(([k,l])=>`<option value="${k}">${l}</option>`).join('');$('b-pos').innerHTML=po;$('v-pos').innerHTML=po;
  $('b-icons').innerHTML=ICONSTYLES.map(([k,l])=>`<option value="${k}">${l}</option>`).join('');
  $('infos').innerHTML=FIELDS.map(([k,l,ph,type])=>`<div class="info"><div class="top"><label class="lbl" for="f-${k}">${l}</label><label class="check"><input type="checkbox" id="s-${k}"> Afficher</label></div><input id="f-${k}" type="${type==='tel'?'tel':type==='email'?'email':'text'}" maxlength="80" autocomplete="off" placeholder="${ph}"></div>`).join('');
  $('extra').innerHTML=EXTRA.map(([k,l,ph])=>`<div class="info"><div class="top"><label class="lbl" for="f-${k}">${l}</label></div><input id="f-${k}" type="text" maxlength="120" autocomplete="off" placeholder="${ph}"></div>`).join('');

  $('btn-new').addEventListener('click',newBrand);
  $('btn-save').addEventListener('click',saveBrand);
  $('logo-file').addEventListener('change',e=>{const f=e.target.files[0];if(f)setLogoFromFile(f);e.target.value=''});
  $('photo-file').addEventListener('change',e=>{const f=e.target.files[0];if(f)setPhotoFromFile(f);e.target.value=''});
  $('brand-name').addEventListener('input',e=>{current.name=e.target.value;document.querySelectorAll('.ch-name').forEach(n=>n.textContent=current.name)});
  const modes=['checker','dark','light'];
  $('logo-bg').addEventListener('click',()=>{const bx=$('logo-box');bx.dataset.bg=modes[(modes.indexOf(bx.dataset.bg)+1)%modes.length]});
  $('rm-on').addEventListener('change',e=>{current.logoOpt.rm=e.target.checked;$('rm-opts').hidden=!e.target.checked;if(e.target.checked&&current.bgGuess){current.logoOpt.bg=current.bgGuess;$('rm-color').value=current.bgGuess}queueRebuild()});
  $('rm-color').addEventListener('input',e=>{current.logoOpt.bg=e.target.value;queueRebuild()});
  $('rm-tol').addEventListener('input',e=>{current.logoOpt.tol=+e.target.value;queueRebuild()});
  $('rm-mode').addEventListener('change',e=>{current.logoOpt.mode=e.target.value;queueRebuild()});
  $('rm-detect').addEventListener('click',()=>{if(current.bgGuess){current.logoOpt.bg=current.bgGuess;$('rm-color').value=current.bgGuess;queueRebuild()}else toast("Aucune couleur de fond uniforme détectée. Utilisez la pipette.")});
  $('rm-pick').addEventListener('click',pickColor);

  FIELDS.forEach(([k])=>{
    $('f-'+k).addEventListener('input',e=>{
      const val=e.target.value;current.info[k]=val;
      if(val.trim()&&current.show[k]===undefined){current.show[k]=true;$('s-'+k).checked=true}
      renderShowGroup();schedule();
    });
    $('s-'+k).addEventListener('change',e=>{current.show[k]=e.target.checked;renderShowGroup();schedule()});
  });
  EXTRA.forEach(([k])=>$('f-'+k).addEventListener('input',e=>{current.info[k]=e.target.value;renderInsert()}));
  $('f-slogan').addEventListener('input',e=>{current.info.slogan=e.target.value;renderInsert()});

  [['bg','c-bg'],['text','c-text'],['accent','c-accent'],['second','c-second']].forEach(([k,id])=>{
    $(id).addEventListener('input',e=>{current.colors[k]=e.target.value;$('t-'+k).textContent=e.target.value.toUpperCase();if(k==='accent'&&!v.accent)$('v-accent').value=e.target.value;manualEdit()})});
  $('b-pair').addEventListener('change',e=>{current.pair=+e.target.value;manualEdit()});
  $('b-pos').addEventListener('change',e=>{current.logoPos=e.target.value;$('v-pos').value=e.target.value;manualEdit()});
  $('b-icons').addEventListener('change',e=>{current.iconStyle=e.target.value;manualEdit()});

  buildVisuel();
}
const BIND=[
  ['p-zoom','zoom','n'],['p-fx','fx','n'],['p-fy','fy','n'],['p-flip','flip','c'],
  ['p-bright','bright','n'],['p-contr','contr','n'],['p-sat','sat','n'],['p-blur','blur','n'],['p-radius','radius','n'],['p-vig','vig','n'],['p-duo','duo','s'],['p-wash','wash','n'],['p-washc','washColor','s'],
  ['p-ov','ov','s'],['p-ovc','ovColor','s'],['p-ova','ovAmount','n'],
  ['v-title','title','s'],['v-sub','sub','s'],['v-kicker','kicker','s'],['v-cta','cta','s'],['v-badge','badge','s'],['v-tags','tags','s'],
  ['t-font','tFont','s'],['t-bfont','bFont','s'],['t-upper','upper','s'],
  ['t-size','tSize','n'],['t-ssize','sSize','n'],['t-lh','lh','n'],['t-ls','ls','n'],['t-width','tWidth','n'],['t-bar','accentBar','c'],['t-hl','hl','c'],['t-effect','tEffect','s'],['t-box','tBox','s'],
  ['l-foot','footerPos','s'],['l-margin','margin','n'],
  ['v-scale','logoScale','n'],['v-plate','plate','s'],['l-shape','logoShape','s'],['l-tint','logoTint','s'],['l-op','logoOpacity','n'],['l-mm','logoMargin','n'],['l-rot','logoRot','n'],['l-rad','logoRad','n'],['l-gray','logoGray','c'],['v-shadow','shadow','c'],
  ['v-icons','icons','c']
];
const POS9=[['t','left','↖','Haut gauche'],['t','center','↑','Haut centre'],['t','right','↗','Haut droite'],['m','left','←','Milieu gauche'],['m','center','•','Centre'],['m','right','→','Milieu droite'],['b','left','↙','Bas gauche'],['b','center','↓','Bas centre'],['b','right','↘','Bas droite']];
function syncControls(){
  BIND.forEach(([id,k,t])=>{const el=$(id);if(!el)return;if(t==='c')el.checked=!!v[k];else el.value=v[k]});
  if(current){$('t-color').value=v.tColor||current.colors.text;$('v-pos').value=current.logoPos}
  document.querySelectorAll('#filters button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.k===v.filter)));
  document.querySelectorAll('#txtstyles button').forEach(b=>{const p=Object.assign({},TXT0,TXTSTYLES[b.dataset.k][1]);b.setAttribute('aria-pressed',String(Object.keys(p).every(k=>v[k]===p[k])))});
  document.querySelectorAll('#pos9 button').forEach(b=>b.setAttribute('aria-pressed',String(v.ty===b.dataset.ty&&v.align===b.dataset.al)));
  document.querySelectorAll('#tpl-gal button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.k===v.tpl)));
  document.querySelectorAll('#seg-format button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.k===v.fmt)));
  document.querySelectorAll('#drag-seg button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.k===v.drag)));
  $('filter-hint').hidden=CAN_FILTER;
  const cv=$('cv');if(cv)cv.style.cursor=v.drag==='photo'?'grab':'move';
}
function buildVisuel(){
  const opts=l=>l.map(([k,t])=>`<option value="${k}">${t}</option>`).join('');
  const fontOpts=()=>{let h='<option value="auto">Selon la charte</option>';const cats=[...new Set(FONTS.slice(1).map(f=>f[2]))];
    cats.forEach(c=>{h+=`<optgroup label="${c}">`+FONTS.slice(1).filter(f=>f[2]===c).map(f=>`<option value="${f[0]}" style="font-family:'${f[0]}'">${f[1]}</option>`).join('')+'</optgroup>'});return h};
  $('t-font').innerHTML=fontOpts();$('t-bfont').innerHTML=fontOpts();
  $('t-effect').innerHTML=opts(EFFECTS);$('t-box').innerHTML=opts(TBOXES);
  $('p-duo').innerHTML=Object.entries(DUOS).map(([k,d])=>`<option value="${k}">${d[0]}</option>`).join('');
  $('ctabs').innerHTML=TABS.map(([k,t])=>`<button type="button" data-k="${k}" aria-pressed="false">${t}</button>`).join('');
  $('seg-format').innerHTML=Object.entries(FORMATS).map(([k,f])=>`<button type="button" data-k="${k}" aria-pressed="false">${f.label}</button>`).join('');
  $('tpl-gal').innerHTML=Object.entries(TPLS).map(([k,t])=>`<button type="button" data-k="${k}" aria-pressed="false" aria-label="Modèle ${t.label}"><canvas width="10" height="10"></canvas><span>${t.label}</span></button>`).join('');
  $('filters').innerHTML=Object.entries(FILTERS).map(([k,f])=>`<button type="button" data-k="${k}" aria-pressed="false">${f[0]}</button>`).join('');
  $('txtstyles').innerHTML=Object.entries(TXTSTYLES).map(([k,s])=>`<button type="button" data-k="${k}" aria-pressed="false">${s[0]}</button>`).join('');
  $('pos9').innerHTML=POS9.map(([ty,al,sym,lab])=>`<button type="button" data-ty="${ty}" data-al="${al}" aria-label="${lab}" aria-pressed="false">${sym}</button>`).join('');
  $('v-title').value=v.title;$('v-sub').value=v.sub;

  BIND.forEach(([id,k,t])=>{const el=$(id);
    el.addEventListener(t==='c'||el.tagName==='SELECT'?'change':'input',()=>{v[k]=t==='n'?+el.value:t==='c'?el.checked:el.value;
      if(['plate','logoShape','logoTint','tFont','bFont','filter'].includes(k))syncControls();schedule()});
  });
  $('ctabs').addEventListener('click',e=>{const b=e.target.closest('button');if(b)setTab(b.dataset.k)});
  $('brand-switch').addEventListener('change',e=>{const b=saved.find(s=>s.id===e.target.value);if(b)useBrand(b)});
  $('seg-format').addEventListener('click',e=>{const b=e.target.closest('button');if(b)setFmt(b.dataset.k)});
  $('tpl-gal').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;v.tpl=b.dataset.k;syncStageInfo();syncControls();schedule()});
  $('filters').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;v.filter=b.dataset.k;syncControls();schedule()});
  $('txtstyles').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;Object.assign(v,TXT0,TXTSTYLES[b.dataset.k][1]);syncControls();schedule()});
  $('pos9').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;v.ty=b.dataset.ty;v.align=b.dataset.al;syncControls();schedule()});
  $('drag-seg').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;v.drag=b.dataset.k;syncControls()});
  $('ins-info').addEventListener('change',e=>{const k=e.target.value;if(!k)return;v.sub=k==='name'?current.name:(current.info[k]||'');$('v-sub').value=v.sub;e.target.value='';schedule()});
  $('v-pos').addEventListener('change',e=>{current.logoPos=e.target.value;v.logoFree=null;$('b-pos').value=e.target.value;current.charteIdx=-1;schedule()});
  $('v-accent').addEventListener('input',e=>{v.accent=e.target.value;schedule()});
  $('v-accent-reset').addEventListener('click',()=>{v.accent=null;$('v-accent').value=current.colors.accent;schedule()});
  $('t-color').addEventListener('input',e=>{v.tColor=e.target.value;schedule()});
  $('t-color-reset').addEventListener('click',()=>{v.tColor=null;syncControls();schedule()});
  $('l-text-reset').addEventListener('click',()=>{v.dx=0;v.dy=0;schedule()});
  $('l-logo-reset').addEventListener('click',()=>{v.logoFree=null;v.logoRot=0;syncControls();schedule()});
  $('l-reset').addEventListener('click',()=>{Object.assign(v,{align:'auto',ty:'auto',dx:0,dy:0,margin:1,footerPos:'auto',logoFree:null,tWidth:1});syncControls();schedule();toast('Disposition réinitialisée.')});
  $('ph-reset').addEventListener('click',()=>{Object.assign(v,{filter:'none',duo:'none',vig:0,wash:0,bright:0,contr:0,sat:0,blur:0,ov:'auto',ovColor:'brand',ovAmount:1,flip:false});syncControls();schedule()});
  $('presets').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const p=PRESETS[+b.dataset.i];applyStyle(p.s,false);toast('Style « '+p.name+' » appliqué.')});
  $('mypresets').addEventListener('click',e=>{
    const b=e.target.closest('button');if(!b)return;const i=+b.dataset.i;
    if(b.classList.contains('x')){const nm=presets[i].name;presets.splice(i,1);persistPresets();renderPresets();toast('Style « '+nm+' » supprimé.')}
    else{applyStyle(presets[i].s,true);toast('Style « '+presets[i].name+' » appliqué.')}});
  $('preset-save').addEventListener('click',async()=>{
    const nm=($('preset-name').value||'').trim()||('Style '+(presets.length+1));
    const s={};PKEYS.forEach(k=>{s[k]=v[k]});
    const i=presets.findIndex(p=>p.name===nm);if(i>=0)presets[i]={name:nm,s};else presets.push({name:nm,s});
    const ok=await persistPresets();renderPresets();$('preset-name').value='';
    toast(ok?'Style « '+nm+' » enregistré.':'Enregistrement impossible ici. Utilisez « Sauvegarder tout ».')});
  $('rand').addEventListener('click',()=>{
    const pick=a=>a[Math.floor(Math.random()*a.length)];
    const d=V0();RESET_KEYS.forEach(k=>{v[k]=d[k]});
    v.tpl=pick(Object.keys(TPLS));v.filter=pick(Object.keys(FILTERS));
    Object.assign(v,TXT0,pick(Object.values(TXTSTYLES))[1]);
    if(Math.random()<.3)v.duo=pick(['brand','warm','cool','mono','neon']);
    v.vig=pick([0,0,.25,.5]);v.align='auto';v.ty='auto';v.dx=0;v.dy=0;v.logoFree=null;
    syncStageInfo();syncControls();schedule();
  });
  $('ex-png').addEventListener('click',()=>exportImage('png'));
  $('ex-jpg').addEventListener('click',()=>exportImage('jpg'));
  $('ex-zip').addEventListener('click',exportZip);
  $('ex-show').addEventListener('click',showImage);
  $('bk-save').addEventListener('click',backupAll);
  $('bk-file').addEventListener('change',e=>{const f=e.target.files[0];if(f)restoreAll(f);e.target.value=''});
  $('ov-close').addEventListener('click',()=>{$('ov').hidden=true});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')$('ov').hidden=true});

  const cv=$('cv');let drag=null;
  cv.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY};try{cv.setPointerCapture(e.pointerId)}catch(_){}
    if(v.drag==='logo'){const rc=cv.getBoundingClientRect(),k=cv.width/rc.width;v.logoFree={x:clamp((e.clientX-rc.left)*k/cv.width,0,1),y:clamp((e.clientY-rc.top)*k/cv.height,0,1)};schedule()}});
  cv.addEventListener('pointermove',e=>{
    if(!drag)return;
    const rc=cv.getBoundingClientRect(),k=cv.width/rc.width,dx=(e.clientX-drag.x)*k,dy=(e.clientY-drag.y)*k;drag={x:e.clientX,y:e.clientY};
    if(v.drag==='photo'&&v.geom){
      const g=v.geom,sx=v.flip?-1:1;
      if(g.dw-g.rw>1){v.fx=clamp(v.fx-sx*dx/(g.dw-g.rw),0,1);$('p-fx').value=v.fx}
      if(g.dh-g.rh>1){v.fy=clamp(v.fy-dy/(g.dh-g.rh),0,1);$('p-fy').value=v.fy}
    }else if(v.drag==='logo'){
      v.logoFree={x:clamp((e.clientX-rc.left)*k/cv.width,0,1),y:clamp((e.clientY-rc.top)*k/cv.height,0,1)};
    }else if(v.drag==='text'){
      v.dx=clamp(v.dx+dx/cv.width,-1,1);v.dy=clamp(v.dy+dy/cv.height,-1,1);
    }
    schedule();
  });
  const end=()=>{drag=null};cv.addEventListener('pointerup',end);cv.addEventListener('pointercancel',end);
}

function route(){
  const name=location.hash==='#visuel'?'visuel':'marque';
  $('view-marque').hidden=name!=='marque';$('view-visuel').hidden=name!=='visuel';
  ['marque','visuel'].forEach(n=>{const t=$('tab-'+n);if(n===name)t.setAttribute('aria-current','page');else t.removeAttribute('aria-current')});
  if(name==='visuel'){syncVisualUI();setTab(activeTab);schedule()}
  window.scrollTo(0,0);
}
window.addEventListener('hashchange',route);

(async function init(){
  setPhoto(makeSamplePhoto().src);
  await loadSaved();
  if(saved.length){current=clone(saved[0]);current.isDemo=false;chartes=genChartes(current.palette)}else{await initDemo()}
  buildStatic();setPlateDefault();syncBrandUI();renderChartes();renderSaved();syncVisualUI();syncStageInfo();setTab('model');route();schedule();
  try{dl=(window.claude&&window.claude.use)?await window.claude.use('downloads'):null}catch(e){dl=null}
  window.__atelier={v,draw,TPLS,FORMATS,get current(){return current}};
})();
})();
