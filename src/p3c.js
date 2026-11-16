
/* ---------- modèles ---------- */
function layoutFor(tpl,W,H,k){
  const{base,wide,m,safeY,hasFooter,footEst,pos}=k;
  const full={x:0,y:0,w:W,h:H},inner={x:m,y:safeY+m,w:W-2*m,h:H-2*safeY-2*m};
  const L={photo:full,shape:'rect',content:inner,logoArea:full,textOnPhoto:true,ovType:'gradient',ovAlpha:.95,footer:'bottom',sizeK:1,ty:null,align:null,lines:wide?3:4,logoMM:null,panelFit:null,frame:null,upper:false,
    bgColor:'bg',panelCol:null,font:null,ownKicker:false,tagsStack:false,demoTags:null,tagFill:null,tagsNum:false,footOnBg:false,footArea:null,radMul:1,logoMul:1,logoCenter:null,badgeDef:null,before:null,after:null};
  const r=Math.round,inset=r(base*.035);
  const frameLine=(c,e,col,alpha)=>{c.save();c.strokeStyle=col;c.globalAlpha=alpha;c.lineWidth=Math.max(2.5,e.base*.0055);c.beginPath();rrPath(c,inset,inset+e.safeY*.4,e.W-2*inset,e.H-2*inset-e.safeY*.8,e.base*.06);c.stroke();c.restore()};
  const sideSplit=(pw,rad)=>{ /* photo à droite, texte à gauche (formats larges) */
    const px=r(W*pw),left=r(base*.07);L.photo={x:px,y:r(base*.05),w:W-px-r(base*.05),h:H-2*r(base*.05)};L.content={x:left,y:r(base*.08),w:px-left-r(base*.05),h:H-r(base*.16)};L.sizeK=.72;L.lines=4;L.logoArea=L.photo;L.logoMM=r(base*.035)};
  switch(tpl){
    case'bandeau':L.footer='bar';break;
    case'cadre':{
      L.textOnPhoto=false;L.ovType='none';L.shape='round';L.ty='t';
      const f=r(base*.05);
      if(!wide){const fh=r(base*(hasFooter?.36:.28)),fy=H-safeY-fh,py=f+r(safeY*.5);L.photo={x:f,y:py,w:W-2*f,h:fy-py-r(f*.6)};L.content={x:m,y:fy,w:W-2*m,h:fh-r(m*.7)};L.sizeK=.62;L.lines=2}
      else{const px=r(W*.44),left=r(base*.07);L.photo={x:px,y:f,w:W-px-f,h:H-2*f};L.content={x:left,y:r(f*1.6),w:px-left-r(base*.05),h:H-r(f*3.2)};L.sizeK=.75;L.lines=4}
      L.logoArea=L.photo;L.logoMM=r(base*.035);break}
    case'carte':
      L.ovType='solid';L.ovAlpha=.4;L.ty='m';L.align='center';L.footer='under';L.sizeK=.8;
      L.panelFit={x:wide?r(W*.2):m,w:wide?r(W*.6):W-2*m,pad:r(base*.05),radius:base*.03,alpha:.95};break;
    case'split':{
      L.textOnPhoto=false;L.ovType='none';L.ty='m';L.sizeK=.7;L.lines=3;
      if(!wide){const ph=r(H*.54);L.photo={x:0,y:0,w:W,h:ph};L.content={x:m,y:ph+r(m*.7),w:W-2*m,h:H-safeY-ph-r(m*1.5)}}
      else{const px=r(W*.5);L.photo={x:0,y:0,w:px,h:H};L.content={x:px+m,y:m,w:W-px-2*m,h:H-2*m}}
      L.logoArea=L.photo;break}
    case'minimal':L.ovAlpha=.6;L.footer='under';L.sizeK=.7;L.lines=3;break;
    case'centre':L.ovType='solid';L.ovAlpha=.52;L.ty='m';L.align='center';L.sizeK=1.05;break;
    case'cercle':{
      L.textOnPhoto=false;L.ovType='none';L.shape='circle';L.ty='m';L.sizeK=.7;
      if(!wide){const d=r(Math.min(W*.66,(H-safeY*2)*.5));L.photo={x:(W-d)/2,y:safeY+r(m*.8),w:d,h:d};const top=L.photo.y+d+r(m*.7);L.content={x:m,y:top,w:W-2*m,h:H-safeY-m-top};L.align='center';L.lines=3}
      else{const d=r(H*.8),left=r(base*.07);L.photo={x:W-d-r(H*.1),y:(H-d)/2,w:d,h:d};L.content={x:left,y:m,w:L.photo.x-left-r(base*.05),h:H-2*m};L.lines=4}
      break}
    case'arche':{
      L.textOnPhoto=false;L.ovType='none';L.shape='arch';L.ty='m';L.sizeK=.7;
      if(!wide){const w=r(W*.62),h=r((H-safeY*2)*.5);L.photo={x:(W-w)/2,y:safeY+r(m*.8),w,h};const top=L.photo.y+h+r(m*.7);L.content={x:m,y:top,w:W-2*m,h:H-safeY-m-top};L.align='center';L.lines=3}
      else{const w=r(H*.62),h=r(H*.86),left=r(base*.07);L.photo={x:W-w-r(H*.1),y:(H-h)/2,w,h};L.content={x:left,y:m,w:L.photo.x-left-r(base*.05),h:H-2*m};L.lines=4}
      break}
    case'ruban':
      L.ovType='none';L.ty='m';L.align='center';L.footer='under';L.sizeK=.85;
      L.panelFit={x:0,w:W,pad:r(base*.045),radius:0,alpha:.92};break;
    case'magazine':
      L.frame={inset:r(base*.035),lw:Math.max(3,base*.006)};
      L.content={x:r(m*1.25),y:safeY+r(m*1.25),w:W-r(2.5*m),h:H-2*safeY-r(2.5*m)};
      L.ty='t';L.sizeK=1.05;L.upper=true;break;

    /* ===== nouveaux modèles ===== */
    case'lisere':
      L.content={x:r(m*1.2),y:safeY+r(m*1.2),w:W-r(2.4*m),h:H-2*safeY-r(2.4*m)};L.sizeK=.92;
      L.after=(c,e)=>frameLine(c,e,e.C.accent,.95);break;
    case'panneau':{
      L.panelCol='accent';L.ovType='none';L.textOnPhoto=false;L.footer='under';L.ty='t';L.lines=3;L.sizeK=.95;
      const bot=H-Math.max(inset,r(safeY*.5)),x0=inset,x1=W-inset;
      if(!wide){
        const top=r(H*(hasFooter?.5:.54)),nd=r(base*.085),R=r(base*.06);
        L.content={x:x0+r(m*.8),y:top+nd+r(m*.3),w:x1-x0-r(m*1.6),h:bot-top-nd-r(m*.9)};
        L.panel={kind:'notch',x0,x1,top,nd,R,nx0:r(W*.28),nx1:r(W*.64),bot};
      }else{
        const pw=r(W*.46);L.panel={kind:'rect',x0,x1:x0+pw,top:inset,bot:H-inset,R:r(base*.06)};
        L.content={x:x0+r(base*.07),y:r(base*.1),w:pw-r(base*.14),h:H-r(base*.2)};L.sizeK=.85;L.lines=4;L.ty='m';L.logoArea={x:x0+pw,y:0,w:W-x0-pw,h:H};
      }
      L.after=(c,e)=>{
        frameLine(c,e,'#FFFFFF',.85);
        c.save();c.shadowColor='rgba(0,0,0,.25)';c.shadowBlur=e.base*.03;c.fillStyle=e.C.accent;panelPath(c,L.panel);c.fill();c.restore()};
      break}
    case'encoches':{
      L.bgColor='accent';L.textOnPhoto=false;L.ovType='none';L.shape='round';L.radMul=2.2;L.ty='b';L.lines=2;L.sizeK=1.6;L.upper=true;L.footer='under';L.font={d:'AM_bigshoulders'};L.ownKicker=true;
      const f=r(base*.045);
      if(!wide){
        const ph=r(H*(hasFooter?.58:.64));L.photo={x:f,y:f+r(safeY*.5),w:W-2*f,h:ph};
        const top=L.photo.y+ph+r(m*.55);L.content={x:f+r(m*.5),y:top,w:W-2*f-r(m),h:H-safeY-top-r(m*.7)};
      }else{
        const px=r(W*.42);L.photo={x:px,y:f,w:W-px-f,h:H-2*f};L.content={x:f+r(m*.5),y:f+r(m*.5),w:px-f-r(m*1.2),h:H-2*f-r(m)};L.ty='m';L.lines=4;L.sizeK=1.5;
      }
      L.logoArea=L.photo;L.logoMM=r(base*.04);
      L.after=(c,e)=>{
        if(!e.kick)return;
        const P=e.L.photo,ks=e.base*(e.wide?.04:.03);c.save();c.font=fontBB(e.pair,ks);
        const tw=Math.min(P.w*.7,c.measureText(e.kick).width+ks*2.4),th=Math.max(e.base*.085,ks*2.8),rr=e.base*.032,right=e.pos[1]==='l';
        c.fillStyle=e.C.accent;
        c.save();if(right){c.translate(P.x*2+P.w,0);c.scale(-1,1)}tabPath(c,P.x,P.y,tw,th,rr);c.fill();c.restore();
        c.fillStyle=e.tcol;c.textBaseline='middle';c.textAlign='left';
        const tx=right?P.x+P.w-tw+ks*1.1:P.x+ks*1.1;c.fillText(e.kick,tx,P.y+th/2+ks*.05,tw-ks*1.6);c.restore()};
      break}
    case'cartecta':{
      L.panelCol='accent';L.ovType='none';L.textOnPhoto=false;L.shape='round';L.radMul=2.4;L.align='center';L.ty='m';L.sizeK=.95;L.lines=3;L.footOnBg=true;
      const f=r(base*.04);
      if(!wide){
        const py=f+r(safeY*.5),ph=r(H*(H/W>1.6?.47:.56)),cy=py+ph-r(base*.04),zone=hasFooter?footEst+r(m*1.3):r(m*.6),ch=H-safeY-zone-cy;
        L.photo={x:f,y:py,w:W-2*f,h:ph};L.card={x:f,y:cy,w:W-2*f,h:ch};
        L.content={x:f+r(base*.05),y:cy+r(base*.035),w:W-2*f-r(base*.1),h:ch-r(base*.07)};
        L.footer='bottom';L.footArea={x:f,w:W-2*f};
      }else{
        const pw=r(W*.5);L.photo={x:f,y:f,w:pw,h:H-2*f};L.card={x:pw-r(base*.05),y:f,w:W-pw-f+r(base*.05),h:H-2*f};
        L.content={x:L.card.x+r(base*.08),y:f+r(base*.04),w:L.card.w-r(base*.14),h:H-2*f-r(base*.08)};L.footer='under';L.sizeK=.85;L.lines=4;
      }
      L.logoArea=L.photo;L.logoMM=r(base*.035);
      L.after=(c,e)=>{
        const P=e.L.photo,K=e.L.card;
        c.save();c.strokeStyle=e.C.accent;c.lineWidth=Math.max(3,e.base*.005);c.beginPath();rrPath(c,P.x,P.y,P.w,P.h,e.rad);c.stroke();
        c.fillStyle=e.C.accent;c.beginPath();rrPath(c,K.x,K.y,K.w,K.h,e.base*.05);c.fill();c.restore()};
      break}
    case'courbe':{
      L.bgColor='accent';L.textOnPhoto=false;L.ovType='none';L.footer='under';L.ty='t';L.lines=3;L.sizeK=.95;
      if(!wide){
        const py=r(H*(hasFooter?.5:.44));L.photo={x:0,y:py,w:W,h:H-py};L.shape='wave';
        L.content={x:r(m*1.1),y:safeY+r(m*1.1),w:W-r(2.2*m),h:py-safeY-r(m*1.1)};
      }else{
        const px=r(W*.5);L.photo={x:px,y:0,w:W-px,h:H};L.shape='diagv';
        L.content={x:r(base*.07),y:r(base*.08),w:px-r(base*.12),h:H-r(base*.16)};L.ty='m';L.lines=4;L.sizeK=.85;
      }
      L.logoArea=wide?L.photo:full;
      L.after=(c,e)=>{
        const col=contrast(e.C.second,e.C.accent)>=1.5?e.C.second:'#FFFFFF';
        c.save();c.strokeStyle=col;c.lineWidth=e.base*.016;c.lineCap='round';c.beginPath();
        if(!e.wide){c.moveTo(-e.W*.05,e.H*.5);c.bezierCurveTo(e.W*.22,e.H*.34,e.W*.45,e.H*.82,e.W*1.05,e.H*.5)}
        else{c.moveTo(e.W*.46,-e.H*.05);c.bezierCurveTo(e.W*.62,e.H*.3,e.W*.34,e.H*.7,e.W*.52,e.H*1.05)}
        c.stroke();c.restore()};
      break}
    case'bulle':{
      L.ovType='gradient';L.ovAlpha=.45;L.ty='b';L.align='left';L.footer='under';L.sizeK=.9;L.lines=4;
      L.content={x:m,y:safeY+m,w:W-2*m,h:H-2*safeY-2*m-r(base*.05)};
      {const pw=r(wide?W*.48:W*.68);L.panelFit={x:(wide&&pos&&pos[1]==='l')?W-pw-m:m,w:pw,pad:r(base*.045),radius:base*.055,alpha:1,color:'accent',tail:'bl'}}break}
    case'diagonale':{
      L.textOnPhoto=false;L.ovType='none';L.ty='t';L.lines=3;L.sizeK=.95;L.footer='under';
      if(!wide){const ph=r(H*(hasFooter?.6:.66));L.photo={x:0,y:0,w:W,h:ph};L.shape='diag';L.content={x:m,y:ph+r(H*.05),w:W-2*m,h:H-safeY-ph-r(H*.05)-r(m*.6)}}
      else{const pw=r(W*.56);L.photo={x:0,y:0,w:pw,h:H};L.shape='diagr';L.content={x:pw+r(base*.02),y:m,w:W-pw-m-r(base*.02),h:H-2*m};L.ty='m';L.lines=4;L.sizeK=.85}
      L.logoArea=L.photo;
      L.after=(c,e)=>{
        const P=e.L.photo;c.save();c.strokeStyle=e.C.accent;c.lineWidth=e.base*.02;c.beginPath();
        if(!e.wide){c.moveTo(0,P.h+e.base*.03);c.lineTo(e.W,P.h*.72+e.base*.03)}else{c.moveTo(P.w*.82+e.base*.03,P.h);c.lineTo(P.w+e.base*.03,0)}
        c.stroke();c.restore()};
      break}
    case'vague':case'nuage':{
      L.textOnPhoto=false;L.ovType='none';L.ty='t';L.lines=3;L.sizeK=.95;L.footer='under';L.shape=tpl==='vague'?'waveb':'cloud';
      if(tpl==='nuage')L.align='center';
      if(!wide){const ph=r(H*(hasFooter?(tpl==='nuage'?.5:.54):(tpl==='nuage'?.58:.62)));L.photo={x:0,y:0,w:W,h:ph};L.content={x:m,y:ph+r(m*.4),w:W-2*m,h:H-safeY-ph-r(m*1.3)}}
      else{const pw=r(W*.5);L.photo={x:0,y:0,w:pw,h:H};L.shape='diagr';L.content={x:pw+r(base*.02),y:m,w:W-pw-m-r(base*.02),h:H-2*m};L.ty='m';L.lines=4;L.sizeK=.85;L.align='left'}
      L.logoArea=L.photo;
      L.after=(c,e)=>{
        const P=e.L.photo;c.save();
        if(tpl==='vague'&&!e.wide){c.strokeStyle=e.C.accent;c.lineWidth=e.base*.014;c.lineCap='round';c.beginPath();const a=P.h*.07,d=e.base*.03;
          c.moveTo(P.w+10,P.h-a*.3+d);c.bezierCurveTo(P.w*.72,P.h-a*2.6+d,P.w*.3,P.h+d,-10,P.h-a*1.3+d);c.stroke()}
        else if(tpl==='nuage'&&!e.wide){c.fillStyle=rgba(e.C.accent,.9);c.beginPath();c.arc(e.W-e.base*.07,P.h+e.base*.02,e.base*.035,0,Math.PI*2);c.fill();c.beginPath();c.arc(e.base*.06,P.h+e.base*.05,e.base*.02,0,Math.PI*2);c.fill()}
        c.restore()};
      break}
    case'citation':{
      L.textOnPhoto=false;L.ovType='none';L.shape='circle';L.align='center';L.ty='m';L.lines=6;L.sizeK=.9;
      if(!wide){const d=r(base*.3);L.photo={x:(W-d)/2,y:safeY+r(m*1.2),w:d,h:d};const top=L.photo.y+d+r(m*.6)+r(base*.1);L.content={x:r(m*1.3),y:top,w:W-r(2.6*m),h:H-safeY-m-top}}
      else{const d=r(H*.66);L.photo={x:r(base*.08),y:(H-d)/2,w:d,h:d};L.content={x:L.photo.x+d+r(base*.07),y:m,w:W-(L.photo.x+d+r(base*.07))-m,h:H-2*m};L.align='left';L.sizeK=.7;L.lines=5}
      L.logoArea=full;
      L.after=(c,e)=>{const P=e.L.photo;c.save();c.fillStyle=e.C.accent;const fs=Math.round(e.base*(e.wide?.32:.26));c.font=`${fs}px "${e.pair.d}", serif`;c.textBaseline='alphabetic';c.textAlign='center';
        if(e.wide)c.fillText('\u201C',P.x+P.w+e.base*.04,P.y+fs*.55);else c.fillText('\u201C',P.x+P.w/2,P.y+P.h+fs*.78);c.restore()};
      break}
    case'offre':
      L.ovAlpha=.92;L.ty='b';L.sizeK=.95;L.badgeDef='-30%';if(wide)L.content={x:m,y:safeY+m,w:r((W-2*m)*.66),h:H-2*safeY-2*m};break;
    case'conseil':{
      L.bgColor='accent';L.textOnPhoto=false;L.ovType='none';L.shape='round';L.radMul=2.4;L.ty='t';L.lines=3;L.sizeK=.9;L.footer='under';L.tagsNum=true;L.demoTags=DEMO_TAGS;L.tagFill='soft';
      const f=r(base*.045);
      if(!wide){const ph=r(H*.4);L.photo={x:f,y:f+r(safeY*.5),w:W-2*f,h:ph};const top=L.photo.y+ph+r(m*.5);L.content={x:f+r(m*.4),y:top,w:W-2*f-r(m*.8),h:H-safeY-top-r(m*.7)}}
      else{const px=r(W*.46);L.photo={x:px,y:f,w:W-px-f,h:H-2*f};L.content={x:f+r(m*.4),y:f+r(m*.4),w:px-f-r(m),h:H-2*f-r(m*.8)};L.ty='m';L.lines=4;L.sizeK=.85}
      L.logoArea=L.photo;L.logoMM=r(base*.035);
      L.after=(c,e)=>frameLine(c,e,'#FFFFFF',.5);
      break}
    case'etiquettes':
      L.ovAlpha=1;L.ty='b';L.tagsStack=true;L.demoTags=DEMO_TAGS;L.tagFill='accent';L.sizeK=.95;break;
    case'marque':
      L.ovType='solid';L.ovAlpha=.55;L.align='center';L.ty='b';L.lines=3;L.sizeK=.85;L.logoMul=wide?1.35:2.1;L.logoCenter=wide?.33:.36;if(wide){L.sizeK=.62;L.lines=2}break;
  }
  return L;
}
