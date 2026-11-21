
/* ================= photos multiples et détourage ================= */
v.extra=[];v.cut=null;v.sampleMain=true;
const MAXX=3;
const _sc={};
function sampleCut(i){
  i=i%4;if(_sc[i])return _sc[i];
  const c=document.createElement('canvas');c.width=600;c.height=800;const x=c.getContext('2d');
  const skin=['#8A5A3C','#C58B5C','#6B4430','#A66E4B'][i],cloth=['#F4F1EA','#2F4B7C','#E07A2D','#7A3E8C'][i],hair='#1B1410';
  x.fillStyle=cloth;x.beginPath();x.moveTo(30,800);x.quadraticCurveTo(50,520,200,478);x.lineTo(400,478);x.quadraticCurveTo(550,520,570,800);x.closePath();x.fill();
  x.fillStyle='rgba(0,0,0,.12)';x.beginPath();x.moveTo(30,800);x.quadraticCurveTo(50,560,150,520);x.lineTo(170,800);x.fill();
  x.fillStyle=skin;x.fillRect(255,400,90,100);x.beginPath();x.moveTo(230,478);x.quadraticCurveTo(300,560,370,478);x.lineTo(345,440);x.lineTo(255,440);x.fill();
  x.beginPath();x.ellipse(300,300,102,122,0,0,7);x.fill();
  x.fillStyle=hair;x.beginPath();x.ellipse(300,238,116,100,0,Math.PI,0);x.fill();x.fillRect(184,236,24,70);x.fillRect(392,236,24,70);
  x.fillStyle='rgba(0,0,0,.28)';x.beginPath();x.ellipse(262,312,9,5,0,0,7);x.ellipse(338,312,9,5,0,0,7);x.fill();
  x.strokeStyle='rgba(0,0,0,.3)';x.lineWidth=6;x.lineCap='round';x.beginPath();x.moveTo(266,372);x.quadraticCurveTo(300,392,334,372);x.stroke();
  return _sc[i]=c;
}
function slotPhoto(i,thumb){if(i===0)return thumb&&v.photoSm?v.photoSm:v.photo;const a=v.extra[i-1];return a?(thumb&&a.photoSm?a.photoSm:a.photo):null}
function slotCut(i){
  if(i===0)return v.cut||(v.sampleMain?sampleCut(0):null);
  const a=v.extra[i-1];if(a)return a.cut||null;
  return v.sampleMain?sampleCut(i):null;
}
function trimAlpha(c,thr){
  const w=c.width,h=c.height,d=c.getContext('2d',{willReadFrequently:true}).getImageData(0,0,w,h).data;
  let x0=w,y0=h,x1=-1,y1=-1;thr=thr||10;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(d[(y*w+x)*4+3]>thr){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y}
  if(x1<0)return null;
  const o=document.createElement('canvas');o.width=x1-x0+1;o.height=y1-y0+1;o.getContext('2d').drawImage(c,x0,y0,o.width,o.height,0,0,o.width,o.height);return o;
}
/* ---------- segmentation légère (histogrammes de couleur + traits) ---------- */
function workCanvas(src,maxS){
  const r=Math.min(1,maxS/Math.max(src.width,src.height)),c=document.createElement('canvas');
  c.width=Math.max(8,Math.round(src.width*r));c.height=Math.max(8,Math.round(src.height*r));
  c.getContext('2d',{willReadFrequently:true}).drawImage(src,0,0,c.width,c.height);return c;
}
function boxBlurF(a,w,h,r){
  const t=new Float32Array(a.length),o=new Float32Array(a.length),n=2*r+1;
  for(let y=0;y<h;y++){let s=0;const row=y*w;for(let x=-r;x<=r;x++)s+=a[row+Math.min(w-1,Math.max(0,x))];
    for(let x=0;x<w;x++){t[row+x]=s/n;s+=a[row+Math.min(w-1,x+r+1)]-a[row+Math.max(0,x-r)]}}
  for(let x=0;x<w;x++){let s=0;for(let y=-r;y<=r;y++)s+=t[Math.min(h-1,Math.max(0,y))*w+x];
    for(let y=0;y<h;y++){o[y*w+x]=s/n;s+=t[Math.min(h-1,y+r+1)*w+x]-t[Math.max(0,y-r)*w+x]}}
  return o;
}
function largestCC(lab,w,h){
  const N=w*h,id=new Int32Array(N),st=new Int32Array(N);let best=0,bestId=0,cur=0;
  for(let s=0;s<N;s++){if(lab[s]!==1||id[s])continue;cur++;let sp=0,cnt=0;st[sp++]=s;id[s]=cur;
    while(sp){const p=st[--sp];cnt++;const x=p%w,y=(p/w)|0;
      if(x>0&&lab[p-1]===1&&!id[p-1]){id[p-1]=cur;st[sp++]=p-1}
      if(x<w-1&&lab[p+1]===1&&!id[p+1]){id[p+1]=cur;st[sp++]=p+1}
      if(y>0&&lab[p-w]===1&&!id[p-w]){id[p-w]=cur;st[sp++]=p-w}
      if(y<h-1&&lab[p+w]===1&&!id[p+w]){id[p+w]=cur;st[sp++]=p+w}}
    if(cnt>best){best=cnt;bestId=cur}}
  for(let i=0;i<N;i++)lab[i]=id[i]===bestId?1:0;
}
function fillHoles(lab,w,h,bg){
  const N=w*h,seen=new Uint8Array(N),st=new Int32Array(N);let sp=0;
  const push=p=>{if(!seen[p]&&lab[p]===0){seen[p]=1;st[sp++]=p}};
  for(let x=0;x<w;x++){push(x);push((h-1)*w+x)}for(let y=0;y<h;y++){push(y*w);push(y*w+w-1)}
  while(sp){const p=st[--sp],x=p%w,y=(p/w)|0;if(x>0)push(p-1);if(x<w-1)push(p+1);if(y>0)push(p-w);if(y<h-1)push(p+w)}
  for(let i=0;i<N;i++)if(lab[i]===0&&!seen[i]&&!(bg&&bg[i]))lab[i]=1;
}

/* ---------- GrabCut : modèles de couleur (mélanges gaussiens) + coupe de graphe, puis ajustement des bords ---------- */
function gcPrep(d,w,h,fg,bg,G){
  const s=Math.min(1,G/Math.max(w,h)),gw=Math.max(8,Math.round(w*s)),gh=Math.max(8,Math.round(h*s)),rgb=new Float32Array(gw*gh*3),F=new Uint8Array(gw*gh),B=new Uint8Array(gw*gh);
  for(let y=0;y<gh;y++){const y0=Math.floor(y*h/gh),y1=Math.max(y0+1,Math.floor((y+1)*h/gh));
    for(let x=0;x<gw;x++){const x0=Math.floor(x*w/gw),x1=Math.max(x0+1,Math.floor((x+1)*w/gw));let r=0,g=0,b=0,n=0,f=0,k=0;
      for(let yy=y0;yy<y1;yy++)for(let xx=x0;xx<x1;xx++){const i=yy*w+xx;r+=d[i*4];g+=d[i*4+1];b+=d[i*4+2];n++;if(fg&&fg[i])f=1;if(bg&&bg[i])k=1}
      const o=y*gw+x;rgb[o*3]=r/n;rgb[o*3+1]=g/n;rgb[o*3+2]=b/n;B[o]=k;F[o]=f&&!k?1:0}}
  return{gw,gh,rgb,F,B};
}
function gmmParams(rgb,idx,n,asg,K){
  const A=Array.from({length:K},()=>({n:0,m:[0,0,0],c:[0,0,0,0,0,0]}));
  for(let j=0;j<n;j++){const p=idx[j],a=A[asg[j]],r=rgb[p*3],g=rgb[p*3+1],b=rgb[p*3+2];a.n++;a.m[0]+=r;a.m[1]+=g;a.m[2]+=b;a.c[0]+=r*r;a.c[1]+=g*g;a.c[2]+=b*b;a.c[3]+=r*g;a.c[4]+=r*b;a.c[5]+=g*b}
  const out=[];
  for(const a of A){if(a.n<2)continue;const m=a.m.map(x=>x/a.n),c=[a.c[0]/a.n-m[0]*m[0]+9,a.c[1]/a.n-m[1]*m[1]+9,a.c[2]/a.n-m[2]*m[2]+9,a.c[3]/a.n-m[0]*m[1],a.c[4]/a.n-m[0]*m[2],a.c[5]/a.n-m[1]*m[2]];
    const det=c[0]*(c[1]*c[2]-c[5]*c[5])-c[3]*(c[3]*c[2]-c[5]*c[4])+c[4]*(c[3]*c[5]-c[1]*c[4]);if(!(det>1e-6))continue;
    const i=[(c[1]*c[2]-c[5]*c[5])/det,(c[0]*c[2]-c[4]*c[4])/det,(c[0]*c[1]-c[3]*c[3])/det,(c[4]*c[5]-c[3]*c[2])/det,(c[3]*c[5]-c[4]*c[1])/det,(c[3]*c[4]-c[0]*c[5])/det];
    out.push({m,i,k:-Math.log(a.n/n)+.5*Math.log(det)})}
  return out;
}
function gmmD(g,r,gg,b){let best=1e18;for(const c of g){const dr=r-c.m[0],dg=gg-c.m[1],db=b-c.m[2],q=c.i[0]*dr*dr+c.i[1]*dg*dg+c.i[2]*db*db+2*(c.i[3]*dr*dg+c.i[4]*dr*db+c.i[5]*dg*db),v=c.k+.5*q;if(v<best)best=v}return best}
function gmmFit(rgb,idx,n,K){
  K=Math.min(K,Math.max(1,n>>5));const L=i=>rgb[i*3]*.3+rgb[i*3+1]*.59+rgb[i*3+2]*.11,so=Array.from(idx.subarray(0,n)).sort((a,b)=>L(a)-L(b)),mu=[];
  for(let k=0;k<K;k++){const p=so[Math.floor((k+.5)*n/K)];mu.push([rgb[p*3],rgb[p*3+1],rgb[p*3+2]])}
  const asg=new Uint8Array(n);
  for(let it=0;it<7;it++){const sm=mu.map(()=>[0,0,0,0]);
    for(let j=0;j<n;j++){const p=idx[j];let bk=0,bd=1e18;for(let k=0;k<K;k++){const dr=rgb[p*3]-mu[k][0],dg=rgb[p*3+1]-mu[k][1],db=rgb[p*3+2]-mu[k][2],dd=dr*dr+dg*dg+db*db;if(dd<bd){bd=dd;bk=k}}
      asg[j]=bk;const q=sm[bk];q[0]+=rgb[p*3];q[1]+=rgb[p*3+1];q[2]+=rgb[p*3+2];q[3]++}
    for(let k=0;k<K;k++)if(sm[k][3])mu[k]=[sm[k][0]/sm[k][3],sm[k][1]/sm[k][3],sm[k][2]/sm[k][3]]}
  return gmmParams(rgb,idx,n,asg,K);
}
function gmmRefit(g,rgb,idx,n){const asg=new Uint8Array(n);
  for(let j=0;j<n;j++){const p=idx[j];let bk=0,bv=1e18;for(let k=0;k<g.length;k++){const c=g[k],dr=rgb[p*3]-c.m[0],dg=rgb[p*3+1]-c.m[1],db=rgb[p*3+2]-c.m[2],v=c.k+.5*(c.i[0]*dr*dr+c.i[1]*dg*dg+c.i[2]*db*db+2*(c.i[3]*dr*dg+c.i[4]*dr*db+c.i[5]*dg*db));if(v<bv){bv=v;bk=k}}asg[j]=bk}
  return gmmParams(rgb,idx,n,asg,g.length)||g;
}
/* flot maximal (Dinic) sur le graphe de la grille ; retourne 1 pour les pixels du côté « personne » */
function minCut(gw,gh,capS,capT,wR,wD,wDR,wDL){
  const N=gw*gh,S=N,T=N+1,M=N*10+4,to=new Int32Array(M),nx=new Int32Array(M),cap=new Float64Array(M),hd=new Int32Array(N+2).fill(-1);let ec=0;
  const add=(u,v,c1,c2)=>{to[ec]=v;cap[ec]=c1;nx[ec]=hd[u];hd[u]=ec++;to[ec]=u;cap[ec]=c2;nx[ec]=hd[v];hd[v]=ec++};
  for(let y=0,p=0;y<gh;y++)for(let x=0;x<gw;x++,p++){
    const m=Math.min(capS[p],capT[p]),a=capS[p]-m,b=capT[p]-m;if(a>0)add(S,p,a,0);else if(b>0)add(p,T,b,0);
    if(x<gw-1)add(p,p+1,wR[p],wR[p]);if(y<gh-1){add(p,p+gw,wD[p],wD[p]);if(x<gw-1)add(p,p+gw+1,wDR[p],wDR[p]);if(x>0)add(p,p+gw-1,wDL[p],wDL[p])}}
  const lv=new Int32Array(N+2),q=new Int32Array(N+2),it=new Int32Array(N+2),pe=new Int32Array(N+2),EPS=1e-9;
  const bfs=()=>{lv.fill(-1);lv[S]=0;let h=0,t=0;q[t++]=S;while(h<t){const u=q[h++];for(let e=hd[u];e!==-1;e=nx[e]){const v=to[e];if(cap[e]>EPS&&lv[v]<0){lv[v]=lv[u]+1;q[t++]=v}}}return lv[T]>=0};
  while(bfs()){
    it.set(hd);let u=S,dp=0;
    for(;;){
      if(u===T){let f=1e30;for(let i=0;i<dp;i++)if(cap[pe[i]]<f)f=cap[pe[i]];let first=-1;
        for(let i=0;i<dp;i++){cap[pe[i]]-=f;cap[pe[i]^1]+=f;if(first<0&&cap[pe[i]]<=EPS)first=i}
        dp=first;u=to[pe[dp]^1];continue}
      let e=it[u];for(;e!==-1;e=nx[e]){if(cap[e]>EPS&&lv[to[e]]===lv[u]+1)break}it[u]=e;
      if(e===-1){if(u===S)break;lv[u]=-1;dp--;u=to[pe[dp]^1]}else{pe[dp++]=e;u=to[e]}
    }
  }
  bfs();const out=new Uint8Array(N);for(let i=0;i<N;i++)out[i]=lv[i]>=0?1:0;return out;
}
function grabCut(d,w,h,fg,bg,rect){
  const{gw,gh,rgb,F,B}=gcPrep(d,w,h,fg,bg,190),N=gw*gh,BIG=1e9,lab=new Uint8Array(N).fill(1);/* 0 fond sûr, 1 fond probable, 2 personne probable, 3 personne sûre */
  const R=rect?{x0:Math.max(0,Math.floor(rect.x0*gw/w)),y0:Math.max(0,Math.floor(rect.y0*gh/h)),x1:Math.min(gw-1,Math.ceil(rect.x1*gw/w)),y1:Math.min(gh-1,Math.ceil(rect.y1*gh/h))}:null;
  const inR=(x,y)=>R?x>=R.x0&&x<=R.x1&&y>=R.y0&&y<=R.y1:true;
  /* échantillons de fond : cadre extérieur (sans le bas de l'image, souvent coupé sur la personne) */
  const bx=Math.max(2,Math.round(gw*.05)),by=Math.max(2,Math.round(gh*.05)),bgIdx=[];
  for(let y=0,p=0;y<gh;y++)for(let x=0;x<gw;x++,p++){
    const edge=R?!inR(x,y):(y<by||((x<bx||x>=gw-bx)&&y<gh*.7));if(edge||B[p]){lab[p]=0;bgIdx.push(p)}}
  if(bgIdx.length<30){for(let p=0;p<N;p++)if(p<gw*3||p%gw<3||p%gw>gw-4)bgIdx.push(p)}
  const bgI=Int32Array.from(bgIdx),g0=gmmFit(rgb,bgI,bgI.length,5);
  /* amorces de la personne : pixels centraux peu semblables au fond + zones de peau */
  const cand=[],Db=new Float32Array(N);
  for(let y=0,p=0;y<gh;y++)for(let x=0;x<gw;x++,p++){
    if(lab[p]===0&&!(F[p]))continue;
    const inside=R?true:(((x-gw*.5)/(gw*.46))**2+((y-gh*.5)/(gh*.5))**2<1);
    if(inside){Db[p]=gmmD(g0,rgb[p*3],rgb[p*3+1],rgb[p*3+2]);cand.push(p)}}
  const ds=cand.map(p=>Db[p]).sort((a,b)=>a-b),thr=ds.length?ds[Math.floor(ds.length*.45)]:0;
  let seeds=0;
  for(let y=0,p=0;y<gh;y++)for(let x=0;x<gw;x++,p++){
    if(lab[p]===0){continue}
    const r=rgb[p*3],g=rgb[p*3+1],b=rgb[p*3+2],cb=128-.168736*r-.331264*g+.5*b,cr=128+.5*r-.418688*g-.081312*b,skin=cb>77&&cb<127&&cr>133&&cr<173&&r>60;
    const inside=R?true:(((x-gw*.5)/(gw*.46))**2+((y-gh*.5)/(gh*.5))**2<1);
    lab[p]=(inside&&(Db[p]>=thr||skin))?(seeds++,2):1}
  if(seeds<N*.02)for(let y=0,p=0;y<gh;y++)for(let x=0;x<gw;x++,p++)if(lab[p]===1&&((x-gw*.5)/(gw*.3))**2+((y-gh*.5)/(gh*.4))**2<1)lab[p]=2;
  for(let p=0;p<N;p++)if(F[p])lab[p]=3;
  /* diagonales : poids selon le contraste local */
  let sum=0,cnt=0;const dif=(a,b)=>{const r=rgb[a*3]-rgb[b*3],g=rgb[a*3+1]-rgb[b*3+1],q=rgb[a*3+2]-rgb[b*3+2];return r*r+g*g+q*q};
  for(let y=0,p=0;y<gh;y++)for(let x=0;x<gw;x++,p++){if(x<gw-1){sum+=dif(p,p+1);cnt++}if(y<gh-1){sum+=dif(p,p+gw);cnt++;if(x<gw-1){sum+=dif(p,p+gw+1);cnt++}if(x>0){sum+=dif(p,p+gw-1);cnt++}}}
  const beta=1/(2*sum/Math.max(1,cnt)+1e-6),gam=50,wR=new Float64Array(N),wD=new Float64Array(N),wDR=new Float64Array(N),wDL=new Float64Array(N),k2=1/Math.SQRT2;
  for(let y=0,p=0;y<gh;y++)for(let x=0;x<gw;x++,p++){
    if(x<gw-1)wR[p]=gam*Math.exp(-beta*dif(p,p+1));
    if(y<gh-1){wD[p]=gam*Math.exp(-beta*dif(p,p+gw));if(x<gw-1)wDR[p]=gam*k2*Math.exp(-beta*dif(p,p+gw+1));if(x>0)wDL[p]=gam*k2*Math.exp(-beta*dif(p,p+gw-1))}}
  let gF=null,gB=null,fgI=new Int32Array(N),bgJ=new Int32Array(N);
  for(let iter=0;iter<4;iter++){
    let nf=0,nb=0;for(let p=0;p<N;p++){if(lab[p]>=2)fgI[nf++]=p;else bgJ[nb++]=p}
    if(nf<20||nb<20)break;
    gF=gF?gmmRefit(gF,rgb,fgI,nf):gmmFit(rgb,fgI,nf,5);gB=gB?gmmRefit(gB,rgb,bgJ,nb):gmmFit(rgb,bgJ,nb,5);
    const cS=new Float64Array(N),cT=new Float64Array(N);
    for(let p=0;p<N;p++){
      if(lab[p]===3){cS[p]=BIG;cT[p]=0}else if(lab[p]===0){cS[p]=0;cT[p]=BIG}
      else{const r=rgb[p*3],g=rgb[p*3+1],b=rgb[p*3+2];cS[p]=gmmD(gB,r,g,b);cT[p]=gmmD(gF,r,g,b)}}
    const cut=minCut(gw,gh,cS,cT,wR,wD,wDR,wDL);let ch=0;
    for(let p=0;p<N;p++){if(lab[p]===0||lab[p]===3)continue;const l=cut[p]?2:1;if(l!==lab[p]){lab[p]=l;ch++}}
    if(iter>0&&ch<N*.001)break;
  }
  const m=new Uint8Array(N);for(let p=0;p<N;p++)m[p]=lab[p]>=2?1:0;
  /* on garde la forme principale (et les formes presque aussi grandes), on bouche les trous */
  keepMain(m,gw,gh,B);fillHoles(m,gw,gh,B);
  return{m,gw,gh};
}
function keepMain(lab,w,h,bg){
  const N=w*h,id=new Int32Array(N),st=new Int32Array(N),sz=[0];let cur=0;
  for(let s=0;s<N;s++){if(lab[s]!==1||id[s])continue;cur++;let sp=0,c=0;st[sp++]=s;id[s]=cur;
    while(sp){const p=st[--sp];c++;const x=p%w,y=(p/w)|0;
      if(x>0&&lab[p-1]===1&&!id[p-1]){id[p-1]=cur;st[sp++]=p-1}if(x<w-1&&lab[p+1]===1&&!id[p+1]){id[p+1]=cur;st[sp++]=p+1}
      if(y>0&&lab[p-w]===1&&!id[p-w]){id[p-w]=cur;st[sp++]=p-w}if(y<h-1&&lab[p+w]===1&&!id[p+w]){id[p+w]=cur;st[sp++]=p+w}}
    sz.push(c)}
  const mx=Math.max(...sz);for(let i=0;i<N;i++)lab[i]=id[i]&&sz[id[i]]>=mx*.3?1:0;
}
/* filtre guidé : colle le bord du masque aux contours réels de la photo */
function guidedAlpha(p,I,w,h,r,eps){
  const N=w*h,out=new Float32Array(N);
  for(let c=0;c<3;c++){
    const g=new Float32Array(N);for(let i=0;i<N;i++)g[i]=I[i*4+c]/255;
    const mI=boxBlurF(g,w,h,r),mp=boxBlurF(p,w,h,r),gp=new Float32Array(N),gg=new Float32Array(N);
    for(let i=0;i<N;i++){gp[i]=g[i]*p[i];gg[i]=g[i]*g[i]}
    const mIp=boxBlurF(gp,w,h,r),mII=boxBlurF(gg,w,h,r),a=new Float32Array(N),b=new Float32Array(N);
    for(let i=0;i<N;i++){const va=mII[i]-mI[i]*mI[i];a[i]=(mIp[i]-mI[i]*mp[i])/(va+eps);b[i]=mp[i]-a[i]*mI[i]}
    const ma=boxBlurF(a,w,h,r),mb=boxBlurF(b,w,h,r);for(let i=0;i<N;i++)out[i]+=(ma[i]*g[i]+mb[i])/3;
  }
  return out;
}
function sharpen(a){const t=(a-.25)/.5;return t<=0?0:t>=1?1:t*t*(3-2*t)}
function upMask(m,gw,gh,w,h){const o=new Float32Array(w*h);
  for(let y=0;y<h;y++){const fy=Math.min(gh-1,Math.max(0,(y+.5)*gh/h-.5)),y0=Math.floor(fy),y1=Math.min(gh-1,y0+1),ty=fy-y0;
    for(let x=0;x<w;x++){const fx=Math.min(gw-1,Math.max(0,(x+.5)*gw/w-.5)),x0=Math.floor(fx),x1=Math.min(gw-1,x0+1),tx=fx-x0;
      o[y*w+x]=(m[y0*gw+x0]*(1-tx)+m[y0*gw+x1]*tx)*(1-ty)+(m[y1*gw+x0]*(1-tx)+m[y1*gw+x1]*tx)*ty}}
  return o;
}
function autoMask(d,w,h,fg,bg,rect){
  const r=grabCut(d,w,h,fg,bg,rect),up=upMask(r.m,r.gw,r.gh,w,h),al=guidedAlpha(up,d,w,h,Math.max(3,Math.round(w*.012)),.0006),out=new Uint8Array(w*h);
  for(let i=0;i<out.length;i++)out[i]=Math.round(255*sharpen(al[i]));
  if(fg)for(let i=0;i<out.length;i++){if(fg[i])out[i]=255}if(bg)for(let i=0;i<out.length;i++){if(bg[i])out[i]=0}
  return out;
}
function floodBg(d,w,h,tol){
  const N=w*h,rs=[],gs=[],bs=[];
  const sample=i=>{rs.push(d[i*4]);gs.push(d[i*4+1]);bs.push(d[i*4+2])};
  for(let x=0;x<w;x++){sample(x);sample((h-1)*w+x)}for(let y=0;y<h;y++){sample(y*w);sample(y*w+w-1)}
  const med=a=>a.sort((x,y)=>x-y)[a.length>>1],R=med(rs),G=med(gs),B=med(bs);
  const dist=(i,r,g,b)=>Math.hypot(d[i*4]-r,d[i*4+1]-g,d[i*4+2]-b);
  const fl=new Uint8Array(N),st=new Int32Array(N);let sp=0;
  const tryPush=(p,from)=>{if(fl[p])return;const dd=dist(p,R,G,B);
    if(dd<tol||(from>=0&&dist(p,d[from*4],d[from*4+1],d[from*4+2])<tol*.3&&dd<tol*2.2)){fl[p]=1;st[sp++]=p}};
  for(let x=0;x<w;x++){tryPush(x,-1);tryPush((h-1)*w+x,-1)}for(let y=0;y<h;y++){tryPush(y*w,-1);tryPush(y*w+w-1,-1)}
  while(sp){const p=st[--sp],x=p%w,y=(p/w)|0;if(x>0)tryPush(p-1,p);if(x<w-1)tryPush(p+1,p);if(y>0)tryPush(p-w,p);if(y<h-1)tryPush(p+w,p)}
  const lab=new Uint8Array(N);for(let i=0;i<N;i++)lab[i]=fl[i]?0:1;
  largestCC(lab,w,h);return lab;
}
/* ---------- éditeur de détourage ---------- */
const CUT={slot:0,src:null,w:0,h:0,data:null,mask:null,fgS:null,bgS:null,undo:[],tool:'keep',busy:false,rect:null};
function cutRender(){
  const cv=$('cutcv'),x=cv.getContext('2d'),w=CUT.w,h=CUT.h,out=x.createImageData(w,h),o=out.data,d=CUT.data,m=CUT.mask;
  for(let yy=0,i=0;yy<h;yy++)for(let xx=0;xx<w;xx++,i++){
    const a=m[i]/255,chk=(((xx>>3)+(yy>>3))&1)?206:238,j=i*4;
    let r,g,b;
    if(a>=1){r=d[j];g=d[j+1];b=d[j+2]}else{const k=.2*(1-a);r=d[j]*(a+k)+chk*(1-a-k);g=d[j+1]*(a+k)+chk*(1-a-k);b=d[j+2]*(a+k)+chk*(1-a-k)}
    if(CUT.fgS[i]){g=g*.6+255*.4;r*=.6;b*=.6}else if(CUT.bgS[i]){r=r*.6+255*.4;g*=.6;b*=.6}
    o[j]=r;o[j+1]=g;o[j+2]=b;o[j+3]=255;
  }
  x.putImageData(out,0,0);
}
function cutPush(){CUT.undo.push({m:CUT.mask.slice(),f:CUT.fgS.slice(),b:CUT.bgS.slice()});if(CUT.undo.length>14)CUT.undo.shift()}
function cutAuto(push){
  if(CUT.busy)return;CUT.busy=true;$('cut-state').textContent='Détection en cours…';
  setTimeout(()=>{
    try{if(push)cutPush();const t0=performance.now(),m=autoMask(CUT.data,CUT.w,CUT.h,CUT.fgS,CUT.bgS,CUT.rect);CUT.mask=m;cutRender();
      $('cut-state').textContent='Corrigez avec « + Garder » / « − Effacer » (le calcul se refait après chaque trait), ou tracez un cadre autour de la personne.'}
    catch(e){console.error(e);$('cut-state').textContent='La détection a échoué.'}
    CUT.busy=false;
  },30);
}
function cutFlood(){
  cutPush();const lab=floodBg(CUT.data,CUT.w,CUT.h,+$('cut-tol').value);
  for(let i=0;i<lab.length;i++)CUT.mask[i]=lab[i]?255:0;
  for(let i=0;i<lab.length;i++){if(CUT.fgS[i])CUT.mask[i]=255;if(CUT.bgS[i])CUT.mask[i]=0}
  cutRender();$('cut-state').textContent='Fond uni retiré. Corrigez avec les pinceaux si besoin.';
}
function cutOpen(slot){
  const ph=slotPhoto(slot,false);if(!ph){toast("Ajoutez d'abord une photo.");return}
  const wc=workCanvas(ph.src,460),w=wc.width,h=wc.height;
  Object.assign(CUT,{slot,src:ph.src,w,h,data:wc.getContext('2d',{willReadFrequently:true}).getImageData(0,0,w,h).data,mask:new Uint8Array(w*h).fill(255),fgS:new Uint8Array(w*h),bgS:new Uint8Array(w*h),undo:[],tool:'keep'});
  const cv=$('cutcv');cv.width=w;cv.height=h;
  $('cutov').hidden=false;document.body.style.overflow='hidden';CUT.rect=null;cutRender();syncCutUI();cutAuto();
}
function syncCutUI(){document.querySelectorAll('#cut-tools button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.t===CUT.tool)))}
function cutPaint(px,py){
  const cv=$('cutcv'),rc=cv.getBoundingClientRect(),k=CUT.w/rc.width,r=Math.max(2,+$('cut-size').value*k/2),x=(px-rc.left)*k,y=(py-rc.top)*k;
  const x0=Math.max(0,Math.floor(x-r)),x1=Math.min(CUT.w-1,Math.ceil(x+r)),y0=Math.max(0,Math.floor(y-r)),y1=Math.min(CUT.h-1,Math.ceil(y+r));
  const keep=CUT.tool==='keep';
  for(let yy=y0;yy<=y1;yy++)for(let xx=x0;xx<=x1;xx++){if((xx-x)**2+(yy-y)**2>r*r)continue;const i=yy*CUT.w+xx;
    if(keep){CUT.fgS[i]=1;CUT.bgS[i]=0;CUT.mask[i]=255}else{CUT.bgS[i]=1;CUT.fgS[i]=0;CUT.mask[i]=0}}
  cutRender();
}
function cutFinish(){
  const src=CUT.src,S=Math.min(1,1400/Math.max(src.width,src.height)),W=Math.max(8,Math.round(src.width*S)),H=Math.max(8,Math.round(src.height*S));
  const out=document.createElement('canvas');out.width=W;out.height=H;const ox=out.getContext('2d',{willReadFrequently:true});
  ox.drawImage(src,0,0,W,H);const od=ox.getImageData(0,0,W,H),dd=od.data,m=new Float32Array(CUT.w*CUT.h);
  for(let i=0;i<m.length;i++)m[i]=CUT.mask[i]/255;
  /* le masque (basse résolution) est recollé aux vrais contours de la photo en pleine taille */
  let al=guidedAlpha(upMask(m,CUT.w,CUT.h,W,H),dd,W,H,Math.max(2,Math.round(W*.004)),.0004);
  const fe=Math.round(+$('cut-feather').value*(W/CUT.w)/2);if(fe>=1)al=boxBlurF(al,W,H,fe);
  for(let i=0;i<W*H;i++)dd[i*4+3]=Math.round(dd[i*4+3]*sharpen(al[i]));
  ox.putImageData(od,0,0);
  const t=trimAlpha(out,12);if(!t){toast("Rien n'est gardé : ajustez les traits.");return}
  if(CUT.slot===0){v.cut=t;v.sampleMain=false}else if(v.extra[CUT.slot-1])v.extra[CUT.slot-1].cut=t;
  cutClose();renderSlots();toast('Détourage appliqué.');schedule();
}
function cutClose(){$('cutov').hidden=true;document.body.style.overflow=''}
function wireCut(){
  const cv=$('cutcv');let down=false,rs=null,tm=0;
  const pt=e=>{const rc=cv.getBoundingClientRect(),k=CUT.w/rc.width;return{x:Math.min(CUT.w-1,Math.max(0,(e.clientX-rc.left)*k)),y:Math.min(CUT.h-1,Math.max(0,(e.clientY-rc.top)*k))}};
  cv.addEventListener('pointerdown',e=>{down=true;try{cv.setPointerCapture(e.pointerId)}catch(_){}
    if(CUT.tool==='rect'){rs=pt(e)}else{cutPush();cutPaint(e.clientX,e.clientY)}e.preventDefault()});
  cv.addEventListener('pointermove',e=>{if(!down)return;
    if(rs){const q=pt(e);cutRender();const x=cv.getContext('2d');x.save();x.setLineDash([8,6]);x.lineWidth=Math.max(2,CUT.w/200);x.strokeStyle='#fff';x.strokeRect(rs.x,rs.y,q.x-rs.x,q.y-rs.y);x.restore()}else cutPaint(e.clientX,e.clientY)});
  const up=e=>{if(!down)return;down=false;
    if(rs){const q=pt(e),r={x0:Math.min(rs.x,q.x),y0:Math.min(rs.y,q.y),x1:Math.max(rs.x,q.x),y1:Math.max(rs.y,q.y)};rs=null;
      if(r.x1-r.x0>CUT.w*.08&&r.y1-r.y0>CUT.h*.08){CUT.rect=r;cutAuto(true)}else cutRender()}
    else{clearTimeout(tm);tm=setTimeout(()=>cutAuto(false),350)}};
  cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
  $('cut-tools').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;CUT.tool=b.dataset.t;syncCutUI()});
  $('cut-auto').addEventListener('click',()=>{CUT.rect=null;cutAuto(true)});$('cut-flood').addEventListener('click',cutFlood);
  $('cut-undo').addEventListener('click',()=>{const u=CUT.undo.pop();if(!u)return;CUT.mask=u.m;CUT.fgS=u.f;CUT.bgS=u.b;cutRender()});
  $('cut-reset').addEventListener('click',()=>{cutPush();CUT.rect=null;CUT.mask.fill(255);CUT.fgS.fill(0);CUT.bgS.fill(0);cutRender()});
  $('cut-ok').addEventListener('click',cutFinish);$('cut-cancel').addEventListener('click',cutClose);
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('cutov').hidden)cutClose()});
}
/* ---------- gestion des photos du visuel ---------- */
async function loadSlotFile(i,file){
  try{
    const url=await readDataURL(file),img=await loadImg(url),c=canvasFromImg(img,2400),alpha=hasAlphaOf(c);
    if(i===0){setPhoto(c);v.sampleMain=false;$('photo-tag').textContent=file.name.length>28?file.name.slice(0,25)+'…':file.name;if(alpha){const t=trimAlpha(c,12);if(t)v.cut=t}}
    else{
      const ph={src:c,w:c.width,h:c.height},a={photo:ph,photoSm:mkSm(ph),cut:null,zoom:1,fx:.5,fy:.5,name:file.name};
      if(alpha){const t=trimAlpha(c,12);if(t)a.cut=t}
      v.extra[i-1]=a;
    }
    renderSlots();syncControls();schedule();
    if(alpha)toast('Photo déjà détourée : utilisée comme découpe.');
  }catch(e){toast("Ce fichier n'a pas pu être lu comme image.")}
}
function renderSlots(){
  const box=$('slots');if(!box)return;
  const n=1+v.extra.length,rows=[];
  for(let i=0;i<n;i++){
    const ph=slotPhoto(i,true),cut=i===0?v.cut:(v.extra[i-1]&&v.extra[i-1].cut);
    rows.push(`<div class="slot" data-i="${i}"><canvas class="slot-th" width="64" height="64"></canvas><div class="slot-main"><b>${i===0?'Photo principale':'Photo '+(i+1)}</b><small>${cut?'Détourée':'Photo entière'}</small>
      <div class="slot-btns"><button type="button" class="btn small" data-a="file">Changer</button><button type="button" class="btn small" data-a="cut">Détourer</button>${cut?'<button type="button" class="btn small" data-a="uncut">Garder entière</button>':''}${i>0?'<button type="button" class="btn small" data-a="del">Retirer</button>':''}</div>
      ${i>0&&ph?`<div class="grid2 slot-adj"><label>Zoom<input type="range" data-a="zoom" min="1" max="3" step="0.01" value="${v.extra[i-1].zoom}"></label><label>Horizontal<input type="range" data-a="fx" min="0" max="1" step="0.01" value="${v.extra[i-1].fx}"></label><label>Vertical<input type="range" data-a="fy" min="0" max="1" step="0.01" value="${v.extra[i-1].fy}"></label></div>`:''}
    </div></div>`);
  }
  if(v.extra.length<MAXX)rows.push('<div class="slot-add"><button type="button" class="btn" data-a="add">+ Ajouter une photo</button><small>Jusqu\'à 4 photos par visuel, pour les modèles à plusieurs images.</small></div>');
  box.innerHTML=rows.join('');
  box.querySelectorAll('.slot').forEach(s=>{
    const i=+s.dataset.i,c=s.querySelector('canvas'),x=c.getContext('2d'),ph=slotPhoto(i,true);x.fillStyle='#202c34';x.fillRect(0,0,64,64);
    const cut=i===0?v.cut:(v.extra[i-1]&&v.extra[i-1].cut);
    if(cut){const sc=Math.min(60/cut.width,60/cut.height);x.drawImage(cut,32-cut.width*sc/2,62-cut.height*sc,cut.width*sc,cut.height*sc)}
    else if(ph){const sc=Math.max(64/ph.w,64/ph.h);x.drawImage(ph.src,32-ph.w*sc/2,32-ph.h*sc/2,ph.w*sc,ph.h*sc)}
  });
}
function wireSlots(){
  const box=$('slots'),fi=$('slot-file');let target=0,multi=false;
  box.addEventListener('click',e=>{
    const b=e.target.closest('button');if(!b)return;const s=b.closest('.slot'),i=s?+s.dataset.i:0,a=b.dataset.a;
    if(a==='file'){target=i;multi=false;fi.multiple=false;fi.click()}
    else if(a==='add'){target=1+v.extra.length;multi=true;fi.multiple=true;fi.click()}
    else if(a==='cut')cutOpen(i);
    else if(a==='uncut'){if(i===0){v.cut=null;v.sampleMain=false}else v.extra[i-1].cut=null;renderSlots();schedule()}
    else if(a==='del'){v.extra.splice(i-1,1);renderSlots();schedule()}
  });
  box.addEventListener('input',e=>{const r=e.target;if(r.type!=='range')return;const s=r.closest('.slot'),a=v.extra[+s.dataset.i-1];if(a){a[r.dataset.a]=+r.value;schedule()}});
  fi.addEventListener('change',async e=>{const fs=[...e.target.files];e.target.value='';
    if(!fs.length)return;
    if(multi){let t=1+v.extra.length;for(const f of fs){if(t-1>=MAXX)break;await loadSlotFile(t,f);t++}}
    else await loadSlotFile(target,fs[0]);
  });
}
