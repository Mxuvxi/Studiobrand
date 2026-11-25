const {chromium}=require('playwright');
(async()=>{
 const br=await chromium.launch();const ctx=await br.newContext({viewport:{width:430,height:900},offline:true});const pg=await ctx.newPage();
 const errs=[];pg.on('pageerror',e=>errs.push('PAGE '+e.message));pg.on('console',m=>{if(m.type()==='error')errs.push('CON '+m.text())});
 await pg.goto('file://'+__dirname+'/../src/atelier-de-marque.html#visuel');await pg.waitForTimeout(2000);
 const H=async()=>{await pg.waitForTimeout(350);return pg.evaluate(()=>{const c=document.getElementById('cv'),x=c.getContext('2d'),d=x.getImageData(0,0,c.width,c.height).data;let h=0;for(let i=0;i<d.length;i+=11)h=(h*31+d[i])|0;return h})};
 const log=(n,a,b)=>console.log((a!==b?'OK  ':'FAIL')+' '+n);
 const tab=async k=>{await pg.click(`#ctabs button[data-k="${k}"]`);await pg.waitForTimeout(150)};
 // 1 choisir un modèle (galerie), puis modifier
 await tab('model');
 for(const tpl of ['affiche','webinaire','evenement','libre']){
  await pg.evaluate(t=>{const b=document.querySelector(`#tpl-gal button[data-k="${t}"]`);b&&b.click()},tpl);
  let h0=await H();
  await tab('text');await pg.fill('#v-title','Titre modifié '+tpl+Math.random());let h1=await H();log(tpl+' titre',h0,h1);
  await tab('logo');await pg.evaluate(()=>{const e=document.getElementById('v-scale');e.value=(1+Math.random()).toFixed(2);e.dispatchEvent(new Event('input',{bubbles:true}))});let h2=await H();log(tpl+' taille logo',h1,h2);
  await tab('elements');
  await pg.click('#el-list .el[data-id="title"] .el-n');
  await pg.evaluate(()=>{const e=document.getElementById('el-y');e.value=.15;e.dispatchEvent(new Event('input',{bubbles:true}))});let h3=await H();log(tpl+' déplacer titre',h2,h3);
  await pg.evaluate(()=>{const e=document.getElementById('el-s');e.value=.6;e.dispatchEvent(new Event('input',{bubbles:true}))});let h4=await H();log(tpl+' taille titre',h3,h4);
  await pg.click('#el-eye2');let h5=await H();log(tpl+' masquer titre',h4,h5);
  await pg.click('#el-eye2');
  await pg.click('#el-list .el[data-id="logo"] .el-eye');let h6=await H();log(tpl+' masquer logo',h5,h6);
  await pg.click('#el-list .el[data-id="logo"] .el-eye');
  for(const m of ['col','row','icons']){const a=await H();await pg.selectOption('#f-mode',m);const b=await H();log(tpl+' contacts '+m,a,b)}
  await pg.selectOption('#f-mode','auto');
  const a=await H();await pg.evaluate(()=>{const e=document.getElementById('f-size');e.value=.5;e.dispatchEvent(new Event('input',{bubbles:true}))});log(tpl+' taille contacts',a,await H());
  await pg.evaluate(()=>{const e=document.getElementById('f-size');e.value=1;e.dispatchEvent(new Event('input',{bubbles:true}))});
  await pg.click('#el-reset');
 }
 // glisser un élément sur l'aperçu
 await pg.click('#drag-seg button[data-k="el"]');await pg.waitForTimeout(300);
 const hit=await pg.evaluate(()=>{const v=__atelier.v;const t=v.hits.find(h=>h.id==='title')||v.hits[0];const c=document.getElementById('cv'),r=c.getBoundingClientRect(),k=r.width/c.width;return{id:t.id,x:r.left+(t.x+t.w/2)*k,y:r.top+(t.y+t.h/2)*k}});
 const b0=await H();
 await pg.mouse.move(hit.x,hit.y);await pg.mouse.down();await pg.mouse.move(hit.x+10,hit.y+25,{steps:5});await pg.mouse.up();
 console.log('glisser',hit.id,(await H())!==b0?'OK':'FAIL', await pg.evaluate(()=>__atelier.v.sel));
 console.log('errors',errs);await br.close();
})();
