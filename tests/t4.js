const {chromium}=require('playwright');
(async()=>{
 const tpls=process.argv[2].split(','),fmts=(process.argv[3]||'affiche').split(','),tag=process.argv[4]||'t4';
 const br=await chromium.launch();const ctx=await br.newContext({viewport:{width:1400,height:1000},offline:true});const pg=await ctx.newPage();
 const errs=[];pg.on('pageerror',e=>errs.push('PAGE '+e.message));pg.on('console',m=>{if(m.type()==='error')errs.push('CON '+m.text())});
 await pg.goto('file://'+__dirname+'/../src/atelier-de-marque.html#visuel');await pg.waitForTimeout(2500);
 await pg.evaluate(()=>{const v=window.__atelier.v;v.title='Lancement *officiel* de notre entreprise';v.sub='Mutuelle d\'épargne et de crédit pour le développement'});
 const out=await pg.evaluate(async([tpls0,fmts])=>{const A=window.__atelier,res=[];
   for(const f of fmts){const tpls=tpls0[0]==='ALL'?Object.keys(A.TPLS).filter(k=>!A.TPLS[k].fmts||A.TPLS[k].fmts.includes(f)):tpls0;for(const t of tpls){const F=A.FORMATS[f];A.v.fmt=f;const cv=document.createElement('canvas');cv.width=F.w;cv.height=F.h;
     try{A.draw(cv.getContext('2d'),F.w,F.h,{tpl:t});const s=document.createElement('canvas');const k=520/F.w;s.width=520;s.height=Math.round(F.h*k);s.getContext('2d').drawImage(cv,0,0,s.width,s.height);res.push({f,t,d:s.toDataURL('image/jpeg',.82)})}catch(e){res.push({f,t,err:e.message+' '+(e.stack||'').split('\n')[1]})}}}
   return res},[tpls,fmts]);
 const fs=require('fs');out.forEach((o,i)=>{if(o.err)console.log('ERR',o.f,o.t,o.err);else fs.writeFileSync(`${tag}_${o.f}_${o.t}.jpg`,Buffer.from(o.d.split(',')[1],'base64'))});
 console.log('errors',errs);await br.close();
})();
