const {chromium}=require('playwright');
(async()=>{
 const br=await chromium.launch();const ctx=await br.newContext({viewport:{width:430,height:900},offline:true});const pg=await ctx.newPage();
 const errs=[];pg.on('pageerror',e=>errs.push('PAGE '+e.message));pg.on('console',m=>{if(m.type()==='error')errs.push('CON '+m.text())});
 await pg.goto('file://'+__dirname+'/../src/atelier-de-marque.html#visuel');await pg.waitForTimeout(2000);
 // test file: sample person on a noisy beige background
 const data=await pg.evaluate(()=>{const c=document.createElement('canvas');c.width=900;c.height=1200;const x=c.getContext('2d');
  const g=x.createLinearGradient(0,0,900,1200);g.addColorStop(0,'#c9b8a0');g.addColorStop(1,'#9fb4c8');x.fillStyle=g;x.fillRect(0,0,900,1200);
  for(let i=0;i<400;i++){x.fillStyle=`rgba(${100+Math.random()*100|0},${100+Math.random()*100|0},120,.15)`;x.fillRect(Math.random()*900,Math.random()*1200,40,40)}
  x.drawImage(__atelier.sampleCut(1),150,250,600,800);return c.toDataURL('image/jpeg',.9)});
 require('fs').writeFileSync('tp.jpg',Buffer.from(data.split(',')[1],'base64'));
 await pg.setInputFiles('#photo-file','tp.jpg');await pg.waitForTimeout(800);
 await pg.click('#ctabs button:nth-child(3)').catch(()=>{});
 await pg.evaluate(()=>__atelier.cutOpen(0));await pg.waitForTimeout(1500);
 await pg.screenshot({path:'cut1.png'});
 await pg.evaluate(()=>__atelier.cutFinish());await pg.waitForTimeout(800);
 const info=await pg.evaluate(()=>({cut:!!__atelier.v.cut,slots:document.querySelectorAll('.slot').length}));
 console.log(info);
 // add 2 extra photos, render soleil + trio
 {const [fc]=await Promise.all([pg.waitForEvent('filechooser'),pg.evaluate(()=>document.querySelector('[data-a=add]').click())]);await fc.setFiles(['tp.jpg','tp.jpg']);await pg.waitForTimeout(1500)}
 console.log(await pg.evaluate(()=>__atelier.v.extra.length));
 const png=await pg.evaluate(()=>{const A=__atelier,FORMATS=A.FORMATS,draw=A.draw,F=FORMATS.portrait;A.v.fmt='portrait';const cv=document.createElement('canvas');cv.width=F.w;cv.height=F.h;draw(cv.getContext('2d'),F.w,F.h,{tpl:'trio_cut'});const s=document.createElement('canvas');s.width=500;s.height=Math.round(F.h*500/F.w);s.getContext('2d').drawImage(cv,0,0,s.width,s.height);return s.toDataURL('image/jpeg',.85)});
 require('fs').writeFileSync('cut2.jpg',Buffer.from(png.split(',')[1],'base64'));
 console.log('errors',errs);await br.close();
})();
