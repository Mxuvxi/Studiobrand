// Vérifie le moteur de détourage : node tests/cut.test.js (après python3 src/build.py)
const {chromium}=require('playwright'),path=require('path'),assert=require('assert');
(async()=>{const b=await chromium.launch(),p=await b.newPage(),errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+path.join(__dirname,'..','src','atelier-de-marque.html'));await p.waitForTimeout(800);
 const r=await p.evaluate(()=>{const A=window.__atelier,o={};
  // 1. coupe de graphe sur 2 pixels : le pixel attaché à la source reste côté « personne »
  o.cut=Array.from(A.minCut(2,1,Float64Array.of(10,0),Float64Array.of(0,10),Float64Array.of(1,0),new Float64Array(2),new Float64Array(2),new Float64Array(2)));
  // 2. disque rouge sur fond gris bruité : environ 20 % de premier plan (π·30²/120² = 0,196)
  const w=120,h=120,d=new Uint8ClampedArray(w*h*4);
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=(y*w+x)*4,inn=(x-60)**2+(y-60)**2<900;d[i]=inn?200:90+(x*7+y*3)%10;d[i+1]=inn?40:100;d[i+2]=inn?40:110;d[i+3]=255}
  const m=A.autoMask(d,w,h,null,null,null);let c=0;for(const v of m)if(v>127)c++;o.disc=c/(w*h);
  // 3. un trait « Effacer » est respecté
  const bg=new Uint8Array(w*h);for(let y=55;y<65;y++)for(let x=55;x<65;x++)bg[y*w+x]=1;
  o.erased=A.autoMask(d,w,h,null,bg,null)[60*w+60];
  // 4. largestCC : ratio 1 garde la plus grande forme, ratio .3 garde aussi les formes ≥ 30 %
  const t=()=>{const l=new Uint8Array(20*4);for(let y=0;y<4;y++){for(let x=0;x<8;x++)l[y*20+x]=1;for(let x=12;x<16;x++)l[y*20+x]=1}return l};
  const a=t(),bb=t();A.largestCC(a,20,4);A.largestCC(bb,20,4,.3);o.k1=a.reduce((s,v)=>s+v,0);o.k3=bb.reduce((s,v)=>s+v,0);return o});
 assert.deepStrictEqual(r.cut,[1,0],'minCut');
 assert(r.disc>.17&&r.disc<.23,'disque: '+r.disc);
 assert.strictEqual(r.erased,0,'trait effacer');
 assert.strictEqual(r.k1,32);assert.strictEqual(r.k3,48);
 assert.deepStrictEqual(errs,[]);console.log('cut OK',r.disc.toFixed(3));await b.close()})().catch(e=>{console.error('FAIL',e.message);process.exit(1)});
