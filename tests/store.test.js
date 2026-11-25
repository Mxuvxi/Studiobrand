// Une marque illisible ne doit jamais être effacée par un enregistrement : node tests/store.test.js
const {chromium}=require('playwright'),path=require('path'),assert=require('assert');
(async()=>{const b=await chromium.launch(),ctx=await b.newContext(),p=await ctx.newPage(),url='file://'+path.join(__dirname,'..','src','atelier-de-marque.html');
 await p.goto(url);await p.waitForTimeout(600);
 await p.evaluate(()=>new Promise((res,rej)=>{const r=indexedDB.open('atelier-de-marque',1);r.onupgradeneeded=()=>r.result.createObjectStore('kv');
  r.onsuccess=()=>{const t=r.result.transaction('kv','readwrite');t.objectStore('kv').put([{id:'cassee',name:'Cassée',logoData:'pas-une-image'}],'brands');t.oncomplete=res;t.onerror=()=>rej(t.error)};r.onerror=()=>rej(r.error)}));
 await p.goto(url);await p.waitForTimeout(1500);
 const n=await p.evaluate(async()=>{const A=window.__atelier,s=A.store();await A.persist();
  return await new Promise(res=>{const r=indexedDB.open('atelier-de-marque',1);r.onsuccess=()=>{const q=r.result.transaction('kv').objectStore('kv').get('brands');q.onsuccess=()=>res({kept:s.kept.length,shown:s.saved.length,stored:q.result.map(x=>x.id)})}})});
 assert.deepStrictEqual(n,{kept:1,shown:0,stored:['cassee']});console.log('store OK');await b.close()})().catch(e=>{console.error('FAIL',e.message);process.exit(1)});
